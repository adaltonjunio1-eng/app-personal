import { useState } from 'react';
import { normalizeLoginText } from '../../utils/format';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/common/Card';
import { SectionTitle } from '../../components/common/SectionTitle';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Search, UserPlus, Filter, Dumbbell, UtensilsCrossed, MessageCircle } from 'lucide-react';
import './StudentsListPage.css';

export function StudentsListPage() {
  const { students, workouts, addStudent } = useAppData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ativo' | 'pausado'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentials, setCredentials] = useState({ login: '', password: '', name: '', phone: '' });
  const [newStudent, setNewStudent] = useState({
    name: '',
    phone: '',
    goal: '',
  });

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.goal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddStudent = () => {
    setShowAddModal(true);
  };

  const handleSaveStudent = () => {
    if (!newStudent.name || !newStudent.phone || !newStudent.goal) {
      alert('Preencha todos os campos');
      return;
    }

    // Validar telefone (deve ter pelo menos 4 dígitos)
    const phoneDigits = newStudent.phone.replace(/\D/g, '');
    if (phoneDigits.length < 4) {
      alert('Digite um número de telefone válido');
      return;
    }

    // Gerar login e senha
  const login = normalizeLoginText(newStudent.name); // Nome sem acentos e sem espaços
    const lastFourDigits = phoneDigits.slice(-4); // Últimos 4 dígitos do telefone
  const password = `${login}${lastFourDigits}`;

    // Adicionar o aluno usando a função do contexto
    addStudent(newStudent);
    
    // Salvar credenciais para mostrar no modal
    setCredentials({
      login: login,
      password: password,
      name: newStudent.name,
      phone: newStudent.phone
    });
    
    setShowAddModal(false);
    setNewStudent({ name: '', phone: '', goal: '' });
    setShowCredentialsModal(true);
  };

  const handleCopyCredentials = () => {
    const text = `Olá ${credentials.name}!\n\nSuas credenciais de acesso ao app:\nLogin: ${credentials.login}\nSenha: ${credentials.password}\n\nGuarde essas informações em um local seguro.`;
    navigator.clipboard.writeText(text);
    alert('Credenciais copiadas!');
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setNewStudent({ name: '', phone: '', goal: '' });
  };

  return (
    <div className="students-list">
      <SectionTitle
        title="Meus Alunos"
        subtitle={`${students.length} alunos cadastrados`}
        action={
          <Button icon={<UserPlus size={18} />} onClick={handleAddStudent}>
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

      {/* Modal de Adicionar Aluno */}
      {showAddModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Adicionar Novo Aluno</h2>
            
            <div className="form-group">
              <label>Nome Completo</label>
              <input
                type="text"
                placeholder="Ex: João Silva"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className="form-control"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Telefone</label>
              <input
                type="tel"
                placeholder="Ex: (11) 98765-4321"
                value={newStudent.phone}
                onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Objetivo</label>
              <input
                type="text"
                placeholder="Ex: Perder peso, Ganhar massa muscular"
                value={newStudent.goal}
                onChange={(e) => setNewStudent({ ...newStudent, goal: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleSaveStudent}>
                <UserPlus size={16} />
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Credenciais */}
      {showCredentialsModal && (
        <div className="modal-overlay" onClick={() => setShowCredentialsModal(false)}>
          <div className="modal-content credentials-modal" onClick={(e) => e.stopPropagation()}>
            <h2>✅ Aluno Cadastrado!</h2>
            
            <p className="credentials-intro">
              {credentials.name} foi adicionado com sucesso! Compartilhe as credenciais abaixo:
            </p>

            <div className="credentials-box">
              <div className="credential-item">
                <label>📱 Telefone:</label>
                <strong>{credentials.phone}</strong>
              </div>
              <div className="credential-item">
                <label>👤 Login:</label>
                <strong>{credentials.login}</strong>
              </div>
              <div className="credential-item">
                <label>🔒 Senha:</label>
                <strong className="password">{credentials.password}</strong>
              </div>
            </div>

            <p className="credentials-warning">
              ⚠️ Guarde essas informações! O aluno precisará delas para fazer login.
            </p>

            <div className="modal-actions">
              <button className="btn-copy" onClick={handleCopyCredentials}>
                📋 Copiar Credenciais
              </button>
              <button className="btn-save" onClick={() => setShowCredentialsModal(false)}>
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
