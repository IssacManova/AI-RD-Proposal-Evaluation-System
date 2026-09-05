import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

function AuthLoadingSplash() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-white">
      <div className="w-14 h-14 bg-primary-600/20 rounded-2xl flex items-center justify-center border border-primary-500/30 shadow-lg shadow-primary-500/10 animate-pulse">
        <Brain className="w-7 h-7 text-primary-400" />
      </div>
      <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
        <Loader2 className="w-4 h-4 animate-spin text-primary-400" />
        <span>Authenticating...</span>
      </div>
    </div>
  );
}

/** Redirect unauthenticated users to /login */
export function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingSplash />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

import type { UserRole } from '../types';

interface RoleProps extends Props {
  role: UserRole;
  fallback?: string;
}

/** Redirect authenticated users who lack the required role */
export function RoleProtectedRoute({ children, role, fallback = '/' }: RoleProps) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingSplash />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRole(role)) {
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
