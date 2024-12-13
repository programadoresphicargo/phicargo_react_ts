import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppRouter } from './router/AppRouter';
import { AuthProvider } from './phicargo/modules/auth/context';
import { NextUIProvider } from '@nextui-org/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NextUIProvider locale="es-MX">
          <AppRouter />
        </NextUIProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  </StrictMode>,
);

