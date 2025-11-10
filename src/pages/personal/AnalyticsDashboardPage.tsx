import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/common/Card';
import './AnalyticsDashboardPage.css';

export function AnalyticsDashboardPage() {
  const { students, workouts } = useAppData();

  // Métricas gerais
  const totalStudents = students.length;
  const totalWorkouts = Object.values(workouts).flat().length;
  const completedWorkouts = Object.values(workouts).flat().filter(w => w.status === 'concluido' || w.status === 'concluído').length;
  const completionRate = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;

  // Dados para gráfico de treinos por semana (últimas 8 semanas)
  const getWorkoutsPerWeek = () => {
    const data = [
      { week: '01/04', value: 28 },
      { week: '08/04', value: 32 },
      { week: '15/04', value: 29 },
      { week: '22/04', value: 35 },
      { week: '29/04', value: 31 },
      { week: '06/05', value: 38 },
      { week: '13/05', value: 42 },
      { week: '20/05', value: 45 },
    ];
    return data;
  };

  const workoutsData = getWorkoutsPerWeek();
  const maxValue = Math.max(...workoutsData.map(d => d.value));

  // Gerar pontos do gráfico SVG
  const generatePath = () => {
    const width = 500;
    const height = 200;
    const points = workoutsData.map((item, index) => {
      const x = (index / (workoutsData.length - 1)) * width;
      const y = height - (item.value / maxValue) * height;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const generateAreaPath = () => {
    const width = 500;
    const height = 200;
    const points = workoutsData.map((item, index) => {
      const x = (index / (workoutsData.length - 1)) * width;
      const y = height - (item.value / maxValue) * height;
      return `${x},${y}`;
    });
    return `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;
  };

  // Top alunos mais ativos
  const getTopStudents = () => {
    return students.map(student => {
      const studentWorkouts = workouts[student.id_user] || [];
      const completed = studentWorkouts.filter(w => w.status === 'concluido' || w.status === 'concluído').length;
      const total = studentWorkouts.length;
      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { ...student, completedWorkouts: completed, totalWorkouts: total, completionRate: rate };
    })
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 5);
  };

  const topStudents = getTopStudents();

  return (
    <div className="analytics-dashboard">
      {/* Header com valor total */}
      <div className="analytics-total-value">
        <div className="total-value-header">
          <button className="nav-arrow">‹</button>
          <div className="total-value-content">
            <span className="total-value-label">PERFORMANCE TOTAL</span>
            <h1 className="total-value-number">{completedWorkouts}.{totalWorkouts}</h1>
            <div className="total-value-trend">
              <span className="trend-icon">▲</span>
              <span className="trend-text">+{completionRate}%</span>
            </div>
          </div>
          <button className="nav-arrow">›</button>
        </div>
        
        <div className="total-value-stats">
          <div className="stat-item">
            <span className="stat-label">Alunos Ativos</span>
            <span className="stat-value">{totalStudents}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Treinos</span>
            <span className="stat-value">{totalWorkouts}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Taxa</span>
            <span className="stat-value positive">+{completionRate}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Concluídos</span>
            <span className="stat-value">{completedWorkouts}</span>
          </div>
        </div>
      </div>

      {/* Gráfico principal com grid */}
      <Card accent="primary">
        <div className="main-chart">
          <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="chart-svg">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#f093fb', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#f5576c', stopOpacity: 0.1 }} />
              </linearGradient>
            </defs>
            
            {/* Grid horizontal */}
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={i}
                x1="0"
                y1={i * 50}
                x2="500"
                y2={i * 50}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            ))}
            
            {/* Grid vertical */}
            {workoutsData.map((_, i) => (
              <line
                key={i}
                x1={(i / (workoutsData.length - 1)) * 500}
                y1="0"
                x2={(i / (workoutsData.length - 1)) * 500}
                y2="200"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            ))}
            
            {/* Área do gráfico */}
            <path
              d={generateAreaPath()}
              fill="url(#chartGradient)"
            />
            
            {/* Linha do gráfico */}
            <path
              d={generatePath()}
              fill="none"
              stroke="#f093fb"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Pontos no gráfico */}
            {workoutsData.map((item, index) => {
              const x = (index / (workoutsData.length - 1)) * 500;
              const y = 200 - (item.value / maxValue) * 200;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#f093fb"
                  stroke="#fff"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
          
          {/* Labels do eixo X */}
          <div className="chart-x-axis">
            {workoutsData.map((item, index) => (
              <span key={index} className="x-label">{item.week}</span>
            ))}
          </div>
        </div>
      </Card>

      {/* Cards inferiores em 3 colunas */}
      <div className="bottom-cards">
        {/* Card esquerdo - Tarefa desta semana */}
        <Card accent="primary">
          <div className="info-card">
            <h3>TREINOS ESTA SEMANA</h3>
            <div className="mini-chart">
              <svg viewBox="0 0 200 80" preserveAspectRatio="none">
                <path
                  d="M 0 60 L 40 50 L 80 55 L 120 40 L 160 45 L 200 30"
                  fill="none"
                  stroke="#f093fb"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </Card>

        {/* Card central - Projetos/Alunos */}
        <Card accent="primary">
          <div className="info-card">
            <h3>ALUNOS ATIVOS</h3>
            <p className="card-subtitle">{totalStudents} Alunos</p>
            <div className="donut-mini">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="35" fill="none" stroke="#2d3748" strokeWidth="15" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="35" 
                  fill="none" 
                  stroke="url(#gradient2)" 
                  strokeWidth="15"
                  strokeDasharray={`${completionRate * 2.2} ${220 - completionRate * 2.2}`}
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#f093fb' }} />
                    <stop offset="100%" style={{ stopColor: '#f5576c' }} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="donut-center">
                <span>{completionRate}%</span>
              </div>
            </div>
            <div className="legend-mini">
              <div><span className="dot" style={{ background: '#f093fb' }}></span> Ativos</div>
              <div><span className="dot" style={{ background: '#2d3748' }}></span> Inativos</div>
            </div>
          </div>
        </Card>

        {/* Card direito - Estatísticas */}
        <Card accent="primary">
          <div className="info-card">
            <div className="stat-row">
              <div className="stat-box">
                <span className="stat-box-label">TOTAL TRABALHO</span>
                <span className="stat-box-value">{completedWorkouts}:{totalWorkouts}:{totalStudents * 2}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Top alunos */}
      <Card accent="primary">
        <div className="top-students">
          <h3>Top 5 Alunos Mais Ativos</h3>
          <div className="students-list">
            {topStudents.map((student, index) => (
              <div key={student.id_user} className="student-item">
                <div className="student-rank" style={{
                  background: index === 0 ? 'linear-gradient(135deg, #ffd700, #ffed4e)' : 
                             index === 1 ? 'linear-gradient(135deg, #c0c0c0, #e8e8e8)' :
                             index === 2 ? 'linear-gradient(135deg, #cd7f32, #daa520)' :
                             'linear-gradient(135deg, #667eea, #764ba2)'
                }}>
                  {index + 1}
                </div>
                <div className="student-info">
                  <strong>{student.id_user}</strong>
                  <span>{student.completedWorkouts}/{student.totalWorkouts} treinos</span>
                </div>
                <div className="student-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${student.completionRate}%` }}></div>
                  </div>
                  <span className="progress-label">{student.completionRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
