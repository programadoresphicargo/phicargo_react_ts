import CashflowReportRoutes from '@/phicargo/modules/cashflow-report/routes/CashflowReportRoutes';
import DOReportRoutes from '@/phicargo/modules/daily-operations-report/routes/DOReportRoutes';
import MaintenanceReportRoutes from '@/phicargo/modules/maintenance/routes/MaintenanceReportRoutes';
import ProtectedRoute from './ProtectedRoute';
import ReportsMenuPage from '@/phicargo/modules/core/pages/ReportsMenuPage';
import { Route } from 'react-router-dom';
import Saldos from '@/phicargo/saldos_contabilidad/ControlUsuarios';

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

    {/* Reporte de Operaciones Diarias */}
    {DOReportRoutes()}

    {/* Reportede de Saldos */}
    <Route path="saldos" element={<Saldos />} />
  </Route>
);

