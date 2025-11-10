import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Send, ArrowLeft } from 'lucide-react';
import './ChatPage.css';

export function ChatPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { chat, students, sendMessage } = useAppData();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filtra mensagens apenas deste aluno
  const userMessages = chat.filter(
    msg => 
      msg.from === studentId || 
      msg.to === studentId ||
      (user?.type === 'aluno' && (msg.from === user.id || msg.to === user.id))
  );

  // Identifica o aluno
  const currentStudent = user?.type === 'personal' 
    ? students.find((s) => s.id_user === studentId)
    : null;

  const chatPartnerName = user?.type === 'personal'
    ? `Aluno #${studentId?.slice(-6)}`
    : 'Personal Trainer';

  // Scroll automático para o final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [userMessages.length]);

  const handleSend = () => {
    if (!messageText.trim() || !user) return;

    // Determina o destinatário
    const recipientId = user.type === 'personal' ? studentId : 'personal-1';

    if (recipientId) {
      sendMessage({
        from: user.id,
        to: recipientId,
        message: messageText,
      });
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-page">
      <Card accent="neutral">
        <div className="chat-header">
          <Button
            variant="ghost"
            onClick={() => navigate('/chat')}
            icon={<ArrowLeft size={20} />}
          />
          <div className="chat-header__content">
            <h2>{chatPartnerName}</h2>
            {currentStudent && (
              <p className="chat-subtitle">{currentStudent.goal}</p>
            )}
          </div>
        </div>

        <div className="chat-container">
          <div className="messages-list">
            {userMessages.map((msg) => {
              const isOwn = msg.from === user?.id;
              
              return (
                <div 
                  key={msg.id} 
                  className={`message ${isOwn ? 'message--own' : 'message--other'}`}
                >
                  <div className="message__bubble">
                    <p>{msg.message}</p>
                    <span className="message__time">
                      {new Date(msg.date).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button 
              variant="primary" 
              icon={<Send size={20} />}
              onClick={handleSend}
            >
              Enviar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
