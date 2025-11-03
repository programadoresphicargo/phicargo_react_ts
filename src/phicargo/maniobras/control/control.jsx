import React from "react";
import Maniobras from "./tabla";
import ManiobrasNavBar from "../Navbar";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { ManiobraProvider } from "../context/viajeContext";
import CustomNavbar from "@/pages/CustomNavbar";
import { pages } from '../pages';

export default function control_maniobras() {

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <ManiobraProvider>
                <CustomNavbar pages={pages}></CustomNavbar>
                <Box sx={{ width: '100%' }}>
                    <TabContext value={value}>
                        <Box
                            sx={{
                                borderColor: 'divider',
                                background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
                                color: 'white',
                            }}
                        >
                            <TabList onChange={handleChange}
                                textColor="inherit"
                                sx={{
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: 'white',
                                        height: '3px',
                                    }
                                }}
                            >
                                <Tab label="ACTIVAS" value="1" sx={{ fontFamily: 'Inter' }} />
                                <Tab label="PROGRAMADAS" value="2" sx={{ fontFamily: 'Inter' }} />
                                <Tab label="FINALIZADAS" value="3" sx={{ fontFamily: 'Inter' }} />
                                <Tab label="PENDIENTES POR ASIGNAR" value="4" sx={{ fontFamily: 'Inter' }} />
                                <Tab label="CANCELADAS" value="5" sx={{ fontFamily: 'Inter' }} />
                            </TabList>
                        </Box>
                        <TabPanel value="1" sx={{ padding: 0, margin: 0 }}><Maniobras estado_maniobra={'activa'} /></TabPanel>
                        <TabPanel value="2" sx={{ padding: 0, margin: 0 }}><Maniobras estado_maniobra={'borrador'} /></TabPanel>
                        <TabPanel value="3" sx={{ padding: 0, margin: 0 }}> <Maniobras estado_maniobra={'finalizada'} /></TabPanel>
                        <TabPanel value="4" sx={{ padding: 0, margin: 0 }}><Maniobras estado_maniobra={''} /></TabPanel>
                        <TabPanel value="5" sx={{ padding: 0, margin: 0 }}><Maniobras estado_maniobra={'cancelada'} /></TabPanel>
                    </TabContext>
                </Box>
            </ManiobraProvider>
        </>
    );
}
