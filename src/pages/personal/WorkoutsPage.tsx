import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SectionTitle } from '../../components/common/SectionTitle';
import { WeekDaysBadge } from '../../components/common/WeekDaysBadge';
import { Search, Plus, Dumbbell } from 'lucide-react';
import './WorkoutsPage.css';

export function WorkoutsPage() {
  const { workouts } = useAppData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Combina todos os treinos de todos os alunos
  const allWorkouts = Object.entries(workouts).flatMap(([studentId, studentWorkouts]) =>
    studentWorkouts.map(workout => ({ ...workout, studentId }))
  );

  // Filtra treinos pelo termo de busca
  const filteredWorkouts = allWorkouts.filter(workout =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWorkoutClick = (workoutId: string) => {
    navigate(`/treinos/${workoutId}`);
  };

  return (
    <div className="workouts-page">
      <SectionTitle
        title="Biblioteca de Treinos"
        subtitle="Visualize e gerencie todos os treinos criados"
        action={
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => navigate('/treinos/novo')}>
            Novo Treino
          </Button>
        }
      />

      <div className="workouts-page__filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar treino..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="workouts-grid">
        {filteredWorkouts.map((workout) => (
          <Card
            key={workout.id}
            accent="primary"
            interactive
            onClick={() => handleWorkoutClick(workout.id)}
          >
            <div className="workout-item">
              <div className="workout-item__icon">
                <Dumbbell size={32} />
              </div>
              <div className="workout-item__content">
                <strong className="workout-item__name">{workout.name}</strong>
                <p className="workout-item__description">{workout.notes}</p>
                <div className="workout-item__meta">
                  {workout.date && (
                    <>
                      <span>Data: {new Date(workout.date).toLocaleDateString('pt-BR')}</span>
                      <span>•</span>
                    </>
                  )}
                  <span>Status: {workout.status}</span>
                </div>
                {workout.weekDays && workout.weekDays.length > 0 && (
                  <div className="workout-item__days">
                    <WeekDaysBadge days={workout.weekDays} size="small" />
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredWorkouts.length === 0 && (
        <div className="empty-state">
          <Dumbbell size={48} />
          <p>Nenhum treino encontrado</p>
        </div>
      )}
    </div>
  );
}
