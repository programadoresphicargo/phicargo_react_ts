import { Suspense, lazy } from 'react';
import CashflowReportRoutes from '@/modules/cashflow-report/routes/CashflowReportRoutes';
import { LoadingPage } from '@/pages/LoadingPage';
import MaintenanceReportRoutes from '@/modules/maintenance/routes/MaintenanceReportRoutes';
import ProtectedRoute from './ProtectedRoute';
import ReportsMenuPage from '@/pages/ReportsMenuPage';
import { Route } from 'react-router-dom';
import MaintenanceReportRoutesRemolques from '@/modules/maintenance/routes/MaintenanceReportRoutes copy';

const ReporteLicenciasVencidas = lazy(() => import('../phicargo/reportes/licencias'));
const ReporteAptosMedicos = lazy(() => import('../phicargo/reportes/aptos_medicos'));
const Saldos = lazy(() => import('@/phicargo/saldos_contabilidad/ControlUsuarios'));
const VehicleRevenueProjectionPage = lazy(() => import('@/modules/vehicles/pages/VehicleRevenueProjectionPage'));
const ReporteCumplimiento = lazy(() => import('../phicargo/reportes/cumplimiento'));
const ViajesTipoArmado = lazy(() => import('../phicargo/reportes/tipo_armado'));
const UnidadesVacantes = lazy(() => import('../phicargo/reportes/unidades_vacantes'));

const reportsPermission = 4;

const PROJECTION_PERMISSION = 207;

export const ReportsRoutes = () => (
  <Route path="/reportes">
    <Route
      index
      element={
        <ProtectedRoute
          element={<ReportsMenuPage />}
          requiredPermissionId={reportsPermission}
        />
      }
    />

    {/* Reporte de Mantenimiento */}
    {MaintenanceReportRoutes()}

    {MaintenanceReportRoutesRemolques()}

    {/* Reporte de Cobranza */}
    {CashflowReportRoutes()}

    {/* Reporte de licencias vencidas */}
    <Route
      path="licencias_vencidas"
      element={
        <Suspense fallback={<LoadingPage />}>
          <ReporteLicenciasVencidas></ReporteLicenciasVencidas>
        </Suspense>
      }
    />

    {/* Reporte de aptos medicos */}
    <Route
      path="aptos_medicos"
      element={
        <Suspense fallback={<LoadingPage />}>
          <ReporteAptosMedicos></ReporteAptosMedicos>
        </Suspense>
      }
    />

    {/* Reporte de aptos medicos */}
    <Route
      path="viajes_tipo_armado"
      element={
        <Suspense fallback={<LoadingPage />}>
          <ViajesTipoArmado></ViajesTipoArmado>
        </Suspense>
      }
    />

    <Route
      path="unidades_vacantes"
      element={
        <Suspense fallback={<LoadingPage />}>
          <UnidadesVacantes />
        </Suspense>
      }
    />

    <Route
      path="cumplimiento"
      element={
        <Suspense fallback={<LoadingPage />}>
          <ReporteCumplimiento />
        </Suspense>
      }
    />

    {/* Reporte de Projeccion por unidad */}
    <Route
      path="proyeccion"
      element={
        <ProtectedRoute
          element={
            <Suspense fallback={<LoadingPage />}>
              <VehicleRevenueProjectionPage />
            </Suspense>
          }
          requiredPermissionId={PROJECTION_PERMISSION}
        />
      }
    />

    {/* Reportede de Saldos */}
    <Route
      path="saldos"
      element={
        <Suspense fallback={<LoadingPage />}>
          <Saldos />
        </Suspense>
      }
    />
  </Route>
);

