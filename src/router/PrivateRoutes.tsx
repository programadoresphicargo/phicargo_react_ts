import 'react-toastify/dist/ReactToastify.css';

import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import AccesoForm from '../phicargo/accesos/formulario';
import AvailabilityLayout from '../phicargo/modules/availability/layout/AvailabilityLayout';
import AvailabilityRoutes from '../phicargo/modules/availability/routes/AvailabilityRoutes';
import CashflowReportRoutes from '../phicargo/modules/cashflow-report/routes/CashflowReportRoutes';
import { LoadingPage } from '../phicargo/modules/core/pages/LoadingPage';
import MainMenuPage from '@/phicargo/menu/MainManuPage';
import MaintenanceReportRoutes from '../phicargo/modules/maintenance/routes/MaintenanceReportRoutes';
import PersistentDrawer from '../phicargo/monitoreo/Eventos';
import ProtectedRoute from './ProtectedRoute';
import ReportsMenuPage from '../phicargo/modules/core/pages/ReportsMenuPage';
import ShiftsLayout from '../phicargo/modules/shifts/layouts/ShiftsLayout';
import ShiftsRoutes from '../phicargo/modules/shifts/routes/ShiftsRoutes';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import UsersManagementLayout from '../phicargo/modules/users-management/layouts/UsersManagementLayout';
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
const Accesos = lazy(() => import('../phicargo/accesos/Accesos'));
const EntregaMonitoreo = lazy(() => import('../phicargo/monitoreo/monitoreo'));

const DetencionesTable = lazy(
  () => import('../phicargo/reportes/llegadas_tarde/llegadas_tarde'),
);
const AsignacionUnidades = lazy(
  () => import('../phicargo/reportes/asignacion_unidades'),
);
const ControlOperadores = lazy(
  () => import('../phicargo/operadores/ControlUsuarios'),
);

const PERMISSIONS = {
  'Módulo trafico': 1,
  'Módulo ajustes': 2,
  'Módulo bonos': 3,
  'Módulo reportes': 4,
  'Módulo usuarios': 5,
  'Módulo operadores': 7,
  'Modulo turnos': 8,
  'Modulo disponibilidad': 200,
  'Ingresar incidencia asesor legal': 9,
  'Ingresar incidencia mantenimiento': 10,
  'Ingresar incidencia th': 11,
  'Ingresar incidencia operaciones': 12,
  'Ingresar incidencia calidad': 13,
  'modulo maniobras': 38,
  'modulo comunicados': 39,
  'modulo monitoreo': 40,
  'cuentas operadores': 41,
  viajes: 101,
  finalizados: 102,
  'banco de correos': 103,
  detenciones: 104,
  'pestañas viajes': 105,
  retorno: 106,
  'modulo informe': 120,
  'informe empresa phicargo': 121,
  'informe empresa servicontainer': 122,
  'informe empresa tankcontainer': 123,
  'informe empresa ometra': 124,
  'informe empresa transportes belchez': 125,
  'modulo accesos': 126,
  'modulo ti': 127,
  'reporte gerencial': 190,
  'reporte ingresos': 191,
  'numero de viajes': 192,
  'inicios de ruta y llegada a planta': 193,
  estadias: 195,
  'cumplimiento estatus': 196,
};

export const PrivateRoutes = () => {

  return (
    <>
      <Toaster></Toaster>
      <ToastContainer></ToastContainer>
      <Routes>
        {/* Ruta predeterminada */}
        <Route path="/" element={<Navigate to="/menu" />} />

        <Route path="/menu" element={<MainMenuPage />} />

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

        <Route
          path="/reportes"
          element={
            <ProtectedRoute
              element={<ReportsMenuPage />}
              requiredPermissionId={PERMISSIONS['Módulo reportes']}
            />
          }
        />
        <Route
          path="/reportes/mantenimiento/"
          element={<MaintenanceReportRoutes />}
        />
        <Route path="/reportes/balance/*" element={<CashflowReportRoutes />} />

        <Route
          path="/control-usuarios"
          element={
            <ProtectedRoute
              element={<UsersManagementLayout children={undefined} />}
              requiredPermissionId={PERMISSIONS['Módulo usuarios']}
            />
          }
        >
          {UsersManagementRoutes()}
        </Route>

        <Route
          path="/disponibilidad"
          element={
            <ProtectedRoute 
              element={<AvailabilityLayout children={undefined} />}
              requiredPermissionId={PERMISSIONS['Modulo disponibilidad']}
            />
          }
        >
          {AvailabilityRoutes()}
        </Route>

        <Route path="/turnos" element={<ShiftsLayout children={undefined} />}>
          {ShiftsRoutes()}
        </Route>

        {/* Ruta para manejar rutas no válidas */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

