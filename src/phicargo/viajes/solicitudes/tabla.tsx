import React, { useContext } from 'react';
import { Box } from '@mui/material';
import { ViajeContext } from '../context/viajeContext';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import Solicitudes from "@/phicargo/almacen/solicitud/solicitudes";

const SolicitudesEquipoViaje = () => {

  const { id_viaje } = useContext(ViajeContext);

  const [value, setValue] = React.useState('1');

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TabContext value={value}>
        <Box sx={{ borderColor: 'divider', backgroundColor: '#002887', color: 'white' }}>
          <TabList
            visibleScrollbar
            onChange={handleChange}
            textColor="inherit"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'white',
                height: '3px',
              }
            }}>
            <Tab label="Equipo de protección" value="1" sx={{ fontFamily: 'Inter' }} />
            <Tab label="Equipo de amarre" value="2" sx={{ fontFamily: 'Inter' }} />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ padding: 0, margin: 0 }}><Solicitudes x_tipo={'epp'} vista={'solicitudes'} travel_id={id_viaje}></Solicitudes></TabPanel>
        <TabPanel value="2" sx={{ padding: 0, margin: 0 }}><Solicitudes x_tipo={'amarre'} vista={'solicitudes'} travel_id={id_viaje}></Solicitudes></TabPanel>
      </TabContext>
    </Box>
  );
};

export default SolicitudesEquipoViaje;
