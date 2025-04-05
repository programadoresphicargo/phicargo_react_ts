import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import odooApi from '@/api/odoo-api';
import NavbarViajes from '@/phicargo/viajes/navbar';
import { ViajeProvider } from '@/phicargo/viajes/context/viajeContext';
import ReporteCumplimientoEjecutivo from './cumplimiento_ejecutivo';

const ReporteCumplimientoEjecutivoIndex = () => {

    return (
        <ViajeProvider>
            <NavbarViajes></NavbarViajes>
            <ReporteCumplimientoEjecutivo></ReporteCumplimientoEjecutivo>
        </ViajeProvider>
    );
};

export default ReporteCumplimientoEjecutivoIndex;
