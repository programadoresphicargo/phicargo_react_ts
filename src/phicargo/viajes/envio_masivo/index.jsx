import React from 'react';
import { ViajeProvider } from '../context/viajeContext'
import WebSocketWithToast from '@/phicargo/websocket/websocket';
import ViajesActivosMasivo from './viajes_activos';
import NavbarTravel from '../navbar_viajes';

const EnviosMasivosViajes = () => {
    return (
        <ViajeProvider>
            <WebSocketWithToast></WebSocketWithToast>
            <NavbarTravel></NavbarTravel>
            <ViajesActivosMasivo />
        </ViajeProvider>
    );
};

export default EnviosMasivosViajes;
