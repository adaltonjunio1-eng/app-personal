import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useAppData } from './hooks/useAppData';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { RecoverPasswordPage } from './pages/auth/RecoverPasswordPage';
import { OnboardingPage } from './pages/auth/OnboardingPage';
import { PersonalDashboard } from './pages/personal/PersonalDashboard';
import { AnalyticsDashboardPage } from './pages/personal/AnalyticsDashboardPage';
import { FinancialPage } from './pages/personal/FinancialPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentWorkoutsPage } from './pages/student/StudentWorkoutsPage';
import { StudentsListPage } from './pages/personal/StudentsListPage';
import { WorkoutsPage } from './pages/personal/WorkoutsPage';
import { WorkoutDetailPage } from './pages/personal/WorkoutDetailPage';
import { CreateWorkoutPage } from './pages/personal/CreateWorkoutPage';
import { MealPlansPage } from './pages/personal/MealPlansPage';
import { CreateMealPlanPage } from './pages/personal/CreateMealPlanPage';
import { ProgressPage } from './pages/student/ProgressPage';
import { ChatPage } from './pages/shared/ChatPage';
import { ChatListPage } from './pages/shared/ChatListPage';
import { ProfilePage } from './pages/shared/ProfilePage';
import { NotificationsPage } from './pages/shared/NotificationsPage';
import { MainLayout } from './components/layout/MainLayout';
import { TopBar } from './components/layout/TopBar';
import { Home, Dumbbell, TrendingUp, MessageCircle, LogOut, Users, Heart, Bell, BarChart3, Wallet } from 'lucide-react';
import { FeedPage } from './pages/student/FeedPage';

function App() {
  const { user, logout } = useAuth();
  const { notifications } = useAppData();
  const navigate = useNavigate();

  // Conta notificações não lidas
  const unreadCount = notifications.filter(n => 
    !n.read && (n.id_user === user?.id || n.id_user === user?.name)
  ).length;

  const personalNav = [
    { label: 'Início', icon: <Home />, to: '/' },
    { label: 'Analytics', icon: <BarChart3 />, to: '/analytics' },
    { label: 'Alunos', icon: <Users />, to: '/alunos' },
    { label: 'Treinos', icon: <Dumbbell />, to: '/treinos' },
    { label: 'Financeiro', icon: <Wallet />, to: '/financeiro' },
    { label: 'Chat', icon: <MessageCircle />, to: '/chat' },
  ];

  const studentNav = [
    { label: 'Início', icon: <Home />, to: '/' },
    { label: 'Treino', icon: <Dumbbell />, to: '/treinos' },
    { label: 'Feed', icon: <Heart />, to: '/feed' },
    { label: 'Progresso', icon: <TrendingUp />, to: '/progresso' },
    { label: 'Chat', icon: <MessageCircle />, to: '/chat' },
    { label: 'Notificações', icon: <Bell />, to: '/notificacoes' },
  ];

  const navItems = user?.type === 'personal' ? personalNav : studentNav;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/recuperar-senha" element={<RecoverPasswordPage />} />
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <OnboardingPage />
        </ProtectedRoute>
      } />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout
              topbar={
                <TopBar
                  title={user?.type === 'personal' ? 'Painel Personal' : 'Meus Treinos'}
                  rightSlot={
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <button
                        onClick={() => navigate('/notificacoes')}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--secondary)',
                          cursor: 'pointer',
                          position: 'relative',
                        }}
                        title="Notificações"
                      >
                        <Bell size={22} />
                        {unreadCount > 0 && (
                          <span style={{
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            background: '#00b4d8',
                            color: 'white',
                            borderRadius: '50%',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            minWidth: '18px',
                            textAlign: 'center',
                            boxShadow: '0 2px 8px rgba(0,180,216,0.4)'
                          }}>
                            {unreadCount}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={logout}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--secondary)',
                          cursor: 'pointer',
                        }}
                        title="Sair"
                      >
                        <LogOut size={22} />
                      </button>
                    </div>
                  }
                />
              }
              navItems={navItems}
            />
          </ProtectedRoute>
        }
      >
        <Route
          path="/"
          element={
            user?.type === 'personal' ? <PersonalDashboard /> : <StudentDashboard />
          }
        />
        <Route path="/analytics" element={<AnalyticsDashboardPage />} />
        <Route path="/financeiro" element={<FinancialPage />} />
        <Route path="/alunos" element={<StudentsListPage />} />
        <Route path="/treinos" element={user?.type === 'personal' ? <WorkoutsPage /> : <StudentWorkoutsPage />} />
        <Route path="/treinos/novo" element={<CreateWorkoutPage />} />
        <Route path="/treinos/:id" element={<WorkoutDetailPage />} />
        <Route path="/alimentacao" element={<MealPlansPage />} />
        <Route path="/alimentacao/novo" element={<CreateMealPlanPage />} />
        <Route path="/progresso" element={<ProgressPage />} />
        <Route path="/chat" element={<ChatListPage />} />
        <Route path="/chat/:studentId" element={<ChatPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/notificacoes" element={<NotificationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
