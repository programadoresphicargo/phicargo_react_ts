import React from 'react';
import NavbarAlmacen from '../Navbar';
import SolicitudesEPP from './solicitudes';
import { AlmacenProvider } from '../contexto/contexto';

const Almacen = () => {
    return (
        <>
            <AlmacenProvider>
                <NavbarAlmacen></NavbarAlmacen>
                <SolicitudesEPP></SolicitudesEPP>
            </AlmacenProvider>
        </>
    );
};

export default Almacen;
