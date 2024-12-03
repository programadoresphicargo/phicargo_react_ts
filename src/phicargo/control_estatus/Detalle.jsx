import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import UsuarioForm from './UsuarioForm';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default function TabBar() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs value={value} onChange={handleChange} aria-label="Tab Bar">
                <Tab label="Datos del usuario" />
                <Tab label="Permisos" />
            </Tabs>

            <TabPanel value={value} index={0}>
                <UsuarioForm id_usuario={533}></UsuarioForm>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Permisos></Permisos>
            </TabPanel>
            <TabPanel value={value} index={2}>
                Contenido de la Pestaña 3
            </TabPanel>
        </Box>
    );
}
