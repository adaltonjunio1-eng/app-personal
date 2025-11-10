import { useParams, useNavigate } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SectionTitle } from '../../components/common/SectionTitle';
import { WeekDaysBadge } from '../../components/common/WeekDaysBadge';
import { ArrowLeft, CheckCircle, PlayCircle } from 'lucide-react';
import './WorkoutDetailPage.css';
import { useAuth } from '../../hooks/useAuth';

export function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { workouts, exercises, setExercises, addNotification } = useAppData();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Busca o treino específico em todos os alunos
  let workout = null;
  for (const studentWorkouts of Object.values(workouts)) {
    const found = studentWorkouts.find(w => w.id === id);
    if (found) {
      workout = found;
      break;
    }
  }

  if (!workout) {
    return (
      <div className="workout-detail">
        <SectionTitle title="Treino não encontrado" />
        <Button variant="ghost" icon={<ArrowLeft size={18} />} onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>
    );
  }

  // Busca os exercícios relacionados ao treino
  const workoutExercises = workout ? (exercises[workout.id] || []) : [];

  const handleMarkComplete = () => {
    // Aqui poderia chamar markWorkoutCompleted do contexto
    alert('Treino marcado como concluído!');
    navigate(-1);
  };

  // Função para marcar exercício como concluído
  const handleExerciseComplete = (exerciseId: string) => {
    if (!workout) return;
    const updated = { ...exercises };
    updated[workout.id] = updated[workout.id].map(ex =>
      ex.id === exerciseId ? { ...ex, status: 'concluido' } : ex
    );
    setExercises(updated);
    // Notificação para o aluno
    if (user) {
      addNotification({
        id_user: user.id,
        type: 'parabens',
        title: 'Parabéns! Exercício concluído',
        message: `Você concluiu o exercício: ${updated[workout.id].find(ex => ex.id === exerciseId)?.name}`,
        postId: workout.id,
      });
    }
    // Notificação para o personal
    if (workout.id_aluno && workout.id_aluno !== user?.id) {
      addNotification({
        id_user: workout.id_aluno,
        type: 'alerta',
        title: 'Aluno concluiu exercício',
        message: `${user?.name} concluiu o exercício: ${updated[workout.id].find(ex => ex.id === exerciseId)?.name}`,
        postId: workout.id,
      });
    }
  };

  return (
    <div className="workout-detail">
      <Button 
        variant="ghost" 
        icon={<ArrowLeft size={18} />} 
        onClick={() => navigate(-1)}
      >
        Voltar
      </Button>

      <div className="workout-detail__header">
        <div>
          <h1>{workout.name}</h1>
          {workout.date && (
            <p className="workout-detail__date">
              {new Date(workout.date).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
          {workout.weekDays && workout.weekDays.length > 0 && (
            <div className="workout-detail__days">
              <span className="days-label">Dias de treino:</span>
              <WeekDaysBadge days={workout.weekDays} size="medium" />
            </div>
          )}
        </div>
        <Badge 
          label={workout.status} 
          tone={workout.status === 'concluído' || workout.status === 'concluido' ? 'positive' : 'warning'}
        />
      </div>

      {workout.notes && (
        <Card accent="neutral">
          <div className="workout-notes">
            <strong>Observações do Personal:</strong>
            <p>{workout.notes}</p>
          </div>
        </Card>
      )}

      {workout.videoBrief && (
        <Card accent="primary">
          <div className="video-brief">
            <div className="video-brief__icon">
              <PlayCircle size={24} />
            </div>
            <div>
              <strong>Vídeo Orientação</strong>
              <p>Assista ao briefing do treino</p>
            </div>
            <Button variant="ghost">Assistir</Button>
          </div>
        </Card>
      )}

      <SectionTitle 
        title="Exercícios" 
        subtitle={`${workoutExercises.length} exercícios no total`}
      />

      <div className="exercises-list">
        {workoutExercises.map((exercise, index) => (
          <Card key={exercise.id} accent="neutral">
            <div className="exercise-item">
              <div className="exercise-item__number">{index + 1}</div>
              <div className="exercise-item__content">
                <strong className="exercise-item__name">{exercise.name}</strong>
                {exercise.status === 'concluido' && (
                  <Badge label="Concluído" tone="positive" />
                )}

                {exercise.video_url && (
                  <div className="exercise-video">
                    <iframe
                      src={exercise.video_url}
                      title={exercise.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <div className="exercise-specs">
                  <div className="spec-item">
                    <span className="spec-label">Séries</span>
                    <span className="spec-value">{exercise.series}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Repetições</span>
                    <span className="spec-value">{exercise.repeticoes}</span>
                  </div>
                  {exercise.carga && (
                    <div className="spec-item">
                      <span className="spec-label">Carga</span>
                      <span className="spec-value">{exercise.carga}</span>
                    </div>
                  )}
                  {exercise.descanso_segundos && (
                    <div className="spec-item">
                      <span className="spec-label">Descanso</span>
                      <span className="spec-value">{exercise.descanso_segundos}s</span>
                    </div>
                  )}
                </div>

                {exercise.status !== 'concluido' && (
                  <Button variant="primary" onClick={() => handleExerciseComplete(exercise.id)}>
                    Concluir Exercício
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {workout.status === 'pendente' && (
        <div className="workout-actions">
          <Button 
            variant="primary" 
            icon={<CheckCircle size={20} />}
            onClick={handleMarkComplete}
          >
            Marcar como Concluído
          </Button>
        </div>
      )}
    </div>
  );
}
