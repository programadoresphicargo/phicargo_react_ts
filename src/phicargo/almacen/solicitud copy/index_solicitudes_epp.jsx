import React from 'react';
import NavbarAlmacen from '../Navbar';
import { AlmacenProvider } from '../contexto/contexto';
import Solicitudes from './solicitudes';
import AsignacionesEquipos from './solicitudes';

const AsignacionesEquiposIndex = () => {
    return (
        <>
            <AlmacenProvider>
                <NavbarAlmacen></NavbarAlmacen>
                <AsignacionesEquipos></AsignacionesEquipos>
            </AlmacenProvider>
        </>
    );
};

export default AsignacionesEquiposIndex;
