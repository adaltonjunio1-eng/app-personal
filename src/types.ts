export type UserType = 'personal' | 'aluno';

export interface User {
  id: string;
  type: UserType;
  name: string;
  email: string;
  password: string;
  photo: string;
  createdAt: string;
}

export interface StudentProfile {
  id_user: string;
  id_personal: string;
  goal: string;
  upcomingWorkouts: Array<{
    id: string;
    name: string;
    date: string;
    status: 'pendente' | 'concluido';
  }>;
  status: 'ativo' | 'pausado';
}

export interface Workout {
  id: string;
  id_aluno: string;
  name: string;
  date?: string; // Opcional - apenas para treinos pontuais
  weekDays?: string[]; // ['seg', 'qua', 'sex'] - dias recorrentes
  status: 'pendente' | 'concluído' | 'concluido';
  notes: string;
  videoBrief: string;
}

export interface Exercise {
  id: string;
  id_treino: string;
  name: string;
  video_url: string;
  repeticoes: string;
  series: number;
  carga: string;
  descanso_segundos: number;
  status?: 'pendente' | 'concluido';
}

export interface ProgressEntry {
  id_usuario: string;
  weight: Array<{ date: string; value: number }>;
  measurements: Array<{ label: string; value: number }>;
  photos: Array<{ url: string; date: string }>;
}

export interface ChatMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  date: string;
}

export interface AgendaEvent {
  id: string;
  id_user: string;
  type: 'treino' | 'consulta' | 'avaliacao';
  title: string;
  date: string;
  location: string;
}

export interface NotificationItem {
  id: string;
  id_user: string;
  type: 'treino' | 'parabens' | 'alerta' | 'feed-like' | 'feed-comment';
  title: string;
  message: string;
  date: string;
  read: boolean;
  postId?: string;
}

export interface MealPlan {
  id_usuario: string;
  title: string;
  sections: Array<{ meal: string; items: string[] }>;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
