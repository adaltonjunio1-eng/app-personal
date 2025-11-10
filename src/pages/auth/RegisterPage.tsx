import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    if (!name || !phone || !password || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('Digite um número de telefone válido');
      return;
    }

    try {
      const username = name.toLowerCase().replace(/\s+/g, '');
      const email = `${username}@app.com`;

      const newUser = {
        id: `personal-${Date.now()}`,
        type: 'personal',
        name,
        email,
        phone,
        password,
        photo: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80',
        createdAt: new Date().toISOString()
      };

      const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      
      const userExists = existingUsers.find((u: any) => 
        u.phone === phone || u.email === email
      );

      if (userExists) {
        setError('Já existe uma conta com este telefone');
        return;
      }

      existingUsers.push(newUser);
      localStorage.setItem('registered_users', JSON.stringify(existingUsers));

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
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
          <img src="/images/logo.png" alt="Logo" className="logo-image" />
        </div>

        <h2 className="login-title">Cadastro Personal Trainer</h2>

        {success ? (
          <div className="form-success">
            <p>✅ Conta criada com sucesso!</p>
            <p>Redirecionando para login...</p>
          </div>
        ) : (
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

            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Senha (mínimo 6 caracteres)"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirme sua senha"
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="login-submit">
              CRIAR CONTA
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
