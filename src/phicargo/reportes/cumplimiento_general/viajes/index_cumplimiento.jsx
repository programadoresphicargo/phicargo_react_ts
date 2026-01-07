import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import odooApi from '@/api/odoo-api';
import { ViajeProvider } from '@/phicargo/viajes/context/viajeContext';
import ReporteCumplimientoEjecutivo from './cumplimiento';
import ReporteCumplimientoV from './cumplimiento';

const ReporteCumplimientoGeneralViajeIndex = () => {

    return (
        <ReporteCumplimientoV></ReporteCumplimientoV>
    );
};

export default ReporteCumplimientoGeneralViajeIndex;
