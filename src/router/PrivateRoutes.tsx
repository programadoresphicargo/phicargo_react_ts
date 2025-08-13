import 'react-toastify/dist/ReactToastify.css';

import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import AccesoForm from '../phicargo/accesos/formulario';
import AvailabilityRoutes from '../modules/drivers-and-vehicles/routes/AvailabilityRoutes';
import ComplaintsRoutes from '@/modules/complaints/routes/ComplaintsRoutes';
import DOReportRoutes from '@/modules/availability-report/routes/DOReportRoutes';
import DashboardsRoutes from '@/modules/dashboards/routes/DashboardRoutes';
import { LoadingPage } from '@/pages/LoadingPage';
import MainMenuPage from '@/pages/MainManuPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { ReportsRoutes } from './ReportsRoutes';
import { ServiceRequestsRoutes } from '@/modules/service/routes/ServiceRequestsRoutes';
import ShiftsRoutes from '../modules/shifts/routes/ShiftsRoutes';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import UsersManagementRoutes from '../modules/users-management/routes/UsersManagementRoutes';
import IncidentsRoutes from '@/modules/incidents/routes/IncidentsRoutes';

// Lazy load the components
const CartasPorte = lazy(
  () => import('../phicargo/maniobras/tms_waybill/cartas_porte'),
);
const ControlManiobras = lazy(
  () => import('../phicargo/maniobras/control/control'),
);
const Nominas = lazy(() => import('../phicargo/maniobras/pagos/pagos'));
const NominasViejas = lazy(() => import('../phicargo/maniobras/pagos/pagos_viejos'));
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
const PagosEstadiasOperadores = lazy(
  () => import('../phicargo/viajes/estadias_operadores/folios/folios'),
);
const PeriodosPagosEstadiasOperadores = lazy(
  () => import('../phicargo/viajes/estadias_operadores/periodos/periodos'),
);
const Estadias = lazy(() => import('../phicargo/estadias/Control'));
const EstadiasInfo = lazy(() => import('../phicargo/estadias/index_estadia'));
const Accesos = lazy(() => import('../phicargo/accesos/Accesos'));
const SolicitudesEPP = lazy(() => import('../phicargo/almacen/solicitud/index_solicitudes_epp'));
const SolicitudesAmarre = lazy(() => import('../phicargo/almacen/solicitud/index_solicitudes_amarre'));
const Inventario = lazy(() => import('../phicargo/almacen/inventario/index'));
const EntregaMonitoreo = lazy(() => import('../phicargo/monitoreo/monitoreo'));
const CodigosPostales = lazy(() => import('../phicargo/viajes/codigos_postales/index'));
const Geocercas = lazy(() => import('../phicargo/viajes/geocercas/geocerca'));
const ChatBot = lazy(() => import('../phicargo/chat/chat'))

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
const Redireccion = lazy(() => import('../router/TraficoRouter'));
const RGV = lazy(() => import('../phicargo/reportes/cumplimiento_general/viajes/index_cumplimiento'));
const CumplimientoManiobras = lazy(() => import('../phicargo/reportes/cumplimiento_general/maniobras/index_cumplimiento'));
const Celulares = lazy(() => import('../phicargo/inventarioti/celulares/celulares/index'));
const EmpleadosTI = lazy(() => import('../phicargo/inventarioti/celulares/empleados/index'));
const EquipoComputoTI = lazy(() => import('../phicargo/inventarioti/celulares/equipo_computo/index'));
const AsignacionActivos = lazy(() => import('../phicargo/inventarioti/celulares/asignacion/index'));
const Asignaciones = lazy(() => import('../phicargo/inventarioti/celulares/asignacion/asignaciones'));

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
          path="/pagos_estadias_operadores"
          element={
            <Suspense fallback={<LoadingPage />}>
              <PagosEstadiasOperadores></PagosEstadiasOperadores>
            </Suspense>
          }
        ></Route>

        <Route
          path="/periodos_pagos_estadias_operadores"
          element={
            <Suspense fallback={<LoadingPage />}>
              <PeriodosPagosEstadiasOperadores></PeriodosPagosEstadiasOperadores>
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
          path="/nominas_viejas"
          element={
            <Suspense fallback={<LoadingPage />}>
              <NominasViejas></NominasViejas>
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
              <Redireccion></Redireccion>
            </Suspense>
          }
        />

        <Route
          path="/ViajesActivos"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ControlViajesActivos></ControlViajesActivos>
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
          path="/geocercas"
          element={
            <Suspense fallback={<LoadingPage />}>
              <Geocercas></Geocercas>
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
          path="/cumplimiento_estatus_maniobras"
          element={
            <Suspense fallback={<LoadingPage />}>
              <CumplimientoManiobras></CumplimientoManiobras>
            </Suspense>
          }
        />

        <Route
          path="/cumplimiento_estatus_viajes_general"
          element={
            <Suspense fallback={<LoadingPage />}>
              <RGV></RGV>
            </Suspense>
          }
        />

        <Route
          path="/codigos_postales"
          element={
            <Suspense fallback={<LoadingPage />}>
              <CodigosPostales></CodigosPostales>
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
          path="/solicitudes_epp"
          element={
            <Suspense fallback={<LoadingPage />}>
              <SolicitudesEPP></SolicitudesEPP>
            </Suspense>
          }
        />

        <Route
          path="/solicitudes_amarre"
          element={
            <Suspense fallback={<LoadingPage />}>
              <SolicitudesAmarre></SolicitudesAmarre>
            </Suspense>
          }
        />

        <Route
          path="/inventario"
          element={
            <Suspense fallback={<LoadingPage />}>
              <Inventario></Inventario>
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

        <Route
          path="/chatbot"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ChatBot></ChatBot>
            </Suspense>
          }
        />


        <Route
          path="/celulares"
          element={
            <Suspense fallback={<LoadingPage />}>
              <Celulares></Celulares>
            </Suspense>
          }
        />

        <Route
          path="/empleados_ti"
          element={
            <Suspense fallback={<LoadingPage />}>
              <EmpleadosTI></EmpleadosTI>
            </Suspense>
          }
        />

        <Route
          path="/equipo_computo_ti"
          element={
            <Suspense fallback={<LoadingPage />}>
              <EquipoComputoTI></EquipoComputoTI>
            </Suspense>
          }
        />

        <Route
          path="/asignacion_activos"
          element={
            <Suspense fallback={<LoadingPage />}>
              <AsignacionActivos></AsignacionActivos>
            </Suspense>
          }
        />


        <Route
          path="/asignaciones"
          element={
            <Suspense fallback={<LoadingPage />}>
              <Asignaciones></Asignaciones>
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

        {/* Módulo de quejas */}
        {ComplaintsRoutes()}

        {/* Módulo de incidencias */}
        {IncidentsRoutes()}

        {/* Ruta para manejar rutas no válidas */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

