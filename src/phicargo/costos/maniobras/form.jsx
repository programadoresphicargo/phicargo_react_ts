import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import ManiobraContenedores from './añadir_contenedor/maniobra_contenedores';
import { Input, User } from "@nextui-org/react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import { Button } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { Card, CardBody } from '@nextui-org/react';
import { Container, filledInputClasses } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Swal from 'sweetalert2';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useAuthContext } from '@/phicargo/modules/auth/hooks';
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import CostosExtrasContenedores from './añadir_contenedor/maniobra_contenedores';
import { CostosExtrasContext } from '../context/context';
import ServiciosAplicadosCE from './costos_aplicados/costos_aplicados';

const FormCE = ({ }) => {

    const { id_folio, formData, setFormData, DisabledForm } = useContext(CostosExtrasContext);

    const handleChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            ref_factura: value === "" ? null : value,
        }));
    };

    return (
        <>
            <Card>
                <CardBody>
                    <Input
                        label="Referencia factura"
                        value={formData.ref_factura ?? ""}
                        onValueChange={handleChange}
                        isDisabled={DisabledForm}
                        variant='bordered'
                        type='number'></Input>
                </CardBody>
            </Card>
        </>
    );
};

export default FormCE;
