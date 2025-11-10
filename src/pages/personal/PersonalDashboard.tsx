import { useAuth } from '../../hooks/useAuth';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/common/Card';
import { SectionTitle } from '../../components/common/SectionTitle';
import { Badge } from '../../components/common/Badge';
import { Users, Activity, AlertCircle, TrendingUp } from 'lucide-react';
import './PersonalDashboard.css';

export function PersonalDashboard() {
  const { user } = useAuth();
  const { students, workouts, notifications } = useAppData();

  const activeStudents = students.filter((s) => s.status === 'ativo').length;
  const totalWorkouts = Object.values(workouts).flat().length;
  const pendingWorkouts = Object.values(workouts)
    .flat()
    .filter((w) => w.status === 'pendente').length;
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>Olá, {user?.name.split(' ')[0]}! 👋</h1>
        <p>Visão geral dos seus alunos e treinos</p>
      </header>

      <div className="dashboard__metrics">
        <Card accent="primary">
          <div className="metric">
            <Users size={28} />
            <div>
              <span className="metric__value">{activeStudents}</span>
              <span className="metric__label">Alunos ativos</span>
            </div>
          </div>
        </Card>

        <Card accent="neutral">
          <div className="metric">
            <Activity size={28} />
            <div>
              <span className="metric__value">{pendingWorkouts}</span>
              <span className="metric__label">Treinos pendentes</span>
            </div>
          </div>
        </Card>

        <Card accent="secondary">
          <div className="metric">
            <AlertCircle size={28} />
            <div>
              <span className="metric__value">{unreadNotifications}</span>
              <span className="metric__label">Notificações</span>
            </div>
          </div>
        </Card>

        <Card accent="neutral">
          <div className="metric">
            <TrendingUp size={28} />
            <div>
              <span className="metric__value">{totalWorkouts}</span>
              <span className="metric__label">Total treinos</span>
            </div>
          </div>
        </Card>
      </div>

      <SectionTitle title="Alunos recentes" subtitle="Últimos perfis cadastrados" />

      <div className="dashboard__students">
        {students.slice(0, 6).map((student) => (
          <Card key={student.id_user} interactive>
            <div className="student-card">
              <img
                src={`https://i.pravatar.cc/150?u=${student.id_user}`}
                alt={student.id_user}
                className="student-card__avatar"
              />
              <div className="student-card__info">
                <strong>Aluno #{student.id_user.slice(-4)}</strong>
                <p>{student.goal}</p>
              </div>
              <Badge label={student.status} tone={student.status === 'ativo' ? 'positive' : 'default'} />
            </div>
          </Card>
        ))}
      </div>

      {students.length === 0 && (
        <Card>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
            Nenhum aluno cadastrado ainda. Adicione seus primeiros alunos!
          </p>
        </Card>
      )}
    </div>
  );
}
