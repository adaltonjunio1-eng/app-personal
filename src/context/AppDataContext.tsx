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
  addStudent: (student: { name: string; phone: string; goal: string }) => void;
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

        // Verificar se precisa criar lembrete de peso para alunos
        const updatedNotifications = [...notifications];
        students.forEach((student) => {
          const studentProgress = progressMap[student.id_user];
          if (studentProgress && studentProgress.weight.length > 0) {
            const lastWeight = studentProgress.weight[studentProgress.weight.length - 1];
            const lastWeightDate = new Date(lastWeight.date);
            const today = new Date();
            const daysSinceLastWeight = Math.floor((today.getTime() - lastWeightDate.getTime()) / (1000 * 60 * 60 * 24));
            
            // Se passou 30 dias ou mais, criar lembrete
            if (daysSinceLastWeight >= 30) {
              const hasReminder = notifications.some(n => 
                n.id_user === student.id_user && 
                n.type === 'alerta' && 
                n.title.includes('Registrar seu Peso') &&
                !n.read
              );
              
              if (!hasReminder) {
                updatedNotifications.push({
                  id: `weight-reminder-${student.id_user}-${Date.now()}`,
                  id_user: student.id_user,
                  type: 'alerta',
                  title: '📊 Hora de Registrar seu Peso!',
                  message: `Já faz ${daysSinceLastWeight} dias desde seu último registro. Atualize seu progresso para acompanhar sua evolução!`,
                  date: new Date().toISOString(),
                  read: false,
                });
              }
            }
          }
        });

        setState({
          students,
          workouts: workoutMap,
          exercises: exercisesMap,
          progress: progressMap,
          agenda: [],
          notifications: updatedNotifications,
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

        // Verificar se precisa criar lembrete de peso
        const updatedNotifications = [...notifications];
        if (progressEntry && progressEntry.weight.length > 0) {
          const lastWeight = progressEntry.weight[progressEntry.weight.length - 1];
          const lastWeightDate = new Date(lastWeight.date);
          const today = new Date();
          const daysSinceLastWeight = Math.floor((today.getTime() - lastWeightDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // Se passou 30 dias ou mais, criar lembrete
          if (daysSinceLastWeight >= 30) {
            const hasReminder = notifications.some(n => 
              n.type === 'alerta' && 
              n.title.includes('Registrar seu Peso') &&
              !n.read
            );
            
            if (!hasReminder) {
              updatedNotifications.push({
                id: `weight-reminder-${user.id}-${Date.now()}`,
                id_user: user.id,
                type: 'alerta',
                title: '📊 Hora de Registrar seu Peso!',
                message: `Já faz ${daysSinceLastWeight} dias desde seu último registro. Atualize seu progresso para acompanhar sua evolução!`,
                date: new Date().toISOString(),
                read: false,
              });
            }
          }
        }

        setState({
          students: profile ? [profile] : [],
          workouts: { [user.id]: workouts },
          exercises: exercisesMap,
          progress: progressEntry ? { [user.id]: progressEntry } : {},
          agenda,
          notifications: updatedNotifications,
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

      // Criar notificação de lembrete para próximo mês
      const nextMonthDate = new Date(entry.date);
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
      
      const monthlyReminder: NotificationItem = {
        id: `weight-reminder-${Date.now()}`,
        id_user: studentId,
        type: 'alerta',
        title: '📊 Hora de Registrar seu Peso!',
        message: 'Já faz um mês desde seu último registro. Atualize seu progresso mensal para acompanhar sua evolução!',
        date: nextMonthDate.toISOString(),
        read: false,
      };

      return { 
        ...prev, 
        progress: progressMap,
        notifications: [...prev.notifications, monthlyReminder],
      };
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

  const addStudent = useCallback((student: { name: string; phone: string; goal: string }) => {
    setState(prev => {
      const studentId = `student-${Date.now()}`;
      
      // Gerar login e senha
      const phoneDigits = student.phone.replace(/\D/g, '');
      const lastFourDigits = phoneDigits.slice(-4);
      const login = student.name.toLowerCase().replace(/\s+/g, '');
      const tempPassword = `${login}${lastFourDigits}`;
      
      const newStudentProfile: StudentProfile = {
        id_user: studentId,
        id_personal: user?.id || '',
        goal: student.goal,
        upcomingWorkouts: [],
        status: 'ativo',
      // Salvar credenciais do aluno no localStorage para permitir login
      const studentUsers = JSON.parse(localStorage.getItem('student_users') || '[]');
      const newStudentUser = {
        id: studentId,
        type: 'aluno',
        name: student.name,
        email: `${login}@app.com`,
        password: tempPassword,
        phone: student.phone,
        createdAt: new Date().toISOString(),
      };
      studentUsers.push(newStudentUser);
      localStorage.setItem('student_users', JSON.stringify(studentUsers));

      };

      // Criar notificação para o personal com as credenciais
      const credentialsNotification: NotificationItem = {
        id: `credentials-${Date.now()}`,
        id_user: user?.id || '',
        type: 'alerta',
        title: '✅ Novo Aluno Cadastrado!',
        message: `${student.name} foi adicionado com sucesso!\n\nCredenciais de acesso:\nTelefone: ${student.phone}\nLogin: ${login}\nSenha: ${tempPassword}\n\nCompartilhe essas informações com o aluno.`,
        date: new Date().toISOString(),
        read: false,
      };

      return {
        ...prev,
        students: [...prev.students, newStudentProfile],
        notifications: [credentialsNotification, ...prev.notifications],
      };
    });
  }, [user]);

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
      addStudent,
    }),
    [state, loading, refresh, markWorkoutCompleted, toggleNotification, sendMessage, logProgress, addFeedNotification, setExercises, addNotification, addStudent],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}
