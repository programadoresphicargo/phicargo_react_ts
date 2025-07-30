
import { Button, Card, CardBody, DatePicker } from '@heroui/react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Formulariomaniobra from '../maniobras/formulario_maniobra';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Swal from 'sweetalert2';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { jsPDF } from 'jspdf';
import odooApi from '@/api/odoo-api';
import { Select, SelectItem } from "@heroui/react";
import { DateRangePicker } from "@heroui/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

const { VITE_PHIDES_API_URL } = import.meta.env;


const PeriodoPagoManiobras = ({ fetchData }) => {

    const [isLoading, setLoading] = useState(false);
    const [id_sucursal, setSucursal] = React.useState("");
    const handleSelectionChange = (e) => {
        setSucursal(e.target.value);
    };
    
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + 7); // suma 7 días

    const format = (date) => date.toISOString().split('T')[0];

    const [value, setValue] = useState({
        start: parseDate(format(start)),
        end: parseDate(format(end)),
    });

    const abrirPeriodo = async () => {
        try {
            const payload = {
                id_sucursal: parseInt(id_sucursal), // si espera número
                fecha_inicio: value.start?.toString(),
                fecha_fin: value.end?.toString(),
            };
            setLoading(true);
            const response = await odooApi.post('/maniobras/periodos_pagos_maniobras/', payload);
            if (response.data.status == 'success') {
                toast.success(response.data.message);
                fetchData();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="px-1 py-2 w-full">
                <p className="text-small font-bold text-foreground">
                    Nuevo periodo
                </p>

                <div className="mt-2 flex flex-col gap-2 w-full">
                    <Select
                        label="Sucursal"
                        placeholder="Seleccionar sucursal"
                        variant="bordered"
                        onChange={handleSelectionChange}
                    >
                        <SelectItem key={1}>Veracruz</SelectItem>
                        <SelectItem key={9}>Manzanillo</SelectItem>
                        <SelectItem key={2}>México</SelectItem>
                    </Select>

                    <DateRangePicker label="Periodo" value={value} onChange={setValue} variant='bordered' />

                    <Button
                        fullWidth
                        color="primary"
                        isLoading={isLoading}
                        onPress={() => {
                            abrirPeriodo();
                        }}
                    >
                        Abrir
                    </Button>
                </div>
            </div>
        </>
    );
};

export default PeriodoPagoManiobras;
