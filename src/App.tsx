import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHref, useNavigate } from 'react-router-dom';

import { AppRouter } from './router/AppRouter';
import { AuthProvider } from './phicargo/modules/auth/context';
import { NextUIProvider } from '@nextui-org/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

export const App = () => {
  const navigate = useNavigate();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NextUIProvider navigate={navigate} useHref={useHref} locale="es-MX">
          <AppRouter />
        </NextUIProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
};

