import React from 'react';
import { ViajeProvider } from '../context/viajeContext'
import ViajesActivos from './viajes';
import WebSocketWithToast from '@/phicargo/websocket/websocket';

const ControlViajesActivos = () => {
    return (
        <ViajeProvider>
            <WebSocketWithToast></WebSocketWithToast>
            <ViajesActivos></ViajesActivos>
        </ViajeProvider>
    );
};

export default ControlViajesActivos;
