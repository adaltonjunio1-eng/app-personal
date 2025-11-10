import { useState } from 'react';
import type { ExerciseTemplate } from '../../data/exerciseLibrary';
import { exerciseLibrary, exerciseCategories } from '../../data/exerciseLibrary';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Search, X } from 'lucide-react';
import './ExerciseLibraryModal.css';

interface ExerciseLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: ExerciseTemplate) => void;
}

export function ExerciseLibraryModal({ isOpen, onClose, onSelectExercise }: ExerciseLibraryModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!isOpen) return null;

  const filteredExercises = exerciseLibrary.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (exercise: ExerciseTemplate) => {
    onSelectExercise(exercise);
    onClose();
    setSearchTerm('');
    setSelectedCategory('all');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Biblioteca de Exercícios</h2>
          <Button variant="ghost" icon={<X size={24} />} onClick={onClose} />
        </div>

        <div className="modal-filters">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar exercício..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-tabs">
            {exerciseCategories.map((cat) => (
              <button
                key={cat.id}
                className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="category-icon">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="exercises-grid">
          {filteredExercises.map((exercise) => (
            <Card
              key={exercise.id}
              interactive
              onClick={() => handleSelect(exercise)}
            >
              <div className="exercise-card">
                <div className="exercise-card__image">
                  <img 
                    src={exercise.image} 
                    alt={exercise.name}
                    onError={(e) => {
                      // Fallback para ícone se imagem não carregar
                      e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23333" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23666" font-size="40">💪</text></svg>';
                    }}
                  />
                </div>
                <div className="exercise-card__info">
                  <h3>{exercise.name}</h3>
                  <p className="exercise-card__muscle">{exercise.muscleGroup}</p>
                  {exercise.defaultSets && (
                    <p className="exercise-card__default">
                      {exercise.defaultSets} × {exercise.defaultReps}
                      {exercise.defaultWeight && ` • ${exercise.defaultWeight}`}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="empty-state">
            <p>Nenhum exercício encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
