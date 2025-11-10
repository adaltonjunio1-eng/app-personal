import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userType, setUserType] = useState<'aluno' | 'personal' | null>(null);
  const [nameOrPhone, setNameOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    try {
      let email = '';
      let loginPassword = password;

      if (userType === 'aluno') {
        // Aluno: usa nome + telefone para gerar senha automaticamente
        const name = nameOrPhone.split('|')[0] || '';
        const phone = nameOrPhone.split('|')[1] || '';
        
        const username = name.toLowerCase().replace(/\s+/g, '');
        const phoneDigits = phone.replace(/\D/g, '');
        const lastFourDigits = phoneDigits.slice(-4);
        
        email = `${username}@app.com`;
        loginPassword = `${username}${lastFourDigits}`;
      } else {
        // Personal: usa nome ou telefone como identificador + senha própria
        const input = nameOrPhone.toLowerCase().trim();
        
        // Se digitou "matheus franco" ou "mateus franco", usar email específico
        if (input === 'matheus franco' || input === 'mateus franco') {
          email = 'matheusfranco@app.com';
          loginPassword = password;
        } else {
          const phoneDigits = nameOrPhone.replace(/\D/g, '');
          
          // Verificar no localStorage se existe usuário cadastrado
          const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
          const user = registeredUsers.find((u: any) => u.phone.replace(/\D/g, '') === phoneDigits);
          
          if (user) {
            email = user.email;
            loginPassword = password;
          } else {
            // Se não achar no localStorage, usar o sistema antigo
            email = nameOrPhone.includes('@') ? nameOrPhone : `${nameOrPhone.toLowerCase().replace(/\s+/g, '')}@app.com`;
          }
        }
      }
      
      await login({ email, password: loginPassword });
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

          <button 
            className="register-link"
            onClick={() => navigate('/cadastro')}
          >
            Personal? Cadastre-se aqui
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
          <img src="/images/logo.png" alt="Logo" className="logo-image" />
        </div>

        <h2 className="login-title">
          {userType === 'aluno' ? 'Login Aluno' : 'Login Personal Trainer'}
        </h2>

        <form className="login-form" onSubmit={handleSubmit}>
          {userType === 'aluno' ? (
            <>
              <div className="form-group">
                <input
                  type="text"
                  value={nameOrPhone}
                  onChange={(e) => setNameOrPhone(e.target.value)}
                  required
                  placeholder="Nome|Telefone (ex: João Silva|(11)98765-4321)"
                />
                <small style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                  Digite seu nome e telefone separados por | (barra vertical)
                </small>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <input
                  type="text"
                  value={nameOrPhone}
                  onChange={(e) => setNameOrPhone(e.target.value)}
                  required
                  placeholder="Login (Nome ou Telefone)"
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Sua senha"
                />
              </div>
            </>
          )}

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
