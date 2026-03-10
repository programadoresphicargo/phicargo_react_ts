import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ContenedoresPendientes from '@/phicargo/maniobras/tms_waybill/pendientes';
import UltimosUsosUnidades from '@/phicargo/reportes/ultimos_usos/equipos';
import LicenciasProximasVencer from '@/phicargo/reportes/licencias';
import AptosMedicos from '@/phicargo/reportes/aptos_medicos';
import DailyOperationsPage from '@/modules/availability-report/pages/DailyOperationsPage';
import ViajesTipoArmado from '@/phicargo/reportes/tipo_armado';
import IncidentsPage from '@/modules/incidents/pages/IncidentsPage';
import { IncidentsProvider } from '@/modules/incidents/context/IncidentsContext';
import VehiculosSinOperadorAsignado from '@/phicargo/reportes/vehiculos_sin_operador_asignado';
import IndexKMRecorridos from '@/phicargo/reportes/km_recorridos';

const ReportesCorreos = () => {

  const [value, setValue] = React.useState('1');

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return <Box sx={{ width: '100%' }}>
    <TabContext value={value}>
      <Box sx={{
        background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
        color: 'white',
      }}>
        <TabList
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          textColor="inherit"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'white',
              height: '3px',
            }
          }}>
          <Tab sx={{ fontFamily: 'Inter' }} label="Contenedores" value="1" />
          <Tab sx={{ fontFamily: 'Inter' }} label="Último uso de equipos" value="2" />
          <Tab sx={{ fontFamily: 'Inter' }} label="KM Recorridos" value="3" />
          <Tab sx={{ fontFamily: 'Inter' }} label="Unidades sin operador asignado" value="4" />
          <Tab sx={{ fontFamily: 'Inter' }} label="Licencias próximas a vencer" value="5" />
          <Tab sx={{ fontFamily: 'Inter' }} label="Aptos medicos próximos a vencer" value="6" />
          <Tab sx={{ fontFamily: 'Inter' }} label="Disponibilidad" value="7" />
          <Tab sx={{ fontFamily: 'Inter' }} label="Viajes por tipo de armado" value="8" />
          <Tab sx={{ fontFamily: 'Inter' }} label="Incidencias" value="9" />
        </TabList>
      </Box>
      <TabPanel value="1" sx={{ border: 'none', p: 0 }}><ContenedoresPendientes /></TabPanel>
      <TabPanel value="2" sx={{ border: 'none', p: 0 }}><UltimosUsosUnidades /></TabPanel>
      <TabPanel value="3" sx={{ border: 'none', p: 0 }}><IndexKMRecorridos /></TabPanel>
      <TabPanel value="4" sx={{ border: 'none', p: 0 }}><VehiculosSinOperadorAsignado /></TabPanel>
      <TabPanel value="5" sx={{ border: 'none', p: 0 }}><LicenciasProximasVencer /></TabPanel>
      <TabPanel value="6" sx={{ border: 'none', p: 0 }}><AptosMedicos /></TabPanel>
      <TabPanel value="7" sx={{ border: 'none', p: 0 }}><DailyOperationsPage /></TabPanel>
      <TabPanel value="8" sx={{ border: 'none', p: 0 }}><ViajesTipoArmado /></TabPanel>
      <TabPanel value="9" sx={{ border: 'none', p: 0 }}><IncidentsProvider><IncidentsPage /></IncidentsProvider></TabPanel>
    </TabContext>
  </Box >;
};

export default ReportesCorreos;
