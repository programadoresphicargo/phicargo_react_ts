import 'react-toastify/dist/ReactToastify.css';

import { Navigate, Route, Routes } from 'react-router-dom';

import AccesoForm from '../phicargo/accesos/formulario';
import Accesos from '../phicargo/accesos/Accesos';
import AsignacionUnidades from '../phicargo/reportes/asignacion_unidades';
import AvailabilityLayout from '../phicargo/modules/availability/layout/AvailabilityLayout';
import AvailabilityRoutes from '../phicargo/modules/availability/routes/AvailabilityRoutes';
import CartasPorte from '../phicargo/maniobras/tms_waybill/cartas_porte';
import CashflowReportRoutes from '../phicargo/modules/cashflow-report/routes/CashflowReportRoutes';
import ControlEstatusOperativos from '../phicargo/control_estatus/ControlEstatusOperativos';
import ControlManiobras from '../phicargo/maniobras/control/control';
import ControlOperadores from '../phicargo/operadores/ControlUsuarios';
import ControlViajesActivos from '../phicargo/viajes/control';
import ControlViajesFinalizados from '../phicargo/viajes/finalizados';
import ControlViajesProgramados from '../phicargo/viajes/programacion';
import CorreosElectronicos from '../phicargo/correos_electronicos/correos_electronicos';
import DetencionesTable from '../phicargo/reportes/llegadas_tarde/llegadas_tarde';
import EntregaMonitoreo from '../phicargo/monitoreo/monitoreo';
import MaintenanceReportRoutes from '../phicargo/modules/maintenance/routes/MaintenanceReportRoutes';
import Menu from '../phicargo/menu/menu';
import Nominas from '../phicargo/maniobras/pagos/pagos';
import PersistentDrawer from '../phicargo/monitoreo/Eventos';
import Precios_maniobras from '../phicargo/maniobras/precios/precios';
import ProtectedRoute from './ProtectedRoute';
import ReporteCumplimiento from '../phicargo/reportes/cumplimiento';
import ReportsMenuPage from '../phicargo/modules/core/pages/ReportsMenuPage';
import ShiftsLayout from '../phicargo/modules/shifts/layouts/ShiftsLayout';
import ShiftsRoutes from '../phicargo/modules/shifts/routes/ShiftsRoutes';
import Terminales from '../phicargo/maniobras/maniobras/terminales/registros';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import UsersManagementLayout from '../phicargo/modules/users-management/layouts/UsersManagementLayout';
import UsersManagementRoutes from '../phicargo/modules/users-management/routes/UsersManagementRoutes';
import { useEffect } from 'react';

const PERMISSIONS = {
  'Módulo trafico': 1,
  'Módulo ajustes': 2,
  'Módulo bonos': 3,
  'Módulo reportes': 4,
  'Módulo usuarios': 5,
  'Módulo operadores': 7,
  'Modulo turnos': 8,
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
  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch('/phicargo/login/inicio/check_session.php');
      const data = await response.json();
      if (data.status !== 'success') {
        window.location.href =
          'https://phides.phicargo-sistemas.online/phicargo/login/inicio/index.php';
      }
    };

    checkSession();
    const intervalId = setInterval(checkSession, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Toaster></Toaster>
      <ToastContainer></ToastContainer>
      <Routes>
        {/* Ruta predeterminada */}
        <Route path="/" element={<Navigate to="/menu" />} />

        <Route path="/menu" element={<Menu />} />

        <Route path="/cartas-porte" element={<CartasPorte />} />
        <Route path="/control_maniobras" element={<ControlManiobras />} />
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
        <Route path="/controlestatus" element={<ControlEstatusOperativos />} />

        <Route
          path="/CorreosElectronicos"
          element={<CorreosElectronicos estado={undefined} />}
        />

        <Route path="/cumplimiento" element={<ReporteCumplimiento />} />

        <Route path="/Accesos" element={<Accesos />} />
        <Route
          path="/AccesoForm"
          element={<AccesoForm id_acceso={undefined} onClose={undefined} />}
        />
        <Route path="/Monitoreo" element={<EntregaMonitoreo />} />
        <Route
          path="/Monitorista"
          element={
            <PersistentDrawer id_entrega={undefined} onClose={undefined} />
          }
        />

        <Route path="/detenciones" element={<DetencionesTable />} />
        <Route path="/asignacion" element={<AsignacionUnidades />} />

        <Route path="/controloperadores" element={<ControlOperadores />} />

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
          path="/reportes/mantenimiento/*" 
          element={
            <MaintenanceReportRoutes />
          } 
        />
        <Route 
          path="/reportes/balance/*" 
          element={
            <CashflowReportRoutes />
          } 
        />

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
          element={<AvailabilityLayout children={undefined} />}
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

