import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import ManiobraContenedores from './añadir_contenedor/maniobra_contenedores';
import { User } from "@nextui-org/react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import { Button } from '@nextui-org/react';
import AutocompleteManager from './correos_electronicos/correos_electronicos';
import CancelarManiobraDialog from './cancelar_maniobra';
import { toast } from 'react-toastify';
import { Card, CardBody } from '@nextui-org/react';
import { Container, filledInputClasses } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Swal from 'sweetalert2';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import PanelEstatus from './envio_estatus/panel';
import { useAuthContext } from '@/phicargo/modules/auth/hooks';
import EstatusHistorialManiobras from '../reportes_estatus/estatus';
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import CostosExtrasContenedores from './añadir_contenedor/maniobra_contenedores';
import { CostosExtrasContext } from '../context/context';
import ServiciosAplicadosCE from './costos_aplicados/servicios_aplicados';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FormularioCostoExtra = ({ show, handleClose }) => {

    const { id_folio, CartasPorte, CartasPorteEliminadas, ServiciosAplicados, setServiciosAplicados, CostosExtrasEliminados } = useContext(CostosExtrasContext);
    const [Loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        id_folio: id_folio,
        facturado: false,
    });

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            id_folio: id_folio
        }));
    }, [id_folio]);

    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const registrar_maniobra = () => {
        const formData2 = {
            data: formData,
            cartas_porte: CartasPorte,
            costos_extras: ServiciosAplicados
        }
        setLoading(true);
        odooApi.post('/folios_costos_extras/create/', formData2)
            .then((response) => {
                const data = response.data;
                setLoading(false);
                if (data.success) {
                    toast.success('El registro ha sido exitoso.');
                    handleClose();
                } else if (data.error) {
                    toast.error('Error: ' + data.error);
                } else {
                    toast.error('Respuesta inesperada.' + data.error);
                }
            })
            .catch((error) => {
                console.error('Error en la solicitud:' + error);
                setLoading(false);
                toast.error('Respuesta de error:' + error);
            });
    };

    const actualizar_maniobra = () => {
        const formData2 = {
            data: formData,
            cartas_porte: CartasPorte,
            cartas_porte_eliminadas: CartasPorteEliminadas,
            costos_extras: ServiciosAplicados,
            costos_extras_eliminados: CostosExtrasEliminados,
        };

        setLoading(true);

        odooApi.post('/folios_costos_extras/update/', formData2)
            .then((response) => {
                setLoading(false);
                const data = response.data;

                if (data.status === 'success') {
                    toast.success(data.message);
                } else {
                    toast.error('Respuesta inesperada del servidor: ' + JSON.stringify(data));
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error en la solicitud:', error);

                if (error.response) {
                    toast.error('Error del servidor: ' + JSON.stringify(error.response.data));
                } else if (error.request) {
                    toast.error('No se recibió respuesta del servidor.');
                } else {
                    toast.error('Error en la solicitud: ' + error.message);
                }
            });
    };

    return (
        <>
            <Dialog open={show}
                onClose={handleClose}
                fullScreen
                TransitionComponent={Transition}
                PaperProps={{
                    style: {
                        zIndex: 1,
                    },
                }}>
                <Box sx={{ flexGrow: 1 }} className='bg-soft-secondary'>

                    <AppBar sx={{ position: 'relative' }} elevation={0}>
                        <Toolbar>
                            <Typography sx={{ flex: 1 }} component="div">
                                Registro de costos extras CE-{id_folio}
                            </Typography>
                            <Button autoFocus color="inherit" onClick={handleClose}>
                                Cerrar
                            </Button>
                        </Toolbar>
                    </AppBar>

                    {Loading && (
                        <Box sx={{ width: '100%' }} visibility={false}>
                            <LinearProgress />
                        </Box>
                    )}

                    <Grid container className='m-1'>
                        <Grid lg={12} xs={12} className='mt-2 mb-2'>
                            <Stack spacing={1} direction="row">
                                <Button color="primary" size='sm' onPress={registrar_maniobra} isLoading={Loading}>Registrar</Button>
                                <Button color="danger" size='sm' onPress={handleOpenDialog} >Cancelar</Button>
                                <Button color="secondary" size='sm' onPress={handleOpenDialog} >Facturar</Button>
                                <Button color="primary" size='sm' onPress={actualizar_maniobra} isLoading={Loading}>Guardar cambios</Button>
                            </Stack>
                        </Grid>

                        <Grid lg={7} xs={12}>
                            <CostosExtrasContenedores></CostosExtrasContenedores>
                            <ServiciosAplicadosCE></ServiciosAplicadosCE>
                        </Grid>

                        <Grid lg={5} xs={12}>
                            <ServiciosAplicadosCE></ServiciosAplicadosCE>
                        </Grid>

                    </Grid>
                </Box>
            </Dialog >
        </>
    );
};

export default FormularioCostoExtra;
