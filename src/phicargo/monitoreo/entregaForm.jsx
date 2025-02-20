import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react";
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@heroui/react";
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useAuthContext } from '../modules/auth/hooks';
import odooApi from '../modules/core/api/odoo-api';

const EntregaForm2 = ({ id_entrega, onClose }) => {

    const { session } = useAuthContext();

    const initialFormData = {
        id_entrega: id_entrega,
        id_usuario: session.user.id,
        titulo: '',
        descripcion: '',
        sucursal: '',
        id_tipo_evento: '',
        estado: 'pendiente',
        id_usuario_atendio: null,
        fecha_atencion: null
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        fetchTipoEvento();
    }, []);

    const [tipo_eventos, setTipoEventos] = useState([]);

    const fetchTipoEvento = () => {
        const baseUrl = '/tipos_eventos_monitoreo/';

        odooApi.get(baseUrl)
            .then(response => {
                const data = response.data.map(item => ({
                    value: item.id_tipo_evento,
                    label: item.nombre_evento,
                }));
                setTipoEventos(data);
            })
            .catch(err => {
                console.error('Error al obtener la flota:', err);
            });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const registrar_evento = async (e) => {

        if (!formData.titulo || !formData.sucursal || !formData.id_tipo_evento || !formData.descripcion) {
            toast.error('Todos los campos son obligatorios');
            return;
        }

        console.log(formData);

        try {
            const response = await odooApi.post('/eventos/crear_evento/', formData);

            if (response.data.mensaje) {
                toast.success(response.data.mensaje);
                setFormData(initialFormData);
                onClose();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error('Error al enviar los datos:' + error);
        }
    };


    return (
        <>
            <Grid container spacing={2}>
                <Stack spacing={2} direction="row" style={{ padding: '20px' }}>
                    <Button onClick={registrar_evento} style={{ marginTop: '20px' }} color='primary'>Guardar evento</Button>
                </Stack>

                <Grid item xs={12} sm={12} md={12}>
                    <TextField
                        label="Titulo del evento"
                        placeholder="Ingresa el titulo"
                        id="titulo"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange} // Aquí
                        fullWidth={true}
                        size='small'
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={6}>
                    <Select
                        labelId="sucursal"
                        id="sucursal"
                        name="sucursal"
                        label="Sucursal"
                        value={formData.sucursal}
                        onChange={handleChange}
                        fullWidth={true}
                        size='small'
                    >
                        <MenuItem value={'veracruz'}>Veracruz</MenuItem>
                        <MenuItem value={'manzanillo'}>Manzanillo</MenuItem>
                        <MenuItem value={'mexico'}>México</MenuItem>
                    </Select>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                    <Autocomplete
                        id="id_tipo_evento"
                        name="id_tipo_evento"
                        size='small'
                        value={tipo_eventos.find(option => option.value === formData.id_tipo_evento) || null}
                        onChange={(event, newValue) => {
                            setFormData({
                                ...formData,
                                id_tipo_evento: newValue ? newValue.value : ''
                            });
                        }}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        options={tipo_eventos}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Tipo de evento"
                                variant="outlined"
                                fullWidth={true}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                    <TextField
                        label="Descripcion"
                        placeholder="Ingresa detalles acerca del evento"
                        multiline={true}
                        rows={6}
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange} // Aquí
                        fullWidth={true}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default EntregaForm2;