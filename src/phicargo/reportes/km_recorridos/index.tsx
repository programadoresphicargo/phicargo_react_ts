import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import KMRecorridosOperadores from './km_recorridos';
import CustomNavbar from '@/pages/CustomNavbar';

const IndexKMRecorridos = () => {

  const [value, setValue] = React.useState('1');

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return <Box sx={{ width: '100%' }}>
    <CustomNavbar></CustomNavbar>
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
          <Tab sx={{ fontFamily: 'Inter' }} label="Operadores" value="1" />
          <Tab sx={{ fontFamily: 'Inter' }} label="Vehiculos" value="2" />
          <Tab sx={{ fontFamily: 'Inter' }} label="Sucursal" value="3" />
        </TabList>
      </Box>
      <TabPanel value="1" sx={{ border: 'none', p: 0 }}><KMRecorridosOperadores tipo_reporte={"operadores"} /></TabPanel>
      <TabPanel value="2" sx={{ border: 'none', p: 0 }}><KMRecorridosOperadores tipo_reporte={"vehiculos"} /></TabPanel>
      <TabPanel value="3" sx={{ border: 'none', p: 0 }}><KMRecorridosOperadores tipo_reporte={"sucursal"} /></TabPanel>
    </TabContext>
  </Box >;
};

export default IndexKMRecorridos;
