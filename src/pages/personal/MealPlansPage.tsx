import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SectionTitle } from '../../components/common/SectionTitle';
import { Search, Plus, UtensilsCrossed, Calendar } from 'lucide-react';
import './MealPlansPage.css';

export function MealPlansPage() {
  const navigate = useNavigate();
  const { students } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');

  const mealPlans: any[] = [];

  const filteredPlans = mealPlans.filter((plan) => {
    const student = students.find((s) => s.id_user === plan.studentId);
    return student?.goal.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="meal-plans-page">
      <SectionTitle
        title="Planos Alimentares"
        subtitle="Gerencie as dietas dos seus alunos"
        action={
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            onClick={() => navigate('/alimentacao/novo')}
          >
            Novo Plano
          </Button>
        }
      />

      <div className="meal-plans-page__filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por aluno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="meal-plans-grid">
        {filteredPlans.map((plan) => {
          const student = students.find((s) => s.id_user === plan.studentId);
          
          return (
            <Card
              key={plan.id}
              accent="primary"
              interactive
              onClick={() => navigate(`/alimentacao/${plan.id}`)}
            >
              <div className="meal-plan-item">
                <div className="meal-plan-item__icon">
                  <UtensilsCrossed size={32} />
                </div>
                <div className="meal-plan-item__content">
                  <strong className="meal-plan-item__student">
                    Aluno #{student?.id_user.slice(-6)}
                  </strong>
                  <p className="meal-plan-item__goal">{student?.goal}</p>
                  <div className="meal-plan-item__meta">
                    <span>
                      <Calendar size={14} />
                      {new Date(plan.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span>•</span>
                    <span>{plan.dailyCalories} kcal</span>
                    <span>•</span>
                    <span>{plan.mealsCount} refeições</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredPlans.length === 0 && (
        <div className="empty-state">
          <UtensilsCrossed size={48} />
          <p>Nenhum plano alimentar encontrado</p>
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            onClick={() => navigate('/alimentacao/novo')}
          >
            Criar Primeiro Plano
          </Button>
        </div>
      )}
    </div>
  );
}
