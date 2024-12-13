import { ReactNode, createContext, useEffect, useState } from 'react';

import { Session } from '../models';
import odooApi from '../../core/api/odoo-api';
import { useQueryClient } from '@tanstack/react-query';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  session: Session | null;
  setSession: (session: Session | null) => void;
  authStatus: AuthStatus;
  setAuthStatus: (authStatus: AuthStatus) => void;

  onLogout: () => void;
}

interface ProviderProps {
  children: ReactNode;
}

const initialAuthState: AuthState = {
  session: null,
  authStatus: 'unauthenticated',
  setSession: () => {},
  setAuthStatus: () => {},
  onLogout: () => {},
};

const AuthContext = createContext<AuthState>(initialAuthState);

/**
 * Provider for AuthContext
 * @param Object with children property
 */
export const AuthProvider = ({ children }: ProviderProps) => {
  const queryClient = useQueryClient();

  const [session, setSession] = useState<Session | null>(
    JSON.parse(sessionStorage.getItem('session') || 'null')
  );
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');

  const onLogout = () => {
    setSession(null);
    sessionStorage.removeItem('session');
    setAuthStatus('unauthenticated');
    delete odooApi.defaults.headers.common['Authorization'];
    queryClient.clear();
  }

  useEffect(() => {
    if (session) {
      setAuthStatus('authenticated');
      odooApi.defaults.headers.common['Authorization'] = `Bearer ${session.token.accessToken}`;
    } else {
      setAuthStatus('unauthenticated');
      delete odooApi.defaults.headers.common['Authorization'];
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

