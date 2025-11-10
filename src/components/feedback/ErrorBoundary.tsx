import { Component, type ReactNode } from 'react';
import type { ErrorInfo } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Erro capturado pelo ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', gap: '16px', background: '#0f0f16', color: '#fff', padding: '24px'
        }}>
          <h2 style={{ margin: 0 }}>Ops! Ocorreu um erro.</h2>
          <p style={{ maxWidth: 480, textAlign: 'center', opacity: 0.8 }}>
            A interface encontrou um problema inesperado e foi interrompida. Você pode tentar recarregar
            a página ou limpar o cache local.
          </p>
          {this.state.error && (
            <pre style={{
              background: '#1e1e28', padding: '12px', borderRadius: '8px', maxWidth: '600px', overflow: 'auto',
              fontSize: '0.75rem', lineHeight: 1.4
            }}>
{this.state.error.message}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg,#f093fb,#f5576c)', border: 'none', color: '#fff',
              padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
            }}
          >Recarregar</button>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{
              background: 'transparent', border: '1px solid #444', color: '#aaa', padding: '8px 18px',
              borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem'
            }}
          >Limpar cache e recarregar</button>
        </div>
      );
    }
    return this.props.children;
  }
}
