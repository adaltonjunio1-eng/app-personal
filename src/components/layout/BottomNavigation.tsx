import type { ReactNode } from 'react';
import './BottomNavigation.css';

export function BottomNav({ children }: { children: ReactNode }) {
  return <nav className="bottom-nav">{children}</nav>;
}
