import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App'
import {NextUIProvider} from '@nextui-org/react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NextUIProvider locale="es-MX">
        <App />
      </NextUIProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  </StrictMode>,
)
