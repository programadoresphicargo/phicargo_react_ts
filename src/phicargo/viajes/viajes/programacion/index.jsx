import React from 'react';
import { ViajeProvider } from '../context/viajeContext'
import ViajesActivos from './viajes';
import ViajesProgramados from './viajes';

const ControlViajesProgramados = () => {
    return (
        <ViajeProvider>
            <ViajesProgramados></ViajesProgramados>
        </ViajeProvider>
    );
};

export default ControlViajesProgramados;
