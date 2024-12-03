import 'react-toastify/dist/ReactToastify.css';
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
} from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import AccesoForm from './phicargo/accesos/formulario';
import Accesos from './phicargo/accesos/Accesos';
import App from './phicargo/maniobras/control/control';
import AsignacionUnidades from './phicargo/reportes/asignacion_unidades';
import AvailabilityLayout from './phicargo/modules/availability/layout/AvailabilityLayout';
import CartasPorte from './phicargo/maniobras/tms_waybill/cartas_porte';
import ControlUsuarios from './phicargo/usuarios/ControlUsuarios';
import ControlViajesActivos from './phicargo/viajes/control';
import ControlViajesFinalizados from './phicargo/viajes/finalizados';
import ControlViajesProgramados from './phicargo/viajes/programacion';
import CorreosElectronicos from './phicargo/correos_electronicos/correos_electronicos';
import DetencionesTable from './phicargo/reportes/llegadas_tarde/llegadas_tarde';
import EntregaMonitoreo from './phicargo/monitoreo/monitoreo';
import { LoadingPage } from './phicargo/modules/core/pages/LoadingPage';
import LoginPage from './phicargo/modules/auth/pages/LoginPage';
import Menu from './phicargo/menu/menu';
import Nominas from './phicargo/maniobras/pagos/pagos';
import PersistentDrawer from './phicargo/monitoreo/Eventos';
import Precios_maniobras from './phicargo/maniobras/precios/precios';
import ReporteCumplimiento from './phicargo/reportes/cumplimiento';
import Terminales from './phicargo/maniobras/maniobras/terminales/registros';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import ControlEstatusOperativos from './phicargo/control_estatus/ControlEstatusOperativos';

// Lazy loading pages
// Availability Pages and Outlets
const VehicleAvailabilityPage = lazy(() => import('./phicargo/modules/availability/pages/VehicleAvailabilityPage'));
const VehicleInfo = lazy(() => import('./phicargo/modules/availability/outlets/VehicleInfo'));
const DriverAvailabilityPage = lazy(() => import('./phicargo/modules/availability/pages/DriverAvailabilityPage'));
const DriverInfo = lazy(() => import('./phicargo/modules/availability/outlets/DriverInfo'));
const NotAssignedPage = lazy(() => import('./phicargo/modules/availability/pages/NotAssignedPage'));
const SummaryPage = lazy(() => import('./phicargo/modules/availability/pages/SummaryPage'));


const AppRouter = () => {

  // const [messages, setMessages] = useState([]);

  // useEffect(() => {
  //   const socket = new WebSocket('ws://localhost:8082/ws');

  //   socket.onmessage = (event) => {
  //     toast.success('Mensaje recibido: ' + event.data);

  //     const utterance = new SpeechSynthesisUtterance(event.data);
  //     const voices = speechSynthesis.getVoices();

  //     const maleVoice = voices.find((voice) =>
  //       voice.name.toLowerCase().includes('male'),
  //     );

  //     if (maleVoice) {
  //       utterance.voice = maleVoice;
  //     }

  //     speechSynthesis.speak(utterance);
  //   };

  //   return () => socket.close();
  // }, []);

  return (
    <div>
      <Toaster />
      <ToastContainer />
      <Router>
        <Routes>
          {/* Auth routes */}


          {/* Ruta predeterminada */}

          <Route path="/menu" element={<Menu />} />

          <Route path="/" element={<Navigate to="/cartas-porte" />} />
          <Route path="/cartas-porte" element={<CartasPorte />} />
          <Route path="/control_maniobras" element={<App />} />
          <Route path="/nominas" element={<Nominas />} />
          <Route path="/precios" element={<Precios_maniobras />} />
          <Route path="/terminales" element={<Terminales />} />

          <Route path="/Viajes" element={<ControlViajesActivos />} />
          <Route
            path="/ViajesFinalizados"
            element={<ControlViajesFinalizados />}
          />
          <Route
            path="/ViajesProgramados"
            element={<ControlViajesProgramados />}
          />
          <Route
            path="/controlestatus"
            element={<ControlEstatusOperativos />}
          />

          <Route
            path="/CorreosElectronicos"
            element={<CorreosElectronicos />}
          />

          <Route path="/cumplimiento" element={<ReporteCumplimiento />} />

          <Route path="/Accesos" element={<Accesos />} />
          <Route path="/AccesoForm" element={<AccesoForm />} />
          <Route path="/Monitoreo" element={<EntregaMonitoreo />} />
          <Route path="/Monitorista" element={<PersistentDrawer />} />

          <Route path="/detenciones" element={<DetencionesTable />} />
          <Route path="/asignacion" element={<AsignacionUnidades />} />

          <Route path="/usuarios" element={<ControlUsuarios />} />

          <Route path="/disponibilidad" element={<AvailabilityLayout />}>
            <Route
              index
              element={<Navigate to="/disponibilidad/unidades" replace />}
            />
            <Route
              path="unidades"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <VehicleAvailabilityPage />
                </Suspense>
              }
            >
              <Route
                path='detalles/:id'
                element={
                  <Suspense fallback={<LoadingPage />}>
                    <VehicleInfo />
                  </Suspense>
                }
              />
            </Route>
            <Route
              path="operadores"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <DriverAvailabilityPage />
                </Suspense>
              }
            >
              <Route
                path='detalles/:id'
                element={
                  <Suspense fallback={<LoadingPage />}>
                    <DriverInfo />
                  </Suspense>
                }
              />
            </Route>
            <Route
              path='resumen'
              element={
                <Suspense fallback={<LoadingPage />}>
                  <SummaryPage />
                </Suspense>
              }
            />
            <Route
              path='sin-asignar'
              element={
                <Suspense fallback={<LoadingPage />}>
                  <NotAssignedPage />
                </Suspense>
              }
            />
          </Route>

          {/* Ruta para manejar rutas no válidas */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default AppRouter;

