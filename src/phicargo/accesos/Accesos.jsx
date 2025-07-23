import React from "react";
import { Tabs, Card, CardBody } from "@heroui/react";
import Maniobras from "./tabla";
import ResponsiveAppBar from "./Navbar";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TablaAccesos from "./tabla";
import RegistroVehiculos from "./vehiculos/registros_vehiculos";
import AccesoCompo from "./AccesoCompo";

export default function Accesos() {

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <ResponsiveAppBar></ResponsiveAppBar>
            <Box sx={{ width: '100%' }}>
                <TabContext value={value}>
                    <Box sx={{ borderColor: 'divider', backgroundColor: '#002887', color: 'white' }}>
                        <TabList
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            onChange={handleChange}
                            textColor="inherit"
                            sx={{
                                '& .MuiTabs-indicator': {
                                    backgroundColor: 'white',
                                    height: '3px',
                                }
                            }}
                        >
                            <Tab label="PEATONAL" value="1" sx={{ fontFamily: 'Inter' }} />
                            <Tab label="VEHICULAR" value="2" sx={{ fontFamily: 'Inter' }} />
                            <Tab label="MIS ACCESOS" value="3" sx={{ fontFamily: 'Inter' }} />
                            <Tab label="POR AUTORIZAR" value="4" sx={{ fontFamily: 'Inter' }} />
                            <Tab label="REGISTRO VEHICULOS" value="5" sx={{ fontFamily: 'Inter' }} />
                            <Tab label="ARCHIVADOS" value="6" sx={{ fontFamily: 'Inter' }} />
                        </TabList>
                    </Box>

                    <TabPanel value="1" sx={{ padding: 0, margin: 0 }}>
                        <TablaAccesos tipo={'peatonal'} title={'Acceso Peatonal'} />
                    </TabPanel>
                    <TabPanel value="2" sx={{ padding: 0, margin: 0 }}>
                        <TablaAccesos tipo={'vehicular'} title={'Acceso Vehicular'} />
                    </TabPanel>
                    <TabPanel value="3" sx={{ padding: 0, margin: 0 }}>
                        <TablaAccesos tipo={'user'} title={'Mis accesos'} />
                    </TabPanel>
                    <TabPanel value="4" sx={{ padding: 0, margin: 0 }}>
                        <TablaAccesos tipo={'autorizacion'} title={'Pendientes de autorización'} />
                    </TabPanel>
                    <AccesoCompo>
                        <TabPanel value="5" sx={{ padding: 0, margin: 0 }}>
                            <RegistroVehiculos />
                        </TabPanel>
                    </AccesoCompo>
                    <TabPanel value="6" sx={{ padding: 0, margin: 0 }}>
                        <TablaAccesos tipo={'archivado'} title={'Accesos archivados'} />
                    </TabPanel>
                </TabContext>
            </Box>
        </>
    );
}
