import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { Card, CardBody, CardFooter, CardHeader, Divider, Image, Link } from "@nextui-org/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";

import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuthContext } from '../modules/auth/hooks';

const EntregaForm2 = ({ id_entrega, onClose }) => {

    const initialFormData = {
        id_entrega: id_entrega,
        titulo: '',
        descripcion: '',
        sucursal: '',
        tipo_evento: ''
    };

    const { session } = useAuthContext();

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        fetchTipoEvento();
    }, []);

    const [tipo_eventos, setTipoEventos] = useState([]);

    const fetchTipoEvento = () => {
        const baseUrl = '/phicargo/monitoreo/entrega_turno/getTipoEvento.php';
        const userId = session.user.id;
        axios.get(baseUrl)
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

    const registrar_acceso = async (e) => {

        if (!formData.titulo || !formData.sucursal || !formData.tipo_evento || !formData.descripcion) {
            toast.error('Todos los campos son obligatorios');
            return;
        }

        console.log(formData);

        try {
            const response = await axios.post('/phicargo/monitoreo/entrega_turno/registrarEvento.php', formData);
            const data = response.data;

            if (data.status === 'success') {
                toast.success(data.message);
                setFormData(initialFormData);
                onClose();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };


    return (
        <>
            <Grid container spacing={2}>
                <Stack spacing={2} direction="row" style={{ padding: '20px' }}>
                    <Button onClick={registrar_acceso} style={{ marginTop: '20px' }} color='primary'>Guardar evento</Button>
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
                        <MenuItem value={'VERACRUZ'}>Veracruz</MenuItem>
                        <MenuItem value={'MANZANILLO'}>Manzanillo</MenuItem>
                        <MenuItem value={'MEXICO'}>México</MenuItem>
                    </Select>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                    <Autocomplete
                        id="tipo_evento"
                        name="tipo_evento"
                        size='small'
                        value={tipo_eventos.find(option => option.value === formData.tipo_evento) || null}
                        onChange={(event, newValue) => {
                            setFormData({
                                ...formData,
                                tipo_evento: newValue ? newValue.value : ''
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