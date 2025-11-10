import { useAppData } from '../../hooks/useAppData';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { SectionTitle } from '../../components/common/SectionTitle';
import { Bell, Heart, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import './NotificationsPage.css';

export function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, toggleNotification } = useAppData();

  // Filtra notificações do usuário logado
  const userNotifications = notifications.filter(n => n.id_user === user?.id || n.id_user === user?.name);

  const handleMarkAsRead = (notificationId: string) => {
    toggleNotification(notificationId, true);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'feed-like':
        return <Heart size={20} style={{ color: '#00b4d8' }} />;
      case 'feed-comment':
        return <MessageCircle size={20} style={{ color: '#00b4d8' }} />;
      case 'parabens':
        return <CheckCircle size={20} style={{ color: '#4ade80' }} />;
      case 'alerta':
        return <AlertCircle size={20} style={{ color: '#fb923c' }} />;
      default:
        return <Bell size={20} style={{ color: '#00b4d8' }} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="notifications-page">
      <SectionTitle 
        title="Notificações" 
        subtitle={`${userNotifications.filter(n => !n.read).length} não lidas`}
      />

      {userNotifications.length === 0 ? (
        <Card>
          <div className="notifications-empty">
            <Bell size={48} style={{ opacity: 0.3 }} />
            <p>Nenhuma notificação ainda.</p>
          </div>
        </Card>
      ) : (
        <div className="notifications-list">
          {userNotifications.map(notification => (
            <Card 
              key={notification.id} 
              accent={notification.read ? 'neutral' : 'primary'}
              interactive
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <strong className="notification-title">{notification.title}</strong>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-date">{formatDate(notification.date)}</span>
                </div>
                {!notification.read && (
                  <div className="notification-badge"></div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
