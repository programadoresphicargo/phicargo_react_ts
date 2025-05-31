import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import odooApi from '@/api/odoo-api';
import NavbarViajes from '@/phicargo/viajes/navbar';
import { ViajeProvider } from '@/phicargo/viajes/context/viajeContext';
import { ManiobraProvider } from '@/phicargo/maniobras/context/viajeContext';
import ReporteCumplimientoManiobra from './cumplimiento_maniobra';

const RepCumplimientoManiobra = () => {

    return (
        <ManiobraProvider>
            <ReporteCumplimientoManiobra></ReporteCumplimientoManiobra>
        </ManiobraProvider>
    );
};

export default RepCumplimientoManiobra;
