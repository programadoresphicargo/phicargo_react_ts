import { Button, Chip, Tooltip } from "@heroui/react";
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
} from '@mui/material';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { exportToCSV } from '../utils/export';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import FormularioRemolques from "./formulario";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Travel from "../viajes/control/viaje";
import { ViajeProvider } from "../viajes/context/viajeContext";
import Remolques from "./remolques";

const RemolquesIndex = () => {

    return (
        <div>
            <ViajeProvider>
                <Remolques></Remolques>
            </ViajeProvider>
        </div>
    );
};

export default RemolquesIndex;
