import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userType, setUserType] = useState<'aluno' | 'personal' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const handleUserTypeSelect = (type: 'aluno' | 'personal') => {
    setUserType(type);
    // Pre-fill credentials for testing
    if (type === 'aluno') {
      setEmail('lucas@alunos.com');
      setPassword('123456');
    } else {
      setEmail('mariana@fitpro.com');
      setPassword('123456');
    }
  };

  if (!userType) {
    return (
      <div className="login-page">
        <div className="login-background" />
        
        <div className="login-container">
          <div className="login-logo">
            <div className="logo-icon">4</div>
            <div className="logo-text">personal</div>
          </div>

          <div className="login-buttons">
            <button 
              className="user-type-button"
              onClick={() => handleUserTypeSelect('aluno')}
            >
              ALUNO
            </button>
            <button 
              className="user-type-button user-type-button--primary"
              onClick={() => handleUserTypeSelect('personal')}
            >
              PERSONAL TRAINER
            </button>
          </div>

          <button 
            className="register-link"
            onClick={() => navigate('/cadastro')}
          >
            PERSONAL TRAINER? CADASTRE-SE AQUI
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-background" />
      
      <div className="login-container">
        <button 
          className="back-button"
          onClick={() => setUserType(null)}
        >
          ← Voltar
        </button>

        <div className="login-logo">
          <div className="logo-icon">4</div>
          <div className="logo-text">personal</div>
        </div>

        <h2 className="login-title">
          {userType === 'aluno' ? 'Login Aluno' : 'Login Personal Trainer'}
        </h2>

        <form className="login-form" onSubmit={handleSubmit}>
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
              placeholder="Senha"
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="login-submit">
            ENTRAR
          </button>
        </form>

        <button 
          className="forgot-password"
          onClick={() => navigate('/recuperar-senha')}
        >
          Esqueceu a senha?
        </button>
      </div>
    </div>
  );
}
