import React from 'react';
import NavbarAlmacen from '../Navbar';
import { AlmacenProvider } from '../contexto/contexto';
import Solicitudes from './solicitudes';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const Almacen = () => {

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <AlmacenProvider>
                <NavbarAlmacen></NavbarAlmacen>
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
                                <Tab label="Solicitudes para viaje" value="1" sx={{ fontFamily: 'Inter' }} />
                                <Tab label="Asignaciones" value="2" sx={{ fontFamily: 'Inter' }} />
                            </TabList>
                        </Box>
                        <TabPanel value="1" sx={{ padding: 0, margin: 0 }}><Solicitudes x_tipo={'amarre'} vista={'solicitudes'}></Solicitudes></TabPanel>
                        <TabPanel value="2" sx={{ padding: 0, margin: 0 }}><Solicitudes x_tipo={'amaree'} vista={'asignaciones'}></Solicitudes></TabPanel>
                    </TabContext>
                </Box>
            </AlmacenProvider>
        </>
    );
};

export default Almacen;
