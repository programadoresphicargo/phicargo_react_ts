import React, { useEffect, useState } from 'react';
import NavbarAlmacen from '../Navbar';
import { AlmacenProvider } from '../contexto/contexto';
import Inventario from './tabla';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { useAuthContext } from '@/modules/auth/hooks';

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
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList value={value} onChange={handleChange}>
                            {session?.user?.permissions?.includes(515) && (
                                <Tab label="Equipo de protección personal" value="0" />
                            )}
                            {session?.user?.permissions?.includes(516) && (
                                <Tab label="Equipo de amarre" value="1" />
                            )}
                        </TabList>
                    </Box>

                    {session?.user?.permissions?.includes(515) && (
                        <TabPanel value="0" sx={{ padding: 0 }}>
                            <Inventario tipo="epp" />
                        </TabPanel>
                    )}

                    {session?.user?.permissions?.includes(516) && (
                        <TabPanel value="1" sx={{ padding: 0 }}>
                            <Inventario tipo="amarre" />
                        </TabPanel>
                    )}
                </Box>
            </TabContext>
        </AlmacenProvider>
    );
};

export default Almacen;
