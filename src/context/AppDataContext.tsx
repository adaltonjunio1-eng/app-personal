import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '../hooks/useAuth';
import type {
  AgendaEvent,
  ChatMessage,
  Exercise,
  MealPlan,
  NotificationItem,
  ProgressEntry,
  StudentProfile,
  Workout,
} from '../types';
import {
  getAgenda,
  getChatMessages,
  getExercises,
  getMealPlan,
  getNotifications,
  getProgress,
  getStudentProfile,
  getStudents,
  getWorkouts,
} from '../services/mockApi';

interface AppDataState {
  students: StudentProfile[];
  workouts: Record<string, Workout[]>;
  exercises: Record<string, Exercise[]>;
  progress: Record<string, ProgressEntry>;
  agenda: AgendaEvent[];
  notifications: NotificationItem[];
  mealPlan?: MealPlan;
  chat: ChatMessage[];
}

const initialState: AppDataState = {
  students: [],
  workouts: {},
  exercises: {},
  progress: {},
  agenda: [],
  notifications: [],
  mealPlan: undefined,
  chat: [],
};

interface AppDataContextValue extends AppDataState {
  loading: boolean;
  refresh: () => Promise<void>;
  markWorkoutCompleted: (studentId: string, workoutId: string) => void;
  toggleNotification: (notificationId: string, value: boolean) => void;
  sendMessage: (message: Omit<ChatMessage, 'id' | 'date'>) => void;
  logProgress: (studentId: string, entry: { date: string; value: number }) => void;
  addFeedNotification: (userId: string, type: 'feed-like' | 'feed-comment', postId: string, fromUser: string) => void;
  setExercises: (exercises: Record<string, Exercise[]>) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'date' | 'read'>) => void;
}

export const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<AppDataState>(initialState);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setState(initialState);
      return;
    }
    setLoading(true);
    try {
      if (user.type === 'personal') {
        const students = await getStudents(user.id);
        const workoutMap: Record<string, Workout[]> = {};
        const progressMap: Record<string, ProgressEntry> = {};
        const exercisesMap: Record<string, Exercise[]> = {};

        await Promise.all(
          students.map(async (student) => {
            const workouts = await getWorkouts(student.id_user);
            workoutMap[student.id_user] = workouts;
            const progressEntry = await getProgress(student.id_user);
            if (progressEntry) {
              progressMap[student.id_user] = progressEntry;
            }
            await Promise.all(
              workouts.map(async (workout) => {
                const exercises = await getExercises(workout.id);
                exercisesMap[workout.id] = exercises;
              }),
            );
          }),
        );

        const [notifications, chat] = await Promise.all([
          getNotifications(user.id),
          getChatMessages(user.id),
        ]);

        setState({
          students,
          workouts: workoutMap,
          exercises: exercisesMap,
          progress: progressMap,
          agenda: [],
          notifications,
          mealPlan: undefined,
          chat,
        });
      } else {
        const [profile, workouts, progressEntry, agenda, notifications, chat, mealPlan] =
          await Promise.all([
            getStudentProfile(user.id),
            getWorkouts(user.id),
            getProgress(user.id),
            getAgenda(user.id),
            getNotifications(user.id),
            getChatMessages(user.id),
            getMealPlan(user.id),
          ]);
        const exercisesMap: Record<string, Exercise[]> = {};
        await Promise.all(
          workouts.map(async (workout) => {
            const exercises = await getExercises(workout.id);
            exercisesMap[workout.id] = exercises;
          }),
        );

        setState({
          students: profile ? [profile] : [],
          workouts: { [user.id]: workouts },
          exercises: exercisesMap,
          progress: progressEntry ? { [user.id]: progressEntry } : {},
          agenda,
          notifications,
          mealPlan,
          chat,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const markWorkoutCompleted = useCallback(
    (studentId: string, workoutId: string) => {
      setState((prev) => {
        const updated = { ...prev.workouts };
        const list = updated[studentId]?.map((workout) =>
          workout.id === workoutId ? { ...workout, status: 'concluido' as const } : workout,
        );
        if (list) {
          updated[studentId] = list;
        }
        return { ...prev, workouts: updated };
      });
    },
    [],
  );

  const toggleNotification = useCallback((notificationId: string, value: boolean) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, read: value } : notification,
      ),
    }));
  }, []);

  const sendMessage = useCallback(
    (message: Omit<ChatMessage, 'id' | 'date'>) => {
      setState((prev) => ({
        ...prev,
        chat: [
          ...prev.chat,
          { ...message, id: `local-${Date.now()}`, date: new Date().toISOString() },
        ],
      }));
    },
    [],
  );

  const logProgress = useCallback((studentId: string, entry: { date: string; value: number }) => {
    setState((prev) => {
      const progressMap = { ...prev.progress };
      const current = progressMap[studentId];
      if (current) {
        progressMap[studentId] = {
          ...current,
          weight: [...current.weight, entry].sort((a, b) => a.date.localeCompare(b.date)),
        };
      } else {
        progressMap[studentId] = {
          id_usuario: studentId,
          weight: [entry],
          measurements: [],
          photos: [],
        };
      }
      return { ...prev, progress: progressMap };
    });
  }, []);

  const addFeedNotification = useCallback((userId: string, type: 'feed-like' | 'feed-comment', postId: string, fromUser: string) => {
    setState((prev) => ({
      ...prev,
      notifications: [
        {
          id: `feed-${Date.now()}`,
          id_user: userId,
          type,
          title: type === 'feed-like' ? 'Nova curtida no seu post' : 'Novo comentário no seu post',
          message: type === 'feed-like'
            ? `${fromUser} curtiu sua foto de pós-treino!`
            : `${fromUser} comentou na sua foto de pós-treino!`,
          date: new Date().toISOString(),
          read: false,
          postId,
        },
        ...prev.notifications,
      ],
    }));
  }, []);

  const setExercises = useCallback((exercises: Record<string, Exercise[]>) => {
    setState(prev => ({ ...prev, exercises }));
  }, []);

  const addNotification = useCallback((notification: Omit<NotificationItem, 'id' | 'date' | 'read'>) => {
    setState(prev => ({
      ...prev,
      notifications: [
        {
          id: `notif-${Date.now()}`,
          date: new Date().toISOString(),
          read: false,
          ...notification,
        },
        ...prev.notifications,
      ],
    }));
  }, []);

  const value = useMemo<AppDataContextValue>(
    () => ({
      ...state,
      loading,
      refresh,
      markWorkoutCompleted,
      toggleNotification,
      sendMessage,
      logProgress,
      addFeedNotification,
      setExercises,
      addNotification,
    }),
    [state, loading, refresh, markWorkoutCompleted, toggleNotification, sendMessage, logProgress, addFeedNotification, setExercises, addNotification],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}
