import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './LoginPage.css';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'personal' | 'aluno'>('personal');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    try {
      const newUser = await register({
        name,
        email,
        password,
        type: userType,
        photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      });
      // Auto login after registration
      await login({ email: newUser.email, password });
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="login-page">
      <div className="login-background" />
      
      <div className="login-container">
        <button 
          className="back-button"
          onClick={() => navigate('/login')}
        >
          ← Voltar para Login
        </button>

        <div className="login-logo">
          <div className="logo-icon">4</div>
          <div className="logo-text">personal</div>
        </div>

        <h2 className="login-title">Criar Conta</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <select 
              value={userType} 
              onChange={(e) => setUserType(e.target.value as 'personal' | 'aluno')}
              style={{
                width: '100%',
                padding: '18px 24px',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="personal" style={{ background: '#1a1d29' }}>Personal Trainer</option>
              <option value="aluno" style={{ background: '#1a1d29' }}>Aluno</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nome completo"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Senha (mínimo 6 caracteres)"
              minLength={6}
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="login-submit">
            CADASTRAR
          </button>
        </form>
      </div>
    </div>
  );
}
