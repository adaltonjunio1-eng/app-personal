import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthCredentials, LoginResponse, User } from '../types';
import * as api from '../services/mockApi';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  register: (payload: Omit<User, 'id' | 'createdAt' | 'password'> & { password: string }) => Promise<User>;
  setUser: (user: User) => void;
}

const STORAGE_KEY = 'fitness-auth';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as LoginResponse;
        setUser(parsed.user);
        setToken(parsed.token);
      } catch (error) {
        console.error('Erro ao restaurar sessão', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: AuthCredentials): Promise<void> => {
    setLoading(true);
    try {
      const response = await api.login(credentials);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const register = async (
    payload: Omit<User, 'id' | 'createdAt' | 'password'> & { password: string },
  ): Promise<User> => {
    const newUser = await api.register({ ...payload });
    return newUser;
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, loading, login, logout, register, setUser }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
