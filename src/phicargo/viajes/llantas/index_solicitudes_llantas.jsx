import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CustomNavbar from '@/pages/CustomNavbar';
import SolicitudesLlantas from '@/phicargo/llantas/solicitudes';
import { SolicitudesLlantasProvider } from '@/phicargo/llantas/contexto';
import { ViajeContext } from '../context/viajeContext';

const SolicitudesLlantasViajesIndex = () => {

    const { id_viaje } = useContext(ViajeContext);

    return (
        <>
            <SolicitudesLlantasProvider>
                <SolicitudesLlantas vista={'solicitudes de llantas de refacción'} travel_id={id_viaje}></SolicitudesLlantas>
            </SolicitudesLlantasProvider>
        </>
    );
};

export default SolicitudesLlantasViajesIndex;
