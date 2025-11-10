import './SectionTitle.css';
import type { ReactNode } from 'react';

interface SectionTitleProps {
  title: string;
  action?: ReactNode;
  subtitle?: string;
}

export function SectionTitle({ title, subtitle, action }: SectionTitleProps) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {subtitle && <span>{subtitle}</span>}
      </div>
      {action && <div className="section-title__action">{action}</div>}
    </div>
  );
}
