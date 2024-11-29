import React from 'react';
import { ViajeProvider } from '../context/viajeContext'
import ViajesActivos from './viajes';
import ViajesProgramados from './viajes';
import ViajesFinalizados from './viajes';

const ControlViajesFinalizados = () => {
    return (
        <ViajeProvider>
            <ViajesFinalizados></ViajesFinalizados>
        </ViajeProvider>
    );
};

export default ControlViajesFinalizados;
