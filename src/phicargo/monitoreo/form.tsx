import { Button } from "@heroui/react";
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { AutocompleteInput, TextareaInput } from "@/components/inputs";
import { useForm } from "react-hook-form";
import { Evento, TipoEvento, TipoEventoResponse } from "./DetalleEvento";

const EntregaForm2 = ({ id_entrega, onClose }: { id_entrega: number, onClose: () => void }) => {

    const { control, handleSubmit } = useForm<Evento>({
        defaultValues: {
            id_entrega: id_entrega,
            titulo: '',
            descripcion: '',
            sucursal: null,
            id_tipo_evento: null,
            estado: 'pendiente',
        }
    });

    useEffect(() => {
        fetchTipoEvento();
    }, []);

    const [tipo_eventos, setTipoEventos] = useState<TipoEventoResponse[]>([]);

    const fetchTipoEvento = () => {
        const baseUrl = '/tipos_eventos_monitoreo/';

        odooApi.get<TipoEvento[]>(baseUrl)
            .then(response => {
                const data = response.data.map(item => ({
                    key: item.id_tipo_evento,
                    value: item.nombre_evento,
                }));
                setTipoEventos(data);
            })
            .catch(err => {
                console.error('Error al obtener la flota:', err);
            });
    };

    const registrar_evento = async (data: Evento) => {
        try {
            const response = await odooApi.post('/eventos/', data);
            if (response.data.mensaje) {
                toast.success(response.data.mensaje);
                onClose();
            } else {
                toast.error(response.data.mensaje);
            }
        } catch (error) {
            toast.error('Error al enviar los datos:' + error);
        }
    };

    const sucursales = [
        { key: "veracruz", value: "Veracruz" },
        { key: "manzanillo", value: "Manzanillo" },
        { key: "mexico", value: "México" },
    ];

    return (
        <>
            <Grid container spacing={2}>
                <Stack spacing={2} direction="row" style={{ padding: '20px' }}>
                    <Button onPress={() => handleSubmit(registrar_evento)()} color='primary' radius="full">Guardar</Button>
                </Stack>
                <Grid item xs={12} sm={12} md={12}>
                    <TextareaInput
                        label="Titulo del evento"
                        control={control}
                        name="titulo"
                        rules={{ required: 'Campo obligatorio' }} />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <AutocompleteInput
                        control={control}
                        name="sucursal"
                        label="Sucursal"
                        items={sucursales}
                        rules={{ required: 'Campo obligatorio' }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <AutocompleteInput
                        control={control}
                        label="Tipo de evento"
                        name="id_tipo_evento"
                        items={tipo_eventos}
                        rules={{ required: 'Campo obligatorio' }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <TextareaInput
                        control={control}
                        label="Descripcion"
                        placeholder="Ingresa detalles acerca del evento"
                        name="descripcion"
                        rules={{ required: 'Campo obligatorio' }}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default EntregaForm2;