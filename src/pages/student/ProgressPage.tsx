import { useAuth } from '../../hooks/useAuth';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SectionTitle } from '../../components/common/SectionTitle';
import { TrendingUp, Camera, Ruler, Plus } from 'lucide-react';
import './ProgressPage.css';

export function ProgressPage() {
  const { user } = useAuth();
  const { progress } = useAppData();

  // Pega o progresso do usuário atual
  const userProgress = user ? progress[user.id] : null;

  if (!userProgress) {
    return (
      <div className="progress-page">
        <SectionTitle title="Progresso" subtitle="Acompanhe sua evolução" />
        <Card accent="neutral">
          <p>Nenhum dado de progresso registrado ainda.</p>
        </Card>
      </div>
    );
  }

  const latestWeight = userProgress.weight[userProgress.weight.length - 1];
  const firstWeight = userProgress.weight[0];
  const weightDiff = latestWeight.value - firstWeight.value;

  return (
    <div className="progress-page">
      <SectionTitle 
        title="Progresso" 
        subtitle="Acompanhe sua evolução"
        action={
          <Button variant="primary" icon={<Plus size={18} />}>
            Registrar
          </Button>
        }
      />

      {/* Peso */}
      <div className="progress-section">
        <div className="progress-section__header">
          <div className="icon-wrapper">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3>Peso</h3>
            <p>
              {latestWeight.value} kg 
              <span className={`weight-diff ${weightDiff < 0 ? 'negative' : 'positive'}`}>
                {weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(1)} kg
              </span>
            </p>
          </div>
        </div>

        <div className="weight-chart">
          <div className="chart-grid">
            {userProgress.weight.map((entry, index) => {
              const maxWeight = Math.max(...userProgress.weight.map(w => w.value));
              const minWeight = Math.min(...userProgress.weight.map(w => w.value));
              const range = maxWeight - minWeight || 1;
              const heightPercent = ((entry.value - minWeight) / range) * 80 + 10;

              return (
                <div key={index} className="chart-bar">
                  <div 
                    className="bar-fill" 
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="bar-label">
                    {new Date(entry.date).toLocaleDateString('pt-BR', { month: 'short' })}
                  </span>
                  <span className="bar-value">{entry.value} kg</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Medidas */}
      <div className="progress-section">
        <div className="progress-section__header">
          <div className="icon-wrapper">
            <Ruler size={24} />
          </div>
          <h3>Medidas Corporais</h3>
        </div>

        <div className="measurements-grid">
          {userProgress.measurements.map((measurement, index) => (
            <Card key={index} accent="neutral">
              <div className="measurement-item">
                <span className="measurement-label">{measurement.label}</span>
                <span className="measurement-value">{measurement.value} cm</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Fotos */}
      <div className="progress-section">
        <div className="progress-section__header">
          <div className="icon-wrapper">
            <Camera size={24} />
          </div>
          <h3>Fotos de Progresso</h3>
        </div>

        <div className="photos-grid">
          {userProgress.photos.map((photo, index) => (
            <div key={index} className="photo-item">
              <img src={photo.url} alt={`Progresso ${index + 1}`} />
              <span className="photo-date">
                {new Date(photo.date).toLocaleDateString('pt-BR')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
