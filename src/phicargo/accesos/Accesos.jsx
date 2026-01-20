import React from "react";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import AppsIcon from '@mui/icons-material/Apps';
import AvatarProfile from "@/components/ui/AvatarProfile";

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { useNavigate } from "react-router-dom";

import TablaAccesos from "./tabla";
import RegistroVehiculos from "./vehiculos/registros_vehiculos";
import AccesoCompo from "./AccesoCompo";

import logo from '../../assets/img/phicargo-vertical.png';

/* 🎨 Tema por tipo de acceso */
const accessTheme = {
    '1': {
        gradient: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
        indicator: '#4fc3f7',
    },
    '2': {
        gradient: 'linear-gradient(90deg, #7f00b1 0%, #7f00b1 100%)',
        indicator: '#81c784',
    },
    '3': {
        gradient: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
        indicator: '#ce93d8',
    },
    '4': {
        gradient: 'linear-gradient(90deg, #a9000b 0%, #b81f00 100%)',
        indicator: '#ffcc80',
    },
    '5': {
        gradient: 'linear-gradient(90deg, #37474f 0%, #455a64 100%)',
        indicator: '#b0bec5',
    },
    '6': {
        gradient: 'linear-gradient(90deg, #263238 0%, #37474f 100%)',
        indicator: '#90a4ae',
    },
};

export default function Accesos() {

    const navigate = useNavigate();
    const [value, setValue] = React.useState('1');

    const handleBackClick = () => navigate("/menu");
    const handleChange = (event, newValue) => setValue(newValue);

    const currentTheme = accessTheme[value];

    const tabStyle = {
        fontFamily: 'Inter',
        color: 'rgba(255,255,255,0.6)',
        transition: 'color 0.25s ease, transform 0.2s ease',
        '&.Mui-selected': {
            color: '#ffffff',
            fontWeight: 600,
            transform: 'translateY(-1px)',
        },
    };

    return (
        <Box sx={{ width: '100%' }}>
            <TabContext value={value}>

                {/* HEADER */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 1,
                        color: 'white',

                        backgroundImage: currentTheme.gradient,
                        backgroundPosition: '0% 50%',
                        transition: 'background-position 0.6s ease',

                        ...(value && { backgroundPosition: '100% 50%' }),
                    }}
                >
                    {/* Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton color="inherit" onClick={handleBackClick}>
                            <AppsIcon />
                        </IconButton>

                        <img
                            src={logo}
                            alt="Logo"
                            style={{
                                width: '150px',
                                height: '52px',
                                filter: 'brightness(0) invert(1)',
                            }}
                        />
                    </Box>

                    {/* TABS */}
                    <TabList
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        sx={{
                            '& .MuiTabs-indicator': {
                                height: '3px',
                                backgroundColor: currentTheme.indicator,
                                transition: 'background-color 0.35s ease, width 0.35s ease',
                            },
                        }}
                    >
                        <Tab label="PEATONAL" value="1" sx={tabStyle} />
                        <Tab label="VEHICULAR" value="2" sx={tabStyle} />
                        <Tab label="MIS ACCESOS" value="3" sx={tabStyle} />
                        <Tab label="POR AUTORIZAR" value="4" sx={tabStyle} />
                        <Tab label="REGISTRO VEHICULOS" value="5" sx={tabStyle} />
                        <Tab label="ARCHIVADOS" value="6" sx={tabStyle} />
                    </TabList>

                    {/* Avatar */}
                    <Box sx={{ mr: 2 }}>
                        <AvatarProfile />
                    </Box>
                </Box>

                {/* PANELS */}
                <TabPanel
                    value="1"
                    sx={{
                        p: 0,
                        animation: 'fadeIn 0.35s ease',
                    }}
                >
                    <TablaAccesos tipo="peatonal" title="Acceso Peatonal" background={currentTheme.gradient} />
                </TabPanel>

                <TabPanel value="2" sx={{ p: 0, animation: 'fadeIn 0.35s ease' }}>
                    <TablaAccesos tipo="vehicular" title="Acceso Vehicular" background={currentTheme.gradient} />
                </TabPanel>

                <TabPanel value="3" sx={{ p: 0, animation: 'fadeIn 0.35s ease' }}>
                    <TablaAccesos tipo="user" title="Mis accesos" background={currentTheme.gradient} />
                </TabPanel>

                <TabPanel value="4" sx={{ p: 0, animation: 'fadeIn 0.35s ease' }}>
                    <TablaAccesos tipo="autorizacion" title="Pendientes de autorización" background={currentTheme.gradient} />
                </TabPanel>

                <AccesoCompo>
                    <TabPanel value="5" sx={{ p: 0, animation: 'fadeIn 0.35s ease' }}>
                        <RegistroVehiculos />
                    </TabPanel>
                </AccesoCompo>

                <TabPanel value="6" sx={{ p: 0, animation: 'fadeIn 0.35s ease' }}>
                    <TablaAccesos tipo="archivado" title="Accesos archivados" background={currentTheme.gradient} />
                </TabPanel>

            </TabContext>

            {/* Animación global */}
            <style>
                {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
            </style>
        </Box>
    );
}
