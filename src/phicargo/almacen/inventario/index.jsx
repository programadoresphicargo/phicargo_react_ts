import React, { useEffect, useState } from 'react';
import NavbarAlmacen from '../Navbar';
import { AlmacenProvider } from '../contexto/contexto';
import Inventario from './tabla_productos';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { useAuthContext } from '@/modules/auth/hooks';
import TablaProductos from './tabla_productos';
import TablaUnidades from './unidades/tabla_unidades';

const Almacen = () => {
    const [value, setValue] = useState('0'); // `value` debe ser string
    const { session } = useAuthContext();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Ajustar valor inicial según permisos
    useEffect(() => {
        if (session) {
            const hasEpp = session.user?.permissions?.includes(515);
            const hasAmarre = session.user?.permissions?.includes(516);

            if (!hasEpp && hasAmarre) {
                setValue('1');
            } else if (hasEpp && !hasAmarre) {
                setValue('0');
            }
        }
    }, [session]);

    return (
        <AlmacenProvider>
            <NavbarAlmacen />
            <TabContext value={value}>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderColor: 'divider', backgroundColor: '#002887', color: 'white' }}>
                        <TabList value={value} onChange={handleChange} textColor="inherit"
                            sx={{
                                '& .MuiTabs-indicator': {
                                    backgroundColor: 'white',
                                    height: '3px',
                                }
                            }}>
                            <Tab label="Productos" value="0" sx={{ fontFamily: 'Inter' }} />
                            <Tab label="Unidades" value="1" sx={{ fontFamily: 'Inter' }} />
                        </TabList>
                    </Box>

                    <TabPanel value="0" sx={{ padding: 0 }}>
                        <TablaProductos></TablaProductos>
                    </TabPanel>

                    <TabPanel value="1" sx={{ padding: 0 }}>
                        <TablaUnidades></TablaUnidades>
                    </TabPanel>
                </Box>
            </TabContext>
        </AlmacenProvider>
    );
};

export default Almacen;
