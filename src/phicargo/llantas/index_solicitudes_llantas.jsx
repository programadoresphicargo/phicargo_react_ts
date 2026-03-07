import React from 'react';
import Solicitudes from '../almacen/solicitud/solicitudes';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CustomNavbar from '@/pages/CustomNavbar';
import { pages } from '../almacen/pages';
import SolicitudesLlantas from './solicitudes';
import { SolicitudesLlantasProvider } from './contexto';
import InventarioLlantas from './inventario_llantas';

const SolicitudesLlantasIndex = () => {

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <SolicitudesLlantasProvider>
                <CustomNavbar pages={pages}></CustomNavbar>
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
                                <Tab label="Solicitudes" value="1" sx={{ fontFamily: 'Inter' }} />
                                <Tab label="Inventario" value="2" sx={{ fontFamily: 'Inter' }} />
                            </TabList>
                        </Box>
                        <TabPanel value="1" sx={{ padding: 0, margin: 0 }}><SolicitudesLlantas vista={'solicitudes de llantas de refacción'}></SolicitudesLlantas></TabPanel>
                        <TabPanel value="2" sx={{ padding: 0, margin: 0 }}><InventarioLlantas></InventarioLlantas></TabPanel>
                    </TabContext>
                </Box>

            </SolicitudesLlantasProvider>
        </>
    );
};

export default SolicitudesLlantasIndex;
