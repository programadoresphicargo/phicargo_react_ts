
import './index.css';

import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter';
import toast from 'react-hot-toast';

// ==========================================
// DETECTAR ERRORES DE CARGA DE VITE
// ==========================================

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();

  const reloadKey = 'vite-preload-reload';

  // Evitar recargas infinitas
  if (!sessionStorage.getItem(reloadKey)) {
    toast.success("Recargando")
    sessionStorage.setItem(reloadKey, 'true');

    window.location.reload();
  } else {
    console.error(
      'No fue posible cargar el módulo después de actualizar la aplicación.'
    );
  }
});

// ==========================================
// INICIALIZAR REACT
// ==========================================

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
