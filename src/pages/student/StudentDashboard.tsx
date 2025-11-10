import { useAuth } from '../../hooks/useAuth';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/common/Card';
import { SectionTitle } from '../../components/common/SectionTitle';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { WeekDaysBadge } from '../../components/common/WeekDaysBadge';
import { Calendar, TrendingUp, Dumbbell, CheckCircle2 } from 'lucide-react';
import { formatDate, formatWeight } from '../../utils/format';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

export function StudentDashboard() {
  const { user } = useAuth();
  const { workouts, progress, agenda } = useAppData();
  const navigate = useNavigate();

  const myWorkouts = user ? workouts[user.id] || [] : [];
  const myProgress = user ? progress[user.id] : undefined;
  const myAgenda = agenda.slice(0, 3);

  const pendingWorkouts = myWorkouts.filter((w) => w.status === 'pendente');
  const completedWorkouts = myWorkouts.filter((w) => w.status === 'concluido' || w.status === 'concluído');

  const latestWeight = myProgress?.weight[myProgress.weight.length - 1];

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>Olá, {user?.name.split(' ')[0]}! 💪</h1>
        <p>Seus treinos e progresso de hoje</p>
      </header>

      <div className="dashboard__metrics">
        <Card accent="primary">
          <div className="metric">
            <Dumbbell size={28} />
            <div>
              <span className="metric__value">{pendingWorkouts.length}</span>
              <span className="metric__label">Treinos pendentes</span>
            </div>
          </div>
        </Card>

        <Card accent="neutral">
          <div className="metric">
            <CheckCircle2 size={28} />
            <div>
              <span className="metric__value">{completedWorkouts.length}</span>
              <span className="metric__label">Treinos concluídos</span>
            </div>
          </div>
        </Card>

        <Card accent="secondary">
          <div className="metric">
            <TrendingUp size={28} />
            <div>
              <span className="metric__value">
                {latestWeight ? formatWeight(latestWeight.value) : '--'}
              </span>
              <span className="metric__label">Peso atual</span>
            </div>
          </div>
        </Card>
      </div>

      <SectionTitle title="Próximos treinos" subtitle="Confira o que está planejado" />

      <div className="dashboard__workouts">
        {pendingWorkouts.slice(0, 3).map((workout) => (
          <Card key={workout.id} interactive accent="primary">
            <div className="workout-card">
              <div>
                <h3>{workout.name}</h3>
                {workout.date && <p>{formatDate(workout.date)}</p>}
                {workout.weekDays && workout.weekDays.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <WeekDaysBadge days={workout.weekDays} size="small" />
                  </div>
                )}
              </div>
              <Badge label={workout.status} tone="warning" />
            </div>
          </Card>
        ))}
        {pendingWorkouts.length === 0 && (
          <Card>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
              Nenhum treino pendente. Parabéns! 🎉
            </p>
          </Card>
        )}
      </div>

      <SectionTitle title="Agenda" subtitle="Próximos compromissos" />

      <div className="dashboard__agenda">
        {myAgenda.map((event) => (
          <Card key={event.id}>
            <div className="agenda-card">
              <Calendar size={22} style={{ color: 'var(--primary)' }} />
              <div className="agenda-card__info">
                <strong>{event.title}</strong>
                <p>{formatDate(event.date)} · {event.location}</p>
              </div>
              <Badge label={event.type} />
            </div>
          </Card>
        ))}
        {myAgenda.length === 0 && (
          <Card>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
              Nenhum evento agendado.
            </p>
          </Card>
        )}
      </div>

      <div style={{ marginTop: '32px' }}>
        <Button variant="primary" onClick={() => navigate('/treinos')}>
          Ver todos os treinos
        </Button>
      </div>
    </div>
  );
}
