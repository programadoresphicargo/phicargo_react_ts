import React from 'react';
import { ViajeProvider } from '../context/viajeContext'
import ViajesActivos from './viajes';

const ControlViajesActivos = () => {
    return (
        <ViajeProvider>
            <ViajesActivos></ViajesActivos>
        </ViajeProvider>
    );
};

export default ControlViajesActivos;
