import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { AuthUser, LoginRequest, RegisterRequest, UserRole } from '../types';
import { authApi } from '../api/auth';
import { decodeToken, isTokenExpired } from '../utils/jwt';
import { proposalsApi } from '../api/proposals';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('access_token');
    if (stored && !isTokenExpired(stored)) {
      const decoded = decodeToken(stored);
      if (decoded) {
        setToken(stored);
        setUser(decoded);
      }
    } else if (stored) {
      // Token expired – clean up
      localStorage.removeItem('access_token');
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await authApi.login(data);
    const decoded = decodeToken(res.access_token);
    if (!decoded) throw new Error('Invalid token received from server.');
    localStorage.setItem('access_token', res.access_token);
    setToken(res.access_token);
    setUser(decoded);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    await authApi.register(data);
    // Registration does not log in automatically; user must sign in.
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    proposalsApi.clearCache();
    setToken(null);
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (role: UserRole) => user?.role === role,
    [user],
  );

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!user, isLoading, login, register, logout, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
