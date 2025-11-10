import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userType, setUserType] = useState<'aluno' | 'personal' | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    try {
      // Gerar login e senha baseado no nome e telefone
      const username = name.toLowerCase().replace(/\s+/g, '');
      const phoneDigits = phone.replace(/\D/g, '');
      const lastFourDigits = phoneDigits.slice(-4);
      const generatedPassword = `${username}${lastFourDigits}`;
      
      // Usar email fictício para compatibilidade com sistema atual
      const email = `${username}@app.com`;
      
      await login({ email, password: generatedPassword });
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const handleUserTypeSelect = (type: 'aluno' | 'personal') => {
    setUserType(type);
  };

  if (!userType) {
    return (
      <div className="login-page">
        <div className="login-background" />
        
        <div className="login-container">
          <div className="login-logo">
            <img src="/images/logo.png" alt="Logo" className="logo-image" />
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
          <img src="/images/logo.png" alt="Logo" className="logo-image" />
        </div>

        <h2 className="login-title">
          {userType === 'aluno' ? 'Login Aluno' : 'Login Personal Trainer'}
        </h2>

        <form className="login-form" onSubmit={handleSubmit}>
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
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Telefone: (11) 98765-4321"
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
