import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/common/Card';
import { SectionTitle } from '../../components/common/SectionTitle';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Search, UserPlus, Filter, Dumbbell, UtensilsCrossed, MessageCircle } from 'lucide-react';
import './StudentsListPage.css';

export function StudentsListPage() {
  const { students, workouts } = useAppData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ativo' | 'pausado'>('all');

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.goal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="students-list">
      <SectionTitle
        title="Meus Alunos"
        subtitle={`${students.length} alunos cadastrados`}
        action={
          <Button icon={<UserPlus size={18} />}>
            Adicionar aluno
          </Button>
        }
      />

      <div className="students-list__filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="search"
            placeholder="Buscar por objetivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
            <option value="all">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="pausado">Pausados</option>
          </select>
        </div>
      </div>

      <div className="students-grid">
        {filteredStudents.map((student) => {
          const studentWorkouts = workouts[student.id_user] || [];
          const pendingCount = studentWorkouts.filter((w) => w.status === 'pendente').length;
          const completedCount = studentWorkouts.filter((w) => w.status === 'concluido' || w.status === 'concluído').length;

          return (
            <Card key={student.id_user} interactive>
              <div className="student-item">
                <img
                  src={`https://i.pravatar.cc/150?u=${student.id_user}`}
                  alt="Avatar"
                  className="student-item__avatar"
                />
                <div className="student-item__info">
                  <div className="student-item__header">
                    <strong>Aluno #{student.id_user.slice(-6)}</strong>
                    <Badge
                      label={student.status}
                      tone={student.status === 'ativo' ? 'positive' : 'default'}
                    />
                  </div>
                  <p className="student-item__goal">{student.goal}</p>
                  <div className="student-item__stats">
                    <span>{pendingCount} pendentes</span>
                    <span>•</span>
                    <span>{completedCount} concluídos</span>
                  </div>
                  <div className="student-item__actions">
                    <Button 
                      variant="primary" 
                      icon={<Dumbbell size={16} />}
                      onClick={() => navigate('/treinos/novo')}
                    >
                      Treino
                    </Button>
                    <Button 
                      variant="ghost" 
                      icon={<UtensilsCrossed size={16} />}
                      onClick={() => navigate('/alimentacao/novo')}
                    >
                      Dieta
                    </Button>
                    <Button 
                      variant="ghost" 
                      icon={<MessageCircle size={16} />}
                      onClick={() => navigate(`/chat/${student.id_user}`)}
                    >
                      Chat
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '48px 24px' }}>
            Nenhum aluno encontrado com os filtros aplicados.
          </p>
        </Card>
      )}
    </div>
  );
}
