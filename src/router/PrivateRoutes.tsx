import 'react-toastify/dist/ReactToastify.css';

import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import AccesoForm from '../phicargo/accesos/formulario';
import AvailabilityRoutes from '../modules/drivers-and-vehicles/routes/AvailabilityRoutes';
import DOReportRoutes from '@/modules/daily-operations-report/routes/DOReportRoutes';
import DashboardsRoutes from '@/modules/dashboards/routes/DashboardRoutes';
import { LoadingPage } from '@/pages/LoadingPage';
import MainMenuPage from '@/pages/MainManuPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { ReportsRoutes } from './ReportsRoutes';
import { ServiceRequestsRoutes } from '@/modules/service-requests/routes/ServiceRequestsRoutes';
import ShiftsRoutes from '../modules/shifts/routes/ShiftsRoutes';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import UsersManagementRoutes from '../modules/users-management/routes/UsersManagementRoutes';

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
const EnvioMasivoViajes = lazy(
  () => import('../phicargo/viajes/envio_masivo/index'),
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
const Estadias = lazy(() => import('../phicargo/estadias/Control'));
const EstadiasInfo = lazy(() => import('../phicargo/estadias/index_estadia'));
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
// const BonosOperadores = lazy(() => import('../phicargo/bonos/BonosIndex'));
const DriverBonusPage = lazy(
  () => import('@/modules/drivers/pages/DriverBonusPage'),
);
const EventosPendientes = lazy(
  () => import('@/phicargo/monitoreo/Eventos_pendientes'),
);
const PersistentDrawer = lazy(() => import('../phicargo/monitoreo/Eventos'));
const CumplimientoEjecutivosViajes = lazy(() => import('../phicargo/reportes/cumplimiento/index_cumplimiento_ejecutivo'));
const CumplimientoEjecutivosManiobras = lazy(() => import('../phicargo/reportes/cumplimiento/index_cumplimiento_ejecutivo_maniobra'));

export const PrivateRoutes = () => {
  return (
    <>
      <Toaster />
      <ToastContainer />
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
          }
        ></Route>

        <Route
          path="/tipos_costos_extras"
          element={
            <Suspense fallback={<LoadingPage />}>
              <TiposCostosExtras />
            </Suspense>
          }
        ></Route>

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
          path="/envio_masivo_viajes"
          element={
            <Suspense fallback={<LoadingPage />}>
              <EnvioMasivoViajes />
            </Suspense>
          }
        />

        <Route
          path="/cumplimiento_estatus_ejecutivos"
          element={
            <Suspense fallback={<LoadingPage />}>
              <CumplimientoEjecutivosViajes />
            </Suspense>
          }
        />

        <Route
          path="/cumplimiento_estatus_ejecutivos_maniobras"
          element={
            <Suspense fallback={<LoadingPage />}>
              <CumplimientoEjecutivosManiobras />
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
          path="/estadias_info"
          element={
            <Suspense fallback={<LoadingPage />}>
              <EstadiasInfo />
            </Suspense>
          }
        />

        <Route
          path="/bonos"
          element={
            <Suspense fallback={<LoadingPage />}>
              <DriverBonusPage />
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
            <Suspense fallback={<LoadingPage />}>
              <PersistentDrawer id_entrega={undefined} onClose={undefined} />
            </Suspense>
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
          }
        />

        <Route
          path="/asignacion"
          element={
            <Suspense fallback={<LoadingPage />}>
              <AsignacionUnidades />
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

        {/* Reporte de Operaciones Diarias (Disponibilidad) */}
        {DOReportRoutes()}

        {/* Solicitudes de Servicio */}
        {ServiceRequestsRoutes()}

        {/* Ruta para manejar rutas no válidas */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

