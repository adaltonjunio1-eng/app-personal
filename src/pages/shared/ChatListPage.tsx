import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/common/Card';
import { SectionTitle } from '../../components/common/SectionTitle';
import { MessageCircle, Search } from 'lucide-react';
import { useState } from 'react';
import './ChatListPage.css';

export function ChatListPage() {
  const { user } = useAuth();
  const { students, chat } = useAppData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Para personal: lista de alunos com última mensagem
  // Para aluno: vai direto para o chat com o personal
  if (user?.type === 'aluno') {
    navigate('/chat/personal-1');
    return null;
  }

  // Agrupa mensagens por aluno
  const chatsByStudent = students.map((student) => {
    const studentMessages = chat.filter(
      (msg) => msg.from === student.id_user || msg.to === student.id_user
    );

    const lastMessage = studentMessages.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];

    const unreadCount = studentMessages.filter(
      (msg) => msg.from === student.id_user && msg.to === user?.id
    ).length;

    return {
      student,
      lastMessage,
      unreadCount,
      messagesCount: studentMessages.length,
    };
  });

  const filteredChats = chatsByStudent.filter((chat) =>
    chat.student.goal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chat-list-page">
      <SectionTitle
        title="Conversas"
        subtitle="Suas mensagens com os alunos"
      />

      <div className="chat-list-page__filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar conversa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="chat-list">
        {filteredChats.map(({ student, lastMessage, unreadCount, messagesCount }) => (
          <Card
            key={student.id_user}
            interactive
            accent={unreadCount > 0 ? 'primary' : 'neutral'}
            onClick={() => navigate(`/chat/${student.id_user}`)}
          >
            <div className="chat-list-item">
              <img
                src={`https://i.pravatar.cc/150?u=${student.id_user}`}
                alt="Avatar"
                className="chat-list-item__avatar"
              />
              <div className="chat-list-item__content">
                <div className="chat-list-item__header">
                  <strong>Aluno #{student.id_user.slice(-6)}</strong>
                  {lastMessage && (
                    <span className="chat-list-item__time">
                      {new Date(lastMessage.date).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
                <p className="chat-list-item__goal">{student.goal}</p>
                {lastMessage && (
                  <p className="chat-list-item__message">
                    {lastMessage.from === user?.id ? 'Você: ' : ''}
                    {lastMessage.message}
                  </p>
                )}
                {messagesCount === 0 && (
                  <p className="chat-list-item__empty">Nenhuma mensagem ainda</p>
                )}
              </div>
              <div className="chat-list-item__side">
                <MessageCircle size={20} />
                {unreadCount > 0 && (
                  <span className="chat-list-item__badge">{unreadCount}</span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredChats.length === 0 && (
        <Card>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '48px 24px' }}>
            Nenhuma conversa encontrada.
          </p>
        </Card>
      )}
    </div>
  );
}
