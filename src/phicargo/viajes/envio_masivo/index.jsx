import React from 'react';
import { ViajeProvider } from '../context/viajeContext'
import WebSocketWithToast from '@/phicargo/websocket/websocket';
import ViajesActivosMasivo from './viajes_activos';
import NavbarViajes from '../navbar';

const EnviosMasivosViajes = () => {
    return (
        <ViajeProvider>
            <WebSocketWithToast></WebSocketWithToast>
            <NavbarViajes></NavbarViajes>
            <ViajesActivosMasivo />
        </ViajeProvider>
    );
};

export default EnviosMasivosViajes;
