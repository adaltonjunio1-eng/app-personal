import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ArrowRight, ArrowLeft, User, Target, Activity, CheckCircle } from 'lucide-react';
import './OnboardingPage.css';

interface OnboardingData {
  age?: number;
  weight?: number;
  height?: number;
  gender?: 'masculino' | 'feminino' | 'outro';
  goal?: 'perder_peso' | 'ganhar_massa' | 'manter_forma' | 'melhorar_saude';
  activityLevel?: 'sedentario' | 'leve' | 'moderado' | 'intenso' | 'muito_intenso';
  experience?: 'iniciante' | 'intermediario' | 'avancado';
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({});

  const handleFinish = () => {
    if (user) {
      // Atualizar dados do usuário com informações do onboarding
      setUser({
        ...user,
        onboardingCompleted: true,
        ...data
      } as any);
    }
    navigate('/');
  };

  const steps = [
    {
      id: 'welcome',
      title: 'Bem-vindo ao FitPro!',
      subtitle: 'Vamos configurar seu perfil em alguns passos simples',
      icon: <CheckCircle size={64} />,
      render: () => (
        <div className="onboarding-welcome">
          <div className="welcome-icon">{steps[0].icon}</div>
          <h1>{steps[0].title}</h1>
          <p>{steps[0].subtitle}</p>
          <ul className="welcome-benefits">
            <li>📊 Acompanhamento personalizado</li>
            <li>🏋️ Treinos adaptados ao seu nível</li>
            <li>🥗 Planos alimentares inteligentes</li>
            <li>📈 Evolução em tempo real</li>
          </ul>
        </div>
      )
    },
    {
      id: 'personal-info',
      title: 'Dados Pessoais',
      subtitle: 'Conte-nos um pouco sobre você',
      icon: <User size={48} />,
      render: () => (
        <div className="onboarding-form">
          <div className="form-header">
            <div className="form-icon">{steps[1].icon}</div>
            <h2>{steps[1].title}</h2>
            <p>{steps[1].subtitle}</p>
          </div>
          
          <div className="form-group">
            <label>Idade</label>
            <input
              type="number"
              value={data.age || ''}
              onChange={(e) => setData({ ...data, age: parseInt(e.target.value) })}
              placeholder="Ex: 25"
              min="12"
              max="100"
            />
          </div>

          <div className="form-group">
            <label>Gênero</label>
            <div className="radio-group">
              <label className={data.gender === 'masculino' ? 'active' : ''}>
                <input
                  type="radio"
                  name="gender"
                  value="masculino"
                  checked={data.gender === 'masculino'}
                  onChange={(e) => setData({ ...data, gender: e.target.value as any })}
                />
                <span>Masculino</span>
              </label>
              <label className={data.gender === 'feminino' ? 'active' : ''}>
                <input
                  type="radio"
                  name="gender"
                  value="feminino"
                  checked={data.gender === 'feminino'}
                  onChange={(e) => setData({ ...data, gender: e.target.value as any })}
                />
                <span>Feminino</span>
              </label>
              <label className={data.gender === 'outro' ? 'active' : ''}>
                <input
                  type="radio"
                  name="gender"
                  value="outro"
                  checked={data.gender === 'outro'}
                  onChange={(e) => setData({ ...data, gender: e.target.value as any })}
                />
                <span>Outro</span>
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Peso (kg)</label>
              <input
                type="number"
                value={data.weight || ''}
                onChange={(e) => setData({ ...data, weight: parseFloat(e.target.value) })}
                placeholder="Ex: 70"
                min="30"
                max="300"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label>Altura (cm)</label>
              <input
                type="number"
                value={data.height || ''}
                onChange={(e) => setData({ ...data, height: parseInt(e.target.value) })}
                placeholder="Ex: 175"
                min="100"
                max="250"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'goals',
      title: 'Seus Objetivos',
      subtitle: 'O que você quer alcançar?',
      icon: <Target size={48} />,
      render: () => (
        <div className="onboarding-form">
          <div className="form-header">
            <div className="form-icon">{steps[2].icon}</div>
            <h2>{steps[2].title}</h2>
            <p>{steps[2].subtitle}</p>
          </div>

          <div className="form-group">
            <label>Objetivo Principal</label>
            <div className="card-select">
              <div
                className={`select-card ${data.goal === 'perder_peso' ? 'active' : ''}`}
                onClick={() => setData({ ...data, goal: 'perder_peso' })}
              >
                <div className="card-icon">🔥</div>
                <h3>Perder Peso</h3>
                <p>Queimar gordura e definir</p>
              </div>

              <div
                className={`select-card ${data.goal === 'ganhar_massa' ? 'active' : ''}`}
                onClick={() => setData({ ...data, goal: 'ganhar_massa' })}
              >
                <div className="card-icon">💪</div>
                <h3>Ganhar Massa</h3>
                <p>Hipertrofia muscular</p>
              </div>

              <div
                className={`select-card ${data.goal === 'manter_forma' ? 'active' : ''}`}
                onClick={() => setData({ ...data, goal: 'manter_forma' })}
              >
                <div className="card-icon">⚖️</div>
                <h3>Manter Forma</h3>
                <p>Equilíbrio e tonificação</p>
              </div>

              <div
                className={`select-card ${data.goal === 'melhorar_saude' ? 'active' : ''}`}
                onClick={() => setData({ ...data, goal: 'melhorar_saude' })}
              >
                <div className="card-icon">❤️</div>
                <h3>Saúde</h3>
                <p>Bem-estar geral</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'activity',
      title: 'Nível de Atividade',
      subtitle: 'Qual sua rotina atual?',
      icon: <Activity size={48} />,
      render: () => (
        <div className="onboarding-form">
          <div className="form-header">
            <div className="form-icon">{steps[3].icon}</div>
            <h2>{steps[3].title}</h2>
            <p>{steps[3].subtitle}</p>
          </div>

          <div className="form-group">
            <label>Nível de Atividade Física</label>
            <div className="list-select">
              <div
                className={`list-item ${data.activityLevel === 'sedentario' ? 'active' : ''}`}
                onClick={() => setData({ ...data, activityLevel: 'sedentario' })}
              >
                <h4>Sedentário</h4>
                <p>Pouco ou nenhum exercício</p>
              </div>

              <div
                className={`list-item ${data.activityLevel === 'leve' ? 'active' : ''}`}
                onClick={() => setData({ ...data, activityLevel: 'leve' })}
              >
                <h4>Levemente Ativo</h4>
                <p>Exercício leve 1-3 dias/semana</p>
              </div>

              <div
                className={`list-item ${data.activityLevel === 'moderado' ? 'active' : ''}`}
                onClick={() => setData({ ...data, activityLevel: 'moderado' })}
              >
                <h4>Moderadamente Ativo</h4>
                <p>Exercício moderado 3-5 dias/semana</p>
              </div>

              <div
                className={`list-item ${data.activityLevel === 'intenso' ? 'active' : ''}`}
                onClick={() => setData({ ...data, activityLevel: 'intenso' })}
              >
                <h4>Muito Ativo</h4>
                <p>Exercício intenso 6-7 dias/semana</p>
              </div>

              <div
                className={`list-item ${data.activityLevel === 'muito_intenso' ? 'active' : ''}`}
                onClick={() => setData({ ...data, activityLevel: 'muito_intenso' })}
              >
                <h4>Extremamente Ativo</h4>
                <p>Exercício muito intenso, trabalho físico</p>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Experiência com Treinos</label>
            <div className="radio-group-horizontal">
              <label className={data.experience === 'iniciante' ? 'active' : ''}>
                <input
                  type="radio"
                  name="experience"
                  value="iniciante"
                  checked={data.experience === 'iniciante'}
                  onChange={(e) => setData({ ...data, experience: e.target.value as any })}
                />
                <span>Iniciante</span>
              </label>
              <label className={data.experience === 'intermediario' ? 'active' : ''}>
                <input
                  type="radio"
                  name="experience"
                  value="intermediario"
                  checked={data.experience === 'intermediario'}
                  onChange={(e) => setData({ ...data, experience: e.target.value as any })}
                />
                <span>Intermediário</span>
              </label>
              <label className={data.experience === 'avancado' ? 'active' : ''}>
                <input
                  type="radio"
                  name="experience"
                  value="avancado"
                  checked={data.experience === 'avancado'}
                  onChange={(e) => setData({ ...data, experience: e.target.value as any })}
                />
                <span>Avançado</span>
              </label>
            </div>
          </div>
        </div>
      )
    }
  ];

  const canProceed = () => {
    if (currentStep === 0) return true;
    if (currentStep === 1) return data.age && data.gender && data.weight && data.height;
    if (currentStep === 2) return data.goal;
    if (currentStep === 3) return data.activityLevel && data.experience;
    return false;
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        {/* Progress bar */}
        <div className="onboarding-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="progress-text">
            Passo {currentStep + 1} de {steps.length}
          </span>
        </div>

        {/* Content */}
        <div className="onboarding-content">
          {steps[currentStep].render()}
        </div>

        {/* Navigation */}
        <div className="onboarding-navigation">
          {currentStep > 0 && (
            <button 
              className="btn-secondary"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
          )}

          <div style={{ flex: 1 }} />

          {currentStep < steps.length - 1 ? (
            <button 
              className="btn-primary"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
            >
              Próximo
              <ArrowRight size={20} />
            </button>
          ) : (
            <button 
              className="btn-primary"
              onClick={handleFinish}
              disabled={!canProceed()}
            >
              Finalizar
              <CheckCircle size={20} />
            </button>
          )}
        </div>

        {/* Skip option */}
        {currentStep === 0 && (
          <button 
            className="skip-button"
            onClick={() => navigate('/')}
          >
            Pular configuração
          </button>
        )}
      </div>
    </div>
  );
}
