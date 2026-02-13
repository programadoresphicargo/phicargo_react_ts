import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ContenedoresPendientes from '@/phicargo/maniobras/tms_waybill/pendientes';
import UltimosUsosUnidades from '@/phicargo/reportes/ultimos_usos/equipos';

const ReportesCorreos = () => {

  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return <Box sx={{ width: '100%' }}>
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange}>
          <Tab label="Maniobras" value="1" />
          <Tab label="Ultimo uso de equipos" value="2" />
          <Tab label="Item Three" value="3" />
        </TabList>
      </Box>
      <TabPanel value="1" sx={{ border: 'none', p: 0 }}><ContenedoresPendientes /></TabPanel>
      <TabPanel value="2" sx={{ border: 'none', p: 0 }}><UltimosUsosUnidades /></TabPanel>
      <TabPanel value="3" sx={{ border: 'none', p: 0 }}>Item Three</TabPanel>
    </TabContext>
  </Box>;
};

export default ReportesCorreos;
