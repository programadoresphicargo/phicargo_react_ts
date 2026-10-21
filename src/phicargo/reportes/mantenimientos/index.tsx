import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import MaintenanceRules from './rules/rules';
import Maintenances from './maintenances';
import MaintenanceVehicleReport from './vehiculos';
import Odometers from './odometer/odometers';
import GoogleAppsMenu from '@/pages/menu';
import logo from '../../../assets/img/phicargo-vertical.png';
import AvatarProfile from '@/components/ui/AvatarProfile';

const MaintenanceIndex = () => {

  const [value, setValue] = React.useState('1');

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#002887',
          color: 'white',
          width: '100%',
        }}
      >
        {/* Menú de aplicaciones a la izquierda */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            px: 1,
          }}
        >
          <GoogleAppsMenu />

          <img
            src={logo}
            alt="Logo"
            style={{
              width: "175px",
              height: "60px",
              marginRight: "16px",
              filter: "brightness(0) invert(1)",
            }}
          />

        </Box>

        {/* Pestañas en el espacio restante */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <TabContext value={value}>
            <TabList
              centered
              onChange={handleChange}
              aria-label="Secciones de mantenimiento"
              textColor="inherit"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: 'white',
                  height: '3px',
                },
                '& .MuiTab-root': {
                  fontFamily: 'Inter',
                },
              }}
            >
              <Tab label="Resumen" value="1" />
              <Tab label="Reglas" value="2" />
              <Tab label="Mantenimientos" value="3" />
              <Tab label="Odómetros" value="4" />
            </TabList>
          </TabContext>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            px: 1,
          }}
        >
          <AvatarProfile></AvatarProfile>
        </Box>

      </Box>

      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <TabPanel value="1" sx={{ p: 0, m: 0 }} keepMounted>
            <MaintenanceVehicleReport />
          </TabPanel>

          <TabPanel value="2" sx={{ p: 0, m: 0 }} keepMounted>
            <MaintenanceRules />
          </TabPanel>

          <TabPanel value="3" sx={{ p: 0, m: 0 }} keepMounted>
            <Maintenances />
          </TabPanel>

          <TabPanel value="4" sx={{ p: 0, m: 0 }} keepMounted>
            <Odometers />
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
};

export default MaintenanceIndex;
