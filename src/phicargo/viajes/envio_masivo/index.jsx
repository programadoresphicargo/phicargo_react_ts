import React from 'react';
import WebSocketWithToast from '@/phicargo/websocket/websocket';
import ViajesActivosMasivo from './viajes_activos';
import NavbarTravel from '../navbar_viajes';

const EnviosMasivosViajes = () => {
    return (<>
        <WebSocketWithToast></WebSocketWithToast>
        <NavbarTravel></NavbarTravel>
        <ViajesActivosMasivo />
    </>
    );
};

export default EnviosMasivosViajes;
