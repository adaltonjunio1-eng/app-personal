import './TopBar.css';
import type { ReactNode } from 'react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  leftSlot?: ReactNode;
}

export function TopBar({ title, subtitle, rightSlot, leftSlot }: TopBarProps) {
  return (
    <div className="topbar">
      <div className="topbar__side">{leftSlot}</div>
      <div className="topbar__center">
        <h1>{title}</h1>
        {subtitle && <span>{subtitle}</span>}
      </div>
      <div className="topbar__side topbar__side--right">{rightSlot}</div>
    </div>
  );
}
