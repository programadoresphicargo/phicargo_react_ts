import 'react-toastify/dist/ReactToastify.css';

import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import AccesoForm from '../phicargo/accesos/formulario';
import AvailabilityRoutes from '../phicargo/modules/availability/routes/AvailabilityRoutes';
import DashboardsRoutes from '@/phicargo/modules/dashboards/routes/DashboardRoutes';
import EventosPendientes from '@/phicargo/monitoreo/Eventos_pendientes';
import { LoadingPage } from '../phicargo/modules/core/pages/LoadingPage';
import MainMenuPage from '@/phicargo/menu/MainManuPage';
import NotFoundPage from '@/phicargo/modules/core/pages/NotFoundPage';
import PersistentDrawer from '../phicargo/monitoreo/Eventos';
import { ReportsRoutes } from './ReportsRoutes';
import { ServiceRequestsRoutes } from '@/phicargo/modules/service-requests/routes/ServiceRequestsRoutes';
import ShiftsRoutes from '../phicargo/modules/shifts/routes/ShiftsRoutes';
import { ToastContainer } from 'react-toastify';
import { ToastProvider } from "@heroui/toast";
import { Toaster } from 'react-hot-toast';
import UsersManagementRoutes from '../phicargo/modules/users-management/routes/UsersManagementRoutes';

// Lazy load the components
const CartasPorte = lazy(
  () => import('../phicargo/maniobras/tms_waybill/cartas_porte'),
);
const ControlManiobras = lazy(
  () => import('../phicargo/maniobras/control/control'),
);
const Nominas = lazy(() => import('../phicargo/maniobras/pagos/pagos'));
const PreciosManiobras = lazy(
  () => import('../phicargo/maniobras/precios/precios'),
);
const Terminales = lazy(
  () => import('../phicargo/maniobras/maniobras/terminales/registros'),
);
const ControlViajesActivos = lazy(() => import('../phicargo/viajes/control'));
const ControlViajesProgramados = lazy(
  () => import('../phicargo/viajes/programacion'),
);
const ControlViajesFinalizados = lazy(
  () => import('../phicargo/viajes/finalizados'),
);
const ControlEstatusOperativos = lazy(
  () => import('../phicargo/control_estatus/ControlEstatusOperativos'),
);
const CorreosElectronicos = lazy(
  () => import('../phicargo/correos_electronicos/correos_electronicos'),
);
const ReporteCumplimiento = lazy(
  () => import('../phicargo/reportes/cumplimiento'),
);
const FoliosCostosExtras = lazy(
  () => import('../phicargo/costos/folios/control'),
);
const TiposCostosExtras = lazy(
  () => import('../phicargo/costos/tipos_costos_extras/costos_extras'),
);
const Estadias = lazy(
  () => import('../phicargo/estadias/Control')
);
const Accesos = lazy(() => import('../phicargo/accesos/Accesos'));
const EntregaMonitoreo = lazy(() => import('../phicargo/monitoreo/monitoreo'));

const DetencionesTable = lazy(
  () => import('../phicargo/reportes/llegadas_tarde/llegadas_tarde'),
);
const ReporteDetencionesViajes = lazy(
  () => import('../phicargo/viajes/detenciones/reporte_detenciones_viajes'),
);
const AsignacionUnidades = lazy(
  () => import('../phicargo/reportes/asignacion_unidades'),
);
const ControlOperadores = lazy(
  () => import('../phicargo/operadores/ControlUsuarios'),
);
const BonosOperadores = lazy(
  () => import('../phicargo/bonos/BonosIndex'),
);

export const PrivateRoutes = () => {
  return (
    <>
      <Toaster />
      <ToastContainer />
      <ToastProvider></ToastProvider>
      <Routes>
        {/* Menú */}
        <Route path="/" element={<Navigate to="/menu" />} />
        <Route path="/menu" element={<MainMenuPage />} />

        <Route
          path="/folios_costos_extras"
          element={
            <Suspense fallback={<LoadingPage />}>
              <FoliosCostosExtras />
            </Suspense>
          }>
        </Route>

        <Route
          path="/tipos_costos_extras"
          element={
            <Suspense fallback={<LoadingPage />}>
              <TiposCostosExtras />
            </Suspense>
          }>
        </Route>

        <Route
          path="/cartas-porte"
          element={
            <Suspense fallback={<LoadingPage />}>
              <CartasPorte />
            </Suspense>
          }
        />
        <Route
          path="/control_maniobras"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ControlManiobras />
            </Suspense>
          }
        />
        <Route
          path="/nominas"
          element={
            <Suspense fallback={<LoadingPage />}>
              <Nominas />
            </Suspense>
          }
        />
        <Route
          path="/precios"
          element={
            <Suspense fallback={<LoadingPage />}>
              <PreciosManiobras />
            </Suspense>
          }
        />
        <Route
          path="/terminales"
          element={
            <Suspense fallback={<LoadingPage />}>
              <Terminales />
            </Suspense>
          }
        />

        <Route
          path="/Viajes"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ControlViajesActivos />
            </Suspense>
          }
        />
        <Route
          path="/ViajesFinalizados"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ControlViajesFinalizados />
            </Suspense>
          }
        />
        <Route
          path="/ViajesProgramados"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ControlViajesProgramados />
            </Suspense>
          }
        />
        <Route
          path="/controlestatus"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ControlEstatusOperativos />
            </Suspense>
          }
        />

        <Route
          path="/CorreosElectronicos"
          element={
            <Suspense fallback={<LoadingPage />}>
              <CorreosElectronicos estado={undefined} />
            </Suspense>
          }
        />

        <Route
          path="/cumplimiento"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ReporteCumplimiento />
            </Suspense>
          }
        />

        <Route
          path="/estadias"
          element={
            <Suspense fallback={<LoadingPage />}>
              <Estadias />
            </Suspense>
          }
        />

        <Route
          path="/bonos"
          element={
            <Suspense fallback={<LoadingPage />}>
              <BonosOperadores></BonosOperadores>
            </Suspense>
          }
        />


        <Route
          path="/Accesos"
          element={
            <Suspense fallback={<LoadingPage />}>
              <Accesos />
            </Suspense>
          }
        />
        <Route
          path="/AccesoForm"
          element={<AccesoForm id_acceso={undefined} onClose={undefined} />}
        />
        <Route
          path="/Monitoreo"
          element={
            <Suspense fallback={<LoadingPage />}>
              <EntregaMonitoreo />
            </Suspense>
          }
        />
        <Route
          path="/EventosPendientes"
          element={
            <Suspense fallback={<LoadingPage />}>
              <EventosPendientes />
            </Suspense>
          }
        />
        <Route
          path="/Monitorista"
          element={
            <PersistentDrawer id_entrega={undefined} onClose={undefined} />
          }
        />

        <Route
          path="/detenciones"
          element={
            <Suspense fallback={<LoadingPage />}>
              <DetencionesTable />
            </Suspense>
          }
        />

        <Route
          path="/reporte_detenciones"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ReporteDetencionesViajes />
            </Suspense>
          } />

        <Route
          path="/asignacion"
          element={
            <Suspense fallback={<LoadingPage />}>
              <AsignacionUnidades />
            </Suspense>
          }
        />

        <Route
          path="/controloperadores"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ControlOperadores />
            </Suspense>
          }
        />

        {/* Modulo de reportes */}
        {ReportsRoutes()}

        {/* Dashboards */}
        {DashboardsRoutes()}

        {/* Módulo de turnos */}
        {UsersManagementRoutes()}

        {/* Módulo de disponibilidad */}
        {AvailabilityRoutes()}

        {/* Módulo de turnos */}
        {ShiftsRoutes()}

        {/* Solicitudes de Servicio */}
        {ServiceRequestsRoutes()}

        {/* Ruta para manejar rutas no válidas */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

