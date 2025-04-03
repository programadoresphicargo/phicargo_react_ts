import { Suspense, lazy } from 'react';

import CashflowReportRoutes from '@/modules/cashflow-report/routes/CashflowReportRoutes';
import { LoadingPage } from '@/pages/LoadingPage';
import MaintenanceReportRoutes from '@/modules/maintenance/routes/MaintenanceReportRoutes';
import ProtectedRoute from './ProtectedRoute';
import ReportsMenuPage from '@/pages/ReportsMenuPage';
import { Route } from 'react-router-dom';

const Saldos = lazy(
  () => import('@/phicargo/saldos_contabilidad/ControlUsuarios'),
);

const VehicleRevenueProjectionPage = lazy(
  () =>
    import('@/modules/vehicles/pages/VehicleRevenueProjectionPage'),
);

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

    {/* Reporte de Cobranza */}
    {CashflowReportRoutes()}

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

