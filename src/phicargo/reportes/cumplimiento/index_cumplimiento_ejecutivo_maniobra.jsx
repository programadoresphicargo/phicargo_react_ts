import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import odooApi from '@/api/odoo-api';
import NavbarViajes from '@/phicargo/viajes/navbar';
import { ViajeProvider } from '@/phicargo/viajes/context/viajeContext';
import ReporteCumplimientoEjecutivoManiobra from './cumplimiento_ejecutivos_maniobra';
import { ManiobraProvider } from '@/phicargo/maniobras/context/viajeContext';

const ReporteCumplimientoEjecutivoManiobraIndex = () => {

    return (
        <ManiobraProvider>
            <ReporteCumplimientoEjecutivoManiobra></ReporteCumplimientoEjecutivoManiobra>
        </ManiobraProvider>
    );
};

export default ReporteCumplimientoEjecutivoManiobraIndex;
