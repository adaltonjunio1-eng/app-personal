import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export function RecoverPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // Mock: simular envio de email
    setSent(true);
    setTimeout(() => {
      navigate('/login');
    }, 3000);
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

        <h2 className="login-title">Recuperar Senha</h2>

        {!sent ? (
          <>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              textAlign: 'center', 
              marginBottom: '24px',
              fontSize: '0.95rem'
            }}>
              Informe seu email para receber instruções de redefinição
            </p>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Digite seu email"
                />
              </div>

              <button type="submit" className="login-submit">
                ENVIAR INSTRUÇÕES
              </button>
            </form>
          </>
        ) : (
          <div className="form-success">
            <p style={{ fontSize: '1.1rem', marginBottom: '12px' }}>✉️ Email Enviado!</p>
            <p>
              Instruções enviadas para <strong>{email}</strong>.
              <br />
              Verifique sua caixa de entrada.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
