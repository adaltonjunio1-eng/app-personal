import { useState } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/common/Card';
import { SectionTitle } from '../../components/common/SectionTitle';
import { DollarSign, TrendingUp, Users, Calendar, CheckCircle, AlertCircle, Clock, Plus, Filter } from 'lucide-react';
import './FinancialPage.css';

interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pago' | 'pendente' | 'atrasado';
  month: string;
}

export function FinancialPage() {
  const { students } = useAppData();
  const [filter, setFilter] = useState<'todos' | 'pago' | 'pendente' | 'atrasado'>('todos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    studentId: '',
    amount: '',
    dueDate: '',
    month: ''
  });
  
  // Mock de pagamentos
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 'pay-1',
      studentId: 'student-1',
      studentName: 'Lucas Andrade',
      amount: 350,
      dueDate: '2025-11-10',
      paidDate: '2025-11-08',
      status: 'pago',
      month: 'Novembro 2025'
    },
    {
      id: 'pay-2',
      studentId: 'student-2',
      studentName: 'Ana Beatriz',
      amount: 400,
      dueDate: '2025-11-15',
      status: 'pendente',
      month: 'Novembro 2025'
    },
    {
      id: 'pay-3',
      studentId: 'student-1',
      studentName: 'Lucas Andrade',
      amount: 350,
      dueDate: '2025-10-10',
      paidDate: '2025-10-09',
      status: 'pago',
      month: 'Outubro 2025'
    },
    {
      id: 'pay-4',
      studentId: 'student-2',
      studentName: 'Ana Beatriz',
      amount: 400,
      dueDate: '2025-10-05',
      status: 'atrasado',
      month: 'Outubro 2025'
    },
  ]);

  const filteredPayments = payments.filter(p => 
    filter === 'todos' ? true : p.status === filter
  );

  // Cálculos
  const totalReceived = payments.filter(p => p.status === 'pago')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalPending = payments.filter(p => p.status === 'pendente')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalOverdue = payments.filter(p => p.status === 'atrasado')
    .reduce((sum, p) => sum + p.amount, 0);

  const activeStudents = students.length;

  const handleMarkAsPaid = (paymentId: string) => {
    setPayments(prevPayments =>
      prevPayments.map(payment =>
        payment.id === paymentId
          ? {
              ...payment,
              status: 'pago' as const,
              paidDate: new Date().toISOString().split('T')[0]
            }
          : payment
      )
    );
  };

  const handleAddPayment = () => {
    setShowAddModal(true);
  };

  const handleSavePayment = () => {
    if (!newPayment.studentId || !newPayment.amount || !newPayment.dueDate || !newPayment.month) {
      alert('Preencha todos os campos');
      return;
    }

    const student = students.find(s => s.id === newPayment.studentId);
    if (!student) return;

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      studentId: newPayment.studentId,
      studentName: student.name,
      amount: parseFloat(newPayment.amount),
      dueDate: newPayment.dueDate,
      status: 'pendente',
      month: newPayment.month
    };

    setPayments(prev => [payment, ...prev]);
    setShowAddModal(false);
    setNewPayment({ studentId: '', amount: '', dueDate: '', month: '' });
  };

  const handleCancelPayment = () => {
    setShowAddModal(false);
    setNewPayment({ studentId: '', amount: '', dueDate: '', month: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'var(--success)';
      case 'pendente': return 'var(--warning)';
      case 'atrasado': return 'var(--danger)';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pago': return <CheckCircle size={18} />;
      case 'pendente': return <Clock size={18} />;
      case 'atrasado': return <AlertCircle size={18} />;
      default: return null;
    }
  };

  return (
    <div className="financial-page">
      <SectionTitle 
        title="Gestão Financeira" 
        subtitle="Controle completo de pagamentos e receitas"
      />

      {/* Cards de resumo */}
      <div className="financial-summary">
        <Card accent="success">
          <div className="summary-card">
            <div className="summary-icon success">
              <DollarSign size={28} />
            </div>
            <div className="summary-content">
              <span className="summary-label">Recebido</span>
              <h2 className="summary-value">R$ {totalReceived.toFixed(2)}</h2>
              <span className="summary-trend">
                <TrendingUp size={14} />
                +12% este mês
              </span>
            </div>
          </div>
        </Card>

        <Card accent="warning">
          <div className="summary-card">
            <div className="summary-icon warning">
              <Clock size={28} />
            </div>
            <div className="summary-content">
              <span className="summary-label">A Receber</span>
              <h2 className="summary-value">R$ {totalPending.toFixed(2)}</h2>
              <span className="summary-subtitle">
                {payments.filter(p => p.status === 'pendente').length} pendentes
              </span>
            </div>
          </div>
        </Card>

        <Card accent="danger">
          <div className="summary-card">
            <div className="summary-icon danger">
              <AlertCircle size={28} />
            </div>
            <div className="summary-content">
              <span className="summary-label">Atrasados</span>
              <h2 className="summary-value">R$ {totalOverdue.toFixed(2)}</h2>
              <span className="summary-subtitle">
                {payments.filter(p => p.status === 'atrasado').length} em atraso
              </span>
            </div>
          </div>
        </Card>

        <Card accent="primary">
          <div className="summary-card">
            <div className="summary-icon primary">
              <Users size={28} />
            </div>
            <div className="summary-content">
              <span className="summary-label">Alunos Ativos</span>
              <h2 className="summary-value">{activeStudents}</h2>
              <span className="summary-subtitle">Total de alunos</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros e ações */}
      <Card accent="neutral">
        <div className="financial-header">
          <div className="filter-group">
            <Filter size={20} />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value as any)}
              className="filter-select"
            >
              <option value="todos">Todos</option>
              <option value="pago">Pagos</option>
              <option value="pendente">Pendentes</option>
              <option value="atrasado">Atrasados</option>
            </select>
          </div>

          <button className="btn-add-payment" onClick={handleAddPayment}>
            <Plus size={20} />
            Novo Pagamento
          </button>
        </div>
      </Card>

      {/* Lista de pagamentos */}
      <Card accent="neutral">
        <div className="payments-list">
          <h3>
            <Calendar size={20} />
            Histórico de Pagamentos
          </h3>

          <div className="payments-table">
            <div className="table-header">
              <div className="col-student">Aluno</div>
              <div className="col-month">Referência</div>
              <div className="col-value">Valor</div>
              <div className="col-due">Vencimento</div>
              <div className="col-status">Status</div>
              <div className="col-actions">Ações</div>
            </div>

            {filteredPayments.map(payment => (
              <div key={payment.id} className="table-row">
                <div className="col-student">
                  <div className="student-avatar">
                    {payment.studentName.charAt(0)}
                  </div>
                  <span>{payment.studentName}</span>
                </div>

                <div className="col-month">{payment.month}</div>

                <div className="col-value">
                  <strong>R$ {payment.amount.toFixed(2)}</strong>
                </div>

                <div className="col-due">
                  {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                  {payment.paidDate && (
                    <span className="paid-date">
                      Pago: {new Date(payment.paidDate).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>

                <div className="col-status">
                  <span 
                    className={`status-badge status-${payment.status}`}
                    style={{ color: getStatusColor(payment.status) }}
                  >
                    {getStatusIcon(payment.status)}
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </div>

                <div className="col-actions">
                  {payment.status !== 'pago' && (
                    <button
                      className="btn-mark-paid"
                      onClick={() => handleMarkAsPaid(payment.id)}
                    >
                      <CheckCircle size={16} />
                      Marcar como Pago
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredPayments.length === 0 && (
              <div className="empty-state">
                <AlertCircle size={48} />
                <p>Nenhum pagamento encontrado</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Modal de adicionar pagamento */}
      {showAddModal && (
        <div className="modal-overlay" onClick={handleCancelPayment}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Novo Pagamento</h2>
            
            <div className="form-group">
              <label>Aluno</label>
              <select
                value={newPayment.studentId}
                onChange={(e) => setNewPayment({ ...newPayment, studentId: e.target.value })}
                className="form-control"
              >
                <option value="">Selecione um aluno</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Mês de Referência</label>
              <input
                type="text"
                placeholder="Ex: Novembro 2025"
                value={newPayment.month}
                onChange={(e) => setNewPayment({ ...newPayment, month: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Data de Vencimento</label>
              <input
                type="date"
                value={newPayment.dueDate}
                onChange={(e) => setNewPayment({ ...newPayment, dueDate: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleCancelPayment}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleSavePayment}>
                <Plus size={16} />
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
