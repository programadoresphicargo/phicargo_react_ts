import 'react-toastify/dist/ReactToastify.css';
import '../theme.min.css';

import { Navigate, Route, Routes } from 'react-router-dom';

import AccesoForm from '../phicargo/accesos/formulario';
import Accesos from '../phicargo/accesos/Accesos';
import App from '../App';
import AsignacionUnidades from '../phicargo/reportes/asignacion_unidades';
import AvailabilityLayout from '../phicargo/modules/availability/layout/AvailabilityLayout';
import AvailabilityRoutes from '../phicargo/modules/availability/routes/AvailabilityRoutes';
import CartasPorte from '../phicargo/maniobras/tms_waybill/cartas_porte';
import ControlUsuarios from '../phicargo/usuarios/ControlUsuarios';
import ControlViajesActivos from '../phicargo/viajes/control';
import ControlViajesFinalizados from '../phicargo/viajes/finalizados';
import ControlViajesProgramados from '../phicargo/viajes/programacion';
import CorreosElectronicos from '../phicargo/correos_electronicos/correos_electronicos';
import DetencionesTable from '../phicargo/reportes/llegadas_tarde/llegadas_tarde';
import EntregaMonitoreo from '../phicargo/monitoreo/monitoreo';
import Menu from '../phicargo/menu/menu';
import Nominas from '../phicargo/maniobras/pagos/pagos';
import PersistentDrawer from '../phicargo/monitoreo/Eventos';
import Precios_maniobras from '../phicargo/maniobras/precios/precios';
import ReporteCumplimiento from '../phicargo/reportes/cumplimiento';
import ShiftsLayout from '../phicargo/modules/shifts/layouts/ShiftsLayout';
import ShiftsRoutes from '../phicargo/modules/shifts/routes/ShiftsRoutes';
import Terminales from '../phicargo/maniobras/maniobras/terminales/registros';
import { useEffect } from 'react';

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
    <Routes>
      {/* Ruta predeterminada */}
      <Route path="/" element={<Navigate to="/menu" />} />

      <Route path="/menu" element={<Menu />} />

      <Route path="/cartas-porte" element={<CartasPorte />} />
      <Route path="/control_maniobras" element={<App />} />
      <Route path="/nominas" element={<Nominas />} />
      <Route path="/precios" element={<Precios_maniobras />} />
      <Route path="/terminales" element={<Terminales />} />

      <Route path="/Viajes" element={<ControlViajesActivos />} />
      <Route path="/ViajesFinalizados" element={<ControlViajesFinalizados />} />
      <Route path="/ViajesProgramados" element={<ControlViajesProgramados />} />

      <Route path="/CorreosElectronicos" element={<CorreosElectronicos estado={undefined} />} />

      <Route path="/cumplimiento" element={<ReporteCumplimiento />} />

      <Route path="/Accesos" element={<Accesos />} />
      <Route path="/AccesoForm" element={<AccesoForm id_acceso={undefined} onClose={undefined} />} />
      <Route path="/Monitoreo" element={<EntregaMonitoreo />} />
      <Route path="/Monitorista" element={<PersistentDrawer id_entrega={undefined} onClose={undefined} />} />

      <Route path="/detenciones" element={<DetencionesTable />} />
      <Route path="/asignacion" element={<AsignacionUnidades />} />

      <Route path="/usuarios" element={<ControlUsuarios />} />

      <Route path="/disponibilidad" element={<AvailabilityLayout children={undefined} />}>
        {AvailabilityRoutes()}
      </Route>

      <Route path='/turnos' element={<ShiftsLayout children={undefined} />}>
        {ShiftsRoutes()}
      </Route>

      {/* Ruta para manejar rutas no válidas */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

