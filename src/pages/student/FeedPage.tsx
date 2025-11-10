import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { Heart, MessageCircle, Camera, Bell } from 'lucide-react';
import { useAppData } from '../../hooks/useAppData';
import './FeedPage.css';

export function FeedPage() {
  const { user } = useAuth();
  const { notifications, addFeedNotification } = useAppData();
  const [posts, setPosts] = useState<any[]>([]);
  const [newCaption, setNewCaption] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);

  // Função para curtir
  const handleLike = (postId: string) => {
    setPosts(posts => posts.map(post => {
      if (post.id === postId) {
        // Notifica o dono do post se não for o próprio usuário
        if (user?.name && user.name !== post.user.name) {
          addFeedNotification(
            post.user.name, // usando nome como id
            'feed-like',
            postId,
            user.name
          );
        }
        return { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked };
      }
      return post;
    }));
  };

  // Função para adicionar novo post
  const handleAddPost = () => {
    if (!newImage || !newCaption) return;
    setPosts([
      {
        id: `post-${Date.now()}`,
        user: { name: user?.name || 'Você', photo: user?.photo || '' },
        image: newImage,
        caption: newCaption,
        likes: 0,
        liked: false,
        comments: []
      },
      ...posts
    ]);
    setNewCaption('');
    setNewImage(null);
  };

  // Função para adicionar comentário
  const handleAddComment = (postId: string, text: string) => {
    setPosts(posts => posts.map(post => {
      if (post.id === postId) {
        // Notifica o dono do post se não for o próprio usuário
        if (user?.name && user.name !== post.user.name) {
          addFeedNotification(
            post.user.name, // usando nome como id
            'feed-comment',
            postId,
            user.name
          );
        }
        return { ...post, comments: [...post.comments, { id: `c${Date.now()}`, user: user?.name || 'Você', text }] };
      }
      return post;
    }));
  };

  // Simulação de upload de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setNewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Notificações não lidas do feed
  const unreadFeedNotifications = notifications.filter(n => !n.read && (n.type === 'feed-like' || n.type === 'feed-comment'));

  return (
    <div className="feed-page">
      <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        Feed Pós-Treino
        <span style={{ position: 'relative' }}>
          <Bell size={24} />
          {unreadFeedNotifications.length > 0 && (
            <span style={{
              position: 'absolute',
              top: -6,
              right: -6,
              background: '#00b4d8',
              color: 'white',
              borderRadius: '50%',
              fontSize: '0.85rem',
              fontWeight: 700,
              padding: '2px 7px',
              boxShadow: '0 2px 8px rgba(0,180,216,0.15)'
            }}>
              {unreadFeedNotifications.length}
            </span>
          )}
        </span>
      </h1>
      <div className="feed-new-post">
        <label className="feed-upload-btn">
          <Camera size={24} />
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
          {newImage && <img src={newImage} alt="preview" className="feed-preview" />}
        </label>
        <input
          type="text"
          placeholder="Escreva uma legenda..."
          value={newCaption}
          onChange={e => setNewCaption(e.target.value)}
          className="feed-caption-input"
        />
        <button className="feed-post-btn" onClick={handleAddPost} disabled={!newImage || !newCaption}>
          Postar
        </button>
      </div>
      <div className="feed-list">
        {posts.map(post => (
          <div className="feed-card-wrapper" key={post.id}>
            <Card accent="primary">
              <div className="feed-post">
                <div className="feed-post-header">
                  <img src={post.user.photo} alt={post.user.name} className="feed-avatar" />
                  <span className="feed-user-name">{post.user.name}</span>
                </div>
                <img src={post.image} alt="post" className="feed-post-image" />
                <div className="feed-post-caption">{post.caption}</div>
                <div className="feed-post-actions">
                  <button className={`feed-like-btn${post.liked ? ' liked' : ''}`} onClick={() => handleLike(post.id)}>
                    <Heart size={22} /> {post.likes}
                  </button>
                  <span className="feed-comments-count">
                    <MessageCircle size={20} /> {post.comments.length}
                  </span>
                </div>
                <div className="feed-comments">
                  {post.comments.map(c => (
                    <div key={c.id} className="feed-comment">
                      <strong>{c.user}:</strong> {c.text}
                    </div>
                  ))}
                  <FeedCommentInput onSend={text => handleAddComment(post.id, text)} />
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedCommentInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState('');
  return (
    <div className="feed-comment-input">
      <input
        type="text"
        placeholder="Comentar..."
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && text) {
            onSend(text);
            setText('');
          }
        }}
      />
      <button onClick={() => { if (text) { onSend(text); setText(''); } }}>
        Enviar
      </button>
    </div>
  );
}
