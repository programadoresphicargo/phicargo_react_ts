import { Suspense, lazy } from 'react';

import CashflowReportRoutes from '@/phicargo/modules/cashflow-report/routes/CashflowReportRoutes';
import { LoadingPage } from '@/phicargo/modules/core/pages/LoadingPage';
import MaintenanceReportRoutes from '@/phicargo/modules/maintenance/routes/MaintenanceReportRoutes';
import ProtectedRoute from './ProtectedRoute';
import ReportsMenuPage from '@/phicargo/modules/core/pages/ReportsMenuPage';
import { Route } from 'react-router-dom';

const Saldos = lazy(
  () => import('@/phicargo/saldos_contabilidad/ControlUsuarios'),
);

const reportsPermission = 4;

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

