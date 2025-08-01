import { Button, Chip, DatePicker } from "@heroui/react";
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SucursalActualUnidad from "./unidades";
import SucursalActualOperador from "./operadores";

const SucursalActual = () => {

  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
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
                }
              }}>
              <Tab label="Operadores" value="1" sx={{ fontFamily: 'Inter' }} />
              <Tab label="Unidades" value="2" sx={{ fontFamily: 'Inter' }} />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{ padding: 0, margin: 0 }}><SucursalActualOperador></SucursalActualOperador></TabPanel>
          <TabPanel value="2" sx={{ padding: 0, margin: 0 }}><SucursalActualUnidad></SucursalActualUnidad></TabPanel>
        </TabContext>
      </Box>
    </>
  );
};

export default SucursalActual;
