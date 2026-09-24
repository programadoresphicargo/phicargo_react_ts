import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CustomNavbar from '@/pages/CustomNavbar';
import MaintenanceRules from './rules/rules';
import Maintenances from './maintenances';
import MaintenanceVehicleReport from './vehiculos';
import Odometer from './odometer/odometers';
import Odometers from './odometer/odometers';

const MaintenanceIndex = () => {

  const [value, setValue] = React.useState('1');

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <CustomNavbar></CustomNavbar>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderColor: 'divider', backgroundColor: '#002887', color: 'white' }}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              textColor="inherit"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: 'white',
                  height: '3px',
                  fontFamily: 'Inter'
                }
              }}>
              <Tab label="Vehiculos" value="1" sx={{ fontFamily: 'Inter' }} />
              <Tab label="Reglas" value="2" sx={{ fontFamily: 'Inter' }} />
              <Tab label="Mantenimientos" value="3" sx={{ fontFamily: 'Inter' }} />
              <Tab label="Odometros" value="4" sx={{ fontFamily: 'Inter' }} />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{ padding: 0, margin: 0, fontFamily: "inter" }} keepMounted><MaintenanceVehicleReport></MaintenanceVehicleReport></TabPanel>
          <TabPanel value="2" sx={{ padding: 0, margin: 0, fontFamily: "inter" }} keepMounted><MaintenanceRules></MaintenanceRules></TabPanel>
          <TabPanel value="3" sx={{ padding: 0, margin: 0, fontFamily: "inter" }} keepMounted><Maintenances></Maintenances></TabPanel>
          <TabPanel value="4" sx={{ padding: 0, margin: 0, fontFamily: "inter" }} keepMounted><Odometers></Odometers></TabPanel>
        </TabContext>
      </Box>
    </>
  );
};

export default MaintenanceIndex;
