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
const Cuentas = lazy(() => import('@/phicargo/saldos_contabilidad/cuenta/cuentas'));
const Saldos = lazy(() => import('@/phicargo/saldos_contabilidad'));
const Flujos = lazy(() => import('@/phicargo/saldos_contabilidad/flujo/index'));
const Conceptos = lazy(() => import('@/phicargo/saldos_contabilidad/conceptos/index'));
const VehicleRevenueProjectionPage = lazy(() => import('@/modules/vehicles/pages/VehicleRevenueProjectionPage'));
const ReporteCumplimiento = lazy(() => import('../phicargo/reportes/cumplimiento'));
const ViajesTipoArmado = lazy(() => import('../phicargo/reportes/tipo_armado'));
const UnidadesVacantes = lazy(() => import('../phicargo/reportes/unidades_vacantes'));
const KMRecorridos = lazy(() => import('../phicargo/reportes/km_recorridos/index'));
const ServiciosCategoria = lazy(() => import('../phicargo/reportes/categoria'));
const UnidadesTaller = lazy(() => import('../phicargo/reportes/unidades_taller'));
const DisponibilidadDiariaFlota = lazy(() => import('../phicargo/reportes/disponibilidad_diaria_flota'));
const DisponibilidadDiariaOperador = lazy(() => import('../phicargo/reportes/disponibilidad_diaria_operador'));
const Flota = lazy(() => import('../phicargo/reportes/flota'));
const VehiculosAgrupados = lazy(() => import('../phicargo/reportes/vehiculos_agrupados'));

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

    {/* Reporte de km recorridos */}
    <Route
      path="km_recorridos"
      element={
        <Suspense fallback={<LoadingPage />}>
          <KMRecorridos />
        </Suspense>
      }
    />

    {/* Reporte de km recorridos */}
    <Route
      path="servicios_categoria"
      element={
        <Suspense fallback={<LoadingPage />}>
          <ServiciosCategoria />
        </Suspense>
      }
    />

    {/* Reporte de km recorridos */}
    <Route
      path="unidades_taller"
      element={
        <Suspense fallback={<LoadingPage />}>
          <UnidadesTaller></UnidadesTaller>
        </Suspense>
      }
    />

    {/* Reporte disponibilidad flota */}
    <Route
      path="disponibilidad_diaria_flota"
      element={
        <Suspense fallback={<LoadingPage />}>
          <DisponibilidadDiariaFlota></DisponibilidadDiariaFlota>
        </Suspense>
      }
    />

    {/* Reporte disponibilidad operador*/}
    <Route
      path="disponibilidad_diaria_operadores"
      element={
        <Suspense fallback={<LoadingPage />}>
          <DisponibilidadDiariaOperador></DisponibilidadDiariaOperador>
        </Suspense>
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

    {/* Flota */}
    <Route
      path="flota"
      element={
        <Suspense fallback={<LoadingPage />}>
          <Flota />
        </Suspense>
      }
    />

    <Route
      path="vehiculos_agrupados"
      element={
        <Suspense fallback={<LoadingPage />}>
          <VehiculosAgrupados></VehiculosAgrupados>
        </Suspense>
      }
    />

    <Route
      path="flujos"
      element={
        <Suspense fallback={<LoadingPage />}>
          <Flujos></Flujos>
        </Suspense>
      }
    />

    <Route
      path="conceptos"
      element={
        <Suspense fallback={<LoadingPage />}>
          <Conceptos></Conceptos>
        </Suspense>
      }
    />

    <Route
      path="cuentas"
      element={
        <Suspense fallback={<LoadingPage />}>
          <Cuentas></Cuentas>
        </Suspense>
      }
    />
  </Route>

);

