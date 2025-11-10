import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ChevronRight, Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './StudentWorkoutsPage.css';

const WEEK_DAYS = [
  { id: 'seg', label: 'SEG', full: 'Segunda-feira' },
  { id: 'ter', label: 'TER', full: 'Terça-feira' },
  { id: 'qua', label: 'QUA', full: 'Quarta-feira' },
  { id: 'qui', label: 'QUI', full: 'Quinta-feira' },
  { id: 'sex', label: 'SEX', full: 'Sexta-feira' },
  { id: 'sab', label: 'SAB', full: 'Sábado' },
  { id: 'dom', label: 'DOM', full: 'Domingo' },
];

export function StudentWorkoutsPage() {
  const { user } = useAuth();
  const { workouts, exercises } = useAppData();
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const myWorkouts = user ? workouts[user.id] || [] : [];

  // Função para contar exercícios de um treino
  const getExerciseCount = (workoutId: string) => {
    const workoutExercises = exercises[workoutId] || [];
    return workoutExercises.length;
  };

  // Agrupa treinos por dia da semana
  const workoutsByDay = WEEK_DAYS.map(day => ({
    ...day,
    workouts: myWorkouts.filter(workout => 
      workout.weekDays?.includes(day.id)
    )
  })).filter(day => day.workouts.length > 0);

  return (
    <div className="student-workouts">
      <header className="student-workouts__header">
        <h1>Meus Treinos</h1>
        <p>Treinos organizados por dia da semana</p>
      </header>

      {workoutsByDay.length === 0 ? (
        <Card>
          <div style={{ 
            textAlign: 'center', 
            padding: '48px 24px',
            color: 'var(--text-muted)'
          }}>
            <Dumbbell size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p>Nenhum treino cadastrado ainda.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
              Aguarde seu personal trainer criar seu plano de treino.
            </p>
          </div>
        </Card>
      ) : (
        <div className="workout-days">
          {workoutsByDay.map(day => (
            <div key={day.id} className="workout-day">
              <div 
                className={`workout-day__header ${selectedDay === day.id ? 'active' : ''}`}
                onClick={() => setSelectedDay(selectedDay === day.id ? null : day.id)}
              >
                <div className="workout-day__info">
                  <div className="day-badge">{day.label}</div>
                  <div>
                    <h3>{day.full}</h3>
                    <p>{day.workouts.length} {day.workouts.length === 1 ? 'treino' : 'treinos'}</p>
                  </div>
                </div>
                <ChevronRight 
                  size={20} 
                  className={`chevron ${selectedDay === day.id ? 'rotated' : ''}`}
                />
              </div>

              {selectedDay === day.id && (
                <div className="workout-day__content">
                  {day.workouts.map(workout => (
                    <Card 
                      key={workout.id} 
                      interactive
                      onClick={() => navigate(`/treinos/${workout.id}`)}
                    >
                      <div className="workout-item">
                        <div className="workout-item__info">
                          <h4>{workout.name}</h4>
                          <p>{getExerciseCount(workout.id)} exercícios</p>
                        </div>
                        <div className="workout-item__actions">
                          <Badge 
                            label={workout.status} 
                            tone={workout.status === 'concluido' || workout.status === 'concluído' ? 'positive' : 'warning'} 
                          />
                          <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
