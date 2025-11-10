import type {
  AgendaEvent,
  ChatMessage,
  LoginResponse,
  MealPlan,
  NotificationItem,
  ProgressEntry,
  StudentProfile,
  User,
  Workout,
  Exercise,
  AuthCredentials,
} from '../types';

const cache = new Map<string, unknown>();

async function fetchJson<T>(resource: string): Promise<T> {
  if (cache.has(resource)) {
    return cache.get(resource) as T;
  }
  const response = await fetch(resource);
  if (!response.ok) {
    throw new Error(`Erro ao carregar ${resource}: ${response.statusText}`);
  }
  const data = (await response.json()) as T;
  cache.set(resource, data);
  return data;
}

const DATA_BASE = '/data';

export async function login(credentials: AuthCredentials): Promise<LoginResponse> {
  const baseUsers = await fetchJson<User[]>(`${DATA_BASE}/users.json`);

  // Carregar usuários adicionais do localStorage (personal registrados e alunos criados dinamicamente)
  let extraUsers: User[] = [];
  try {
    const registered = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const students = JSON.parse(localStorage.getItem('student_users') || '[]');
    // Normalizar para o tipo User
    const mapUser = (u: any): User => ({
      id: u.id || `${u.type}-${Date.now()}`,
      type: u.type,
      name: u.name,
      email: u.email,
      password: u.password,
      photo: u.photo || 'https://i.pravatar.cc/150?u=' + (u.id || u.email),
      createdAt: u.createdAt || new Date().toISOString(),
    });
    extraUsers = [...registered.map(mapUser), ...students.map(mapUser)];
  } catch (e) {
    console.warn('Falha ao carregar usuários extras do localStorage', e);
  }

  const allUsers = [...baseUsers, ...extraUsers];
  const user = allUsers.find(
    (item) => item.email === credentials.email && item.password === credentials.password,
  );
  if (!user) {
    throw new Error('Credenciais inválidas');
  }
  return { user, token: `mock-token-${user.id}` };
}

export async function register(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  // Mock: apenas devolve usuário com id fake, sem persistir
  const newUser: User = {
    ...user,
    id: `${user.type}-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  return newUser;
}

export async function getStudents(personalId: string): Promise<StudentProfile[]> {
  const students = await fetchJson<StudentProfile[]>(`${DATA_BASE}/students.json`);
  return students.filter((student) => student.id_personal === personalId);
}

export async function getStudentProfile(studentId: string): Promise<StudentProfile | undefined> {
  const students = await fetchJson<StudentProfile[]>(`${DATA_BASE}/students.json`);
  return students.find((student) => student.id_user === studentId);
}

export async function getUsers(): Promise<User[]> {
  return fetchJson<User[]>(`${DATA_BASE}/users.json`);
}

export async function getWorkouts(studentId: string): Promise<Workout[]> {
  const workouts = await fetchJson<Workout[]>(`${DATA_BASE}/workouts.json`);
  return workouts.filter((workout) => workout.id_aluno === studentId);
}

export async function getExercises(workoutId: string): Promise<Exercise[]> {
  const exercises = await fetchJson<Exercise[]>(`${DATA_BASE}/exercises.json`);
  return exercises.filter((exercise) => exercise.id_treino === workoutId);
}

export async function getProgress(studentId: string): Promise<ProgressEntry | undefined> {
  const progress = await fetchJson<ProgressEntry[]>(`${DATA_BASE}/progress.json`);
  return progress.find((entry) => entry.id_usuario === studentId);
}

export async function getChatMessages(userId: string): Promise<ChatMessage[]> {
  const messages = await fetchJson<ChatMessage[]>(`${DATA_BASE}/chat.json`);
  return messages.filter((message) => message.from === userId || message.to === userId);
}

export async function getAgenda(userId: string): Promise<AgendaEvent[]> {
  const agenda = await fetchJson<AgendaEvent[]>(`${DATA_BASE}/agenda.json`);
  return agenda.filter((event) => event.id_user === userId);
}

export async function getNotifications(userId: string): Promise<NotificationItem[]> {
  const notifications = await fetchJson<NotificationItem[]>(`${DATA_BASE}/notifications.json`);
  return notifications.filter((notification) => notification.id_user === userId);
}

export async function getMealPlan(userId: string): Promise<MealPlan | undefined> {
  const plans = await fetchJson<MealPlan[]>(`${DATA_BASE}/mealPlans.json`);
  return plans.find((plan) => plan.id_usuario === userId);
}

export function clearCache(): void {
  cache.clear();
}
