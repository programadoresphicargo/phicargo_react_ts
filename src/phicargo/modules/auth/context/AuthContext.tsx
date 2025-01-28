import { ReactNode, createContext, useEffect, useState } from 'react';

import type { Session } from '../models';
import odooApi from '../../core/api/odoo-api';
import { useQueryClient } from '@tanstack/react-query';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  session: Session | null;
  authStatus: AuthStatus;
  redirectTo: string;

  setAuthStatus: (authStatus: AuthStatus) => void;
  setSession: (session: Session | null) => void;
  onLogout: () => void;
  setRedirectTo: (redirectTo: string) => void;
}

interface ProviderProps {
  children: ReactNode;
}

const initialAuthState: AuthState = {
  session: null,
  authStatus: 'unauthenticated',
  redirectTo: '/',
  setSession: () => {},
  setAuthStatus: () => {},
  onLogout: () => {},
  setRedirectTo: () => {},
};

const AuthContext = createContext<AuthState>(initialAuthState);

/**
 * Provider for AuthContext
 * @param Object with children property
 */
export const AuthProvider = ({ children }: ProviderProps) => {
  const queryClient = useQueryClient();

  const [session, setSession] = useState<Session | null>(
    JSON.parse(sessionStorage.getItem('session') || 'null'),
  );
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const [redirectTo, setRedirectTo] = useState('/');

  const onLogout = () => {
    setSession(null);
    sessionStorage.removeItem('session');
    setAuthStatus('unauthenticated');
    delete odooApi.defaults.headers.common['Authorization'];
    queryClient.clear();
    setRedirectTo('/');
  };

  useEffect(() => {
    if (session) {
      setAuthStatus('authenticated');
    } else {
      setAuthStatus('unauthenticated');
    }
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        session,
        setSession,
        authStatus,
        setAuthStatus,
        onLogout,
        redirectTo,
        setRedirectTo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

