import { useHref, useNavigate } from 'react-router-dom';

import { AppRouter } from './router/AppRouter';
import { AuthProvider } from './phicargo/modules/auth/context';
import { HeroUIProvider } from "@heroui/react";
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './utilities';

export const App = () => {
  const navigate = useNavigate();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HeroUIProvider navigate={navigate} useHref={useHref} locale="es-MX">
          <AppRouter />
        </HeroUIProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
};

