import React from 'react';
import NavbarAlmacen from '../Navbar';
import { AlmacenProvider } from '../contexto/contexto';
import Solicitudes from './solicitudes';

const Almacen = () => {
    return (
        <>
            <AlmacenProvider>
                <NavbarAlmacen></NavbarAlmacen>
                <Solicitudes x_tipo={'amarre'}></Solicitudes>
            </AlmacenProvider>
        </>
    );
};

export default Almacen;
