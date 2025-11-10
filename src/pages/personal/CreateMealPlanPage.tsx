import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SectionTitle } from '../../components/common/SectionTitle';
import { ArrowLeft, Plus, Trash2, Save, UtensilsCrossed } from 'lucide-react';
import './CreateMealPlanPage.css';

interface MealItem {
  id: string;
  food: string;
  quantity: string;
  calories: string;
  notes: string;
}

interface MealSection {
  id: string;
  title: string;
  time: string;
  items: MealItem[];
}

export function CreateMealPlanPage() {
  const navigate = useNavigate();
  const { students } = useAppData();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [planDate, setPlanDate] = useState('');
  const [dailyCalories, setDailyCalories] = useState('');
  const [waterIntake, setWaterIntake] = useState('2.5');
  const [notes, setNotes] = useState('');
  
  const [meals, setMeals] = useState<MealSection[]>([
    {
      id: '1',
      title: 'Café da Manhã',
      time: '07:00',
      items: [{ id: '1-1', food: '', quantity: '', calories: '', notes: '' }],
    },
  ]);

  const addMeal = () => {
    const mealNumber = meals.length + 1;
    const mealTitles = ['Lanche da Manhã', 'Almoço', 'Lanche da Tarde', 'Jantar', 'Ceia'];
    const mealTimes = ['10:00', '12:30', '15:00', '19:00', '22:00'];
    
    setMeals([
      ...meals,
      {
        id: String(mealNumber),
        title: mealTitles[mealNumber - 2] || `Refeição ${mealNumber}`,
        time: mealTimes[mealNumber - 2] || '12:00',
        items: [{ id: `${mealNumber}-1`, food: '', quantity: '', calories: '', notes: '' }],
      },
    ]);
  };

  const removeMeal = (mealId: string) => {
    if (meals.length > 1) {
      setMeals(meals.filter((meal) => meal.id !== mealId));
    }
  };

  const updateMeal = (mealId: string, field: 'title' | 'time', value: string) => {
    setMeals(
      meals.map((meal) =>
        meal.id === mealId ? { ...meal, [field]: value } : meal
      )
    );
  };

  const addMealItem = (mealId: string) => {
    setMeals(
      meals.map((meal) => {
        if (meal.id === mealId) {
          const newItemId = `${mealId}-${meal.items.length + 1}`;
          return {
            ...meal,
            items: [
              ...meal.items,
              { id: newItemId, food: '', quantity: '', calories: '', notes: '' },
            ],
          };
        }
        return meal;
      })
    );
  };

  const removeMealItem = (mealId: string, itemId: string) => {
    setMeals(
      meals.map((meal) => {
        if (meal.id === mealId && meal.items.length > 1) {
          return {
            ...meal,
            items: meal.items.filter((item) => item.id !== itemId),
          };
        }
        return meal;
      })
    );
  };

  const updateMealItem = (
    mealId: string,
    itemId: string,
    field: keyof MealItem,
    value: string
  ) => {
    setMeals(
      meals.map((meal) => {
        if (meal.id === mealId) {
          return {
            ...meal,
            items: meal.items.map((item) =>
              item.id === itemId ? { ...item, [field]: value } : item
            ),
          };
        }
        return meal;
      })
    );
  };

  const handleSave = () => {
    if (!selectedStudent || !planDate || !dailyCalories) {
      alert('Preencha o aluno, data e meta de calorias!');
      return;
    }

    const hasEmptyMeals = meals.some((meal) =>
      meal.items.some((item) => !item.food)
    );

    if (hasEmptyMeals) {
      alert('Preencha todos os alimentos!');
      return;
    }

    console.log('Plano alimentar criado:', {
      student: selectedStudent,
      date: planDate,
      dailyCalories,
      waterIntake,
      notes,
      meals,
    });

    alert('Plano alimentar criado com sucesso!');
    navigate('/alimentacao');
  };

  return (
    <div className="create-meal-plan">
      <Button
        variant="ghost"
        icon={<ArrowLeft size={18} />}
        onClick={() => navigate(-1)}
      >
        Voltar
      </Button>

      <SectionTitle
        title="Montar Plano Alimentar"
        subtitle="Crie uma dieta personalizada para seu aluno"
      />

      <Card accent="neutral">
        <div className="meal-plan-form">
          <h3>Informações Gerais</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Aluno</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">Selecione um aluno</option>
                {students.map((student) => (
                  <option key={student.id_user} value={student.id_user}>
                    Aluno #{student.id_user.slice(-6)} - {student.goal.substring(0, 30)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Data</label>
              <input
                type="date"
                value={planDate}
                onChange={(e) => setPlanDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Meta de Calorias Diárias</label>
              <input
                type="number"
                placeholder="Ex: 2000"
                value={dailyCalories}
                onChange={(e) => setDailyCalories(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Meta de Água (Litros)</label>
              <input
                type="number"
                step="0.5"
                placeholder="Ex: 2.5"
                value={waterIntake}
                onChange={(e) => setWaterIntake(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Observações Gerais</label>
            <textarea
              placeholder="Restrições alimentares, preferências, dicas..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </Card>

      <div className="meals-section">
        <div className="meals-header">
          <h3>Refeições ({meals.length})</h3>
          <Button variant="primary" icon={<Plus size={18} />} onClick={addMeal}>
            Adicionar Refeição
          </Button>
        </div>

        <div className="meals-list">
          {meals.map((meal) => (
            <Card key={meal.id} accent="primary">
              <div className="meal-section">
                <div className="meal-section__header">
                  <div className="meal-icon">
                    <UtensilsCrossed size={24} />
                  </div>
                  <div className="meal-section__title">
                    <input
                      type="text"
                      className="meal-title-input"
                      value={meal.title}
                      onChange={(e) => updateMeal(meal.id, 'title', e.target.value)}
                      placeholder="Nome da refeição"
                    />
                    <input
                      type="time"
                      className="meal-time-input"
                      value={meal.time}
                      onChange={(e) => updateMeal(meal.id, 'time', e.target.value)}
                    />
                  </div>
                  {meals.length > 1 && (
                    <button
                      className="remove-meal-btn"
                      onClick={() => removeMeal(meal.id)}
                      title="Remover refeição"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="meal-items">
                  {meal.items.map((item, index) => (
                    <div key={item.id} className="meal-item">
                      <div className="meal-item__number">{index + 1}</div>
                      <div className="meal-item__fields">
                        <div className="form-group">
                          <input
                            type="text"
                            placeholder="Alimento (ex: Aveia)"
                            value={item.food}
                            onChange={(e) =>
                              updateMealItem(meal.id, item.id, 'food', e.target.value)
                            }
                          />
                        </div>

                        <div className="form-row form-row--inline">
                          <div className="form-group">
                            <input
                              type="text"
                              placeholder="Quantidade"
                              value={item.quantity}
                              onChange={(e) =>
                                updateMealItem(meal.id, item.id, 'quantity', e.target.value)
                              }
                            />
                          </div>

                          <div className="form-group">
                            <input
                              type="text"
                              placeholder="Calorias"
                              value={item.calories}
                              onChange={(e) =>
                                updateMealItem(meal.id, item.id, 'calories', e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <input
                            type="text"
                            placeholder="Observações (opcional)"
                            value={item.notes}
                            onChange={(e) =>
                              updateMealItem(meal.id, item.id, 'notes', e.target.value)
                            }
                          />
                        </div>
                      </div>

                      {meal.items.length > 1 && (
                        <button
                          className="remove-item-btn"
                          onClick={() => removeMealItem(meal.id, item.id)}
                          title="Remover alimento"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}

                  <Button
                    variant="ghost"
                    icon={<Plus size={16} />}
                    onClick={() => addMealItem(meal.id)}
                  >
                    Adicionar Alimento
                  </Button>
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
          Salvar Plano Alimentar
        </Button>
      </div>
    </div>
  );
}
