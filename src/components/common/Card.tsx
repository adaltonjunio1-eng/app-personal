import type { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  children: ReactNode;
  accent?: 'primary' | 'secondary' | 'neutral';
  interactive?: boolean;
  onClick?: () => void;
}

export function Card({ children, accent = 'neutral', interactive = false, onClick }: CardProps) {
  return (
    <div
      className={`card card--${accent} ${interactive ? 'card--interactive' : ''}`.trim()}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!interactive) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      {children}
    </div>
  );
}
