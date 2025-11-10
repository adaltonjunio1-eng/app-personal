import { NavLink, Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import { BottomNav } from './BottomNavigation';
import './MainLayout.css';

export interface NavItem {
  label: string;
  icon: ReactNode;
  to: string;
}

interface MainLayoutProps {
  topbar?: ReactNode;
  navItems: NavItem[];
}

export function MainLayout({ topbar, navItems }: MainLayoutProps) {
  return (
    <div className="layout">
      {topbar && <header className="layout__topbar">{topbar}</header>}
      <main className="layout__content">
        <Outlet />
      </main>
      <BottomNav>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className="layout__navlink">
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </BottomNav>
    </div>
  );
}
