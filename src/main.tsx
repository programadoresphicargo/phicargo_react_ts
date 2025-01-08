import './index.css';

import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { getEnvVariables } from './phicargo/modules/cashflow-report/utils';
import { init as sentryInit } from '@sentry/react';

const { VITE_SENTRY_DNS } = getEnvVariables();

sentryInit({
  dsn: VITE_SENTRY_DNS,
  defaultIntegrations: false,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </BrowserRouter>
  </StrictMode>,
);

