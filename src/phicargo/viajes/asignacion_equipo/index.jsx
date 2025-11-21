import React from 'react';
import { ViajeProvider } from '../context/viajeContext'
import ViajesActivos from './viajes';
import ViajesProgramados from './viajes';

const AsignacionEquipo = () => {
    return (
        <ViajesProgramados></ViajesProgramados>
    );
};

export default AsignacionEquipo;
