import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SectionTitle } from '../../components/common/SectionTitle';
import { VideoRecorder } from '../../components/video/VideoRecorder';
import { ExerciseLibraryModal } from '../../components/exercise/ExerciseLibraryModal';
import type { ExerciseTemplate } from '../../data/exerciseLibrary';
import { ArrowLeft, Plus, Trash2, Save, Info, Library } from 'lucide-react';
import './CreateWorkoutPage.css';

interface ExerciseForm {
  id: string;
  name: string;
  video_url: string;
  videoBlob?: Blob;
  series: number;
  repeticoes: string;
  carga: string;
  descanso_segundos: number;
  image?: string; // Imagem do boneco
}

export function CreateWorkoutPage() {
  const navigate = useNavigate();
  const { students } = useAppData();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [workoutName, setWorkoutName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [videoBrief, setVideoBrief] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [exercises, setExercises] = useState<ExerciseForm[]>([
    {
      id: '1',
      name: '',
      video_url: '',
      series: 3,
      repeticoes: '12',
      carga: '',
      descanso_segundos: 60,
    },
  ]);

  const weekDays = [
    { id: 'seg', label: 'Seg', full: 'Segunda-feira' },
    { id: 'ter', label: 'Ter', full: 'Terça-feira' },
    { id: 'qua', label: 'Qua', full: 'Quarta-feira' },
    { id: 'qui', label: 'Qui', full: 'Quinta-feira' },
    { id: 'sex', label: 'Sex', full: 'Sexta-feira' },
    { id: 'sab', label: 'Sáb', full: 'Sábado' },
    { id: 'dom', label: 'Dom', full: 'Domingo' },
  ];

  const toggleDay = (dayId: string) => {
    setSelectedDays(prev =>
      prev.includes(dayId)
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    );
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: String(exercises.length + 1),
        name: '',
        video_url: '',
        series: 3,
        repeticoes: '12',
        carga: '',
        descanso_segundos: 60,
      },
    ]);
  };

  const removeExercise = (id: string) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((ex) => ex.id !== id));
    }
  };

  const updateExercise = (id: string, field: keyof ExerciseForm, value: string | number | Blob) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    );
  };

  const handleVideoSaved = (exerciseId: string, blob: Blob, url: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, video_url: url, videoBlob: blob } : ex
      )
    );
  };

  const handleSelectFromLibrary = (exerciseId: string) => {
    setEditingExerciseId(exerciseId);
    setShowLibrary(true);
  };

  const handleExerciseSelected = (template: ExerciseTemplate) => {
    if (editingExerciseId) {
      setExercises(
        exercises.map((ex) =>
          ex.id === editingExerciseId
            ? {
                ...ex,
                name: template.name,
                image: template.image,
                series: parseInt(template.defaultSets || '3'),
                repeticoes: template.defaultReps || '12',
                carga: template.defaultWeight || '',
              }
            : ex
        )
      );
    }
    setEditingExerciseId(null);
  };

  const handleSave = () => {
    if (!selectedStudent || !workoutName) {
      alert('Preencha o aluno e nome do treino!');
      return;
    }

    if (selectedDays.length === 0) {
      alert('Selecione pelo menos um dia da semana para o treino!');
      return;
    }

    const hasEmptyExercises = exercises.some((ex) => !ex.name);
    if (hasEmptyExercises) {
      alert('Preencha o nome de todos os exercícios!');
      return;
    }

    // Aqui você implementaria a lógica de salvar no contexto/API
    console.log('Treino criado:', {
      student: selectedStudent,
      name: workoutName,
      weekDays: selectedDays,
      notes: workoutNotes,
      videoBrief,
      exercises,
    });

    alert('Treino criado com sucesso!');
    navigate('/treinos');
  };

  return (
    <div className="create-workout">
      <Button
        variant="ghost"
        icon={<ArrowLeft size={18} />}
        onClick={() => navigate(-1)}
      >
        Voltar
      </Button>

      <SectionTitle
        title="Montar Novo Treino"
        subtitle="Crie um treino personalizado para seu aluno"
      />

      <Card accent="primary">
        <div className="info-banner">
          <Info size={24} />
          <div>
            <strong>Grave vídeos explicativos!</strong>
            <p>Para cada exercício, você pode gravar um vídeo demonstrando a execução correta. O navegador solicitará permissão para usar sua câmera.</p>
          </div>
        </div>
      </Card>

      <Card accent="neutral">
        <div className="workout-form">
          <h3>Informações do Treino</h3>

          <div className="form-group">
            <label>Aluno</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">Selecione um aluno</option>
              {students.map((student) => (
                <option key={student.id_user} value={student.id_user}>
                  Aluno #{student.id_user.slice(-6)} - {student.goal.substring(0, 30)}...
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Nome do Treino</label>
            <input
              type="text"
              placeholder="Ex: Treino A - Peito e Tríceps"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Dias da Semana</label>
            <div className="week-days-selector">
              {weekDays.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  className={`day-button ${selectedDays.includes(day.id) ? 'active' : ''}`}
                  onClick={() => toggleDay(day.id)}
                  title={day.full}
                >
                  {day.label}
                </button>
              ))}
            </div>
            {selectedDays.length > 0 && (
              <p className="selected-days-info">
                Treino será realizado: {selectedDays.map(id => 
                  weekDays.find(d => d.id === id)?.full
                ).join(', ')}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Observações</label>
            <textarea
              placeholder="Dicas e orientações para o aluno..."
              value={workoutNotes}
              onChange={(e) => setWorkoutNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Link do Vídeo Briefing (opcional)</label>
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={videoBrief}
              onChange={(e) => setVideoBrief(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <div className="exercises-section">
        <div className="exercises-header">
          <h3>Exercícios ({exercises.length})</h3>
          <Button variant="primary" icon={<Plus size={18} />} onClick={addExercise}>
            Adicionar Exercício
          </Button>
        </div>

        <div className="exercises-list">
          {exercises.map((exercise, index) => (
            <Card key={exercise.id} accent="primary">
              <div className="exercise-form">
                <div className="exercise-form__header">
                  <span className="exercise-number">#{index + 1}</span>
                  {exercises.length > 1 && (
                    <button
                      className="remove-btn"
                      onClick={() => removeExercise(exercise.id)}
                      title="Remover exercício"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Nome do Exercício</label>
                  <div className="exercise-name-input">
                    <input
                      type="text"
                      placeholder="Ex: Supino Reto"
                      value={exercise.name}
                      onChange={(e) =>
                        updateExercise(exercise.id, 'name', e.target.value)
                      }
                    />
                    <Button
                      variant="ghost"
                      icon={<Library size={18} />}
                      onClick={() => handleSelectFromLibrary(exercise.id)}
                    >
                      Biblioteca
                    </Button>
                  </div>
                  {exercise.image && (
                    <div className="exercise-preview">
                      <img src={exercise.image} alt={exercise.name} />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Vídeo Explicativo do Exercício</label>
                  <VideoRecorder
                    existingVideoUrl={exercise.video_url}
                    onVideoSaved={(blob, url) => handleVideoSaved(exercise.id, blob, url)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Séries</label>
                    <input
                      type="number"
                      min="1"
                      value={exercise.series}
                      onChange={(e) =>
                        updateExercise(exercise.id, 'series', Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Repetições</label>
                    <input
                      type="text"
                      placeholder="Ex: 12 ou 10-12"
                      value={exercise.repeticoes}
                      onChange={(e) =>
                        updateExercise(exercise.id, 'repeticoes', e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Carga</label>
                    <input
                      type="text"
                      placeholder="Ex: 20kg"
                      value={exercise.carga}
                      onChange={(e) =>
                        updateExercise(exercise.id, 'carga', e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Descanso (seg)</label>
                    <input
                      type="number"
                      min="0"
                      step="15"
                      value={exercise.descanso_segundos}
                      onChange={(e) =>
                        updateExercise(
                          exercise.id,
                          'descanso_segundos',
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="save-actions">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
        <Button variant="primary" icon={<Save size={20} />} onClick={handleSave}>
          Salvar Treino
        </Button>
      </div>

      <ExerciseLibraryModal
        isOpen={showLibrary}
        onClose={() => {
          setShowLibrary(false);
          setEditingExerciseId(null);
        }}
        onSelectExercise={handleExerciseSelected}
      />
    </div>
  );
}
