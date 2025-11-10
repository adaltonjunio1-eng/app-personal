import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import './auth.css';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth">
      <div className="auth__panel">
        <header>
          <h1>Fitness Coach</h1>
          <p>Plataforma para conectar personal trainers e alunos</p>
        </header>
        {children}
        <footer>
          <Link to="/login">Entrar</Link>
          <Link to="/cadastro">Criar conta</Link>
          <Link to="/recuperar-senha">Recuperar acesso</Link>
        </footer>
      </div>
      <aside className="auth__aside">
        <div>
          <h2>Resultados reais exigem acompanhamento inteligente</h2>
          <p>
            Gerencie treinos personalizados, acompanhe métricas, envie vídeos e celebre cada evolução
            com seus alunos.
          </p>
        </div>
      </aside>
    </div>
  );
}
