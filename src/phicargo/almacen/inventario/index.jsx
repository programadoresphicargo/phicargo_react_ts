import React from 'react';
import NavbarAlmacen from '../Navbar';
import EPP from './tabla';
import { AlmacenProvider } from '../contexto/contexto';

const Almacen = () => {
    return (
        <>
            <AlmacenProvider>
                <NavbarAlmacen></NavbarAlmacen>
                <EPP></EPP>
            </AlmacenProvider>
        </>
    );
};

export default Almacen;
