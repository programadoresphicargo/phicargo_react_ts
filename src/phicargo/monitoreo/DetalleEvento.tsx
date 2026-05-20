import { Card, CardBody, CardFooter, CardHeader, Divider, Progress } from "@heroui/react";
import { Grid } from "@mui/material";
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { Button } from "@heroui/react";
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { AutocompleteInput, TextInput, TextareaInput } from "@/components/inputs";

export type Evento = {
    id_entrega: number;
    titulo: string;
    descripcion: string;
    sucursal: string | null;
    id_tipo_evento: number | null;
    estado: string;
}

type Comentario = {
    comentario: string;
}

export type TipoEvento = {
    id_tipo_evento: number;
    nombre_evento: string;
}

export type TipoEventoResponse = {
    key: number;
    value: string;
}

type ComentarioItem = {
    id_usuario: number;
    nombre: string;
    comentario: string;
    fecha_creacion: string;
};

const DetalleForm = ({ id_evento, onClose }: { id_evento: number, onClose: () => void }) => {

    const [comentarios, setComentarios] = useState<ComentarioItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, reset, watch: watchEvento } = useForm<Evento>({
        defaultValues: {
            titulo: '',
            descripcion: '',
            sucursal: null,
            id_tipo_evento: null,
            estado: 'borrador',
        }
    });

    const {
        control: controlComentarios,
        handleSubmit: handleSubmitComentarios,
        reset: resetComentarios,
    } = useForm<Comentario>({
        defaultValues: {
            comentario: ''
        }
    });

    const sucursales = [
        { key: "veracruz", value: "Veracruz" },
        { key: "manzanillo", value: "Manzanillo" },
        { key: "mexico", value: "México" },
    ];

    useEffect(() => {
        fetchTipoEvento();
    }, []);

    useEffect(() => {
        obtenerEvento();
        obtenerComentarios();
    }, [id_evento]);

    const [tipo_eventos, setTipoEventos] = useState<TipoEventoResponse[]>([]);

    const GuardarComentario = (data: Comentario) => {
        const payload = {
            id_evento,
            comentario: data.comentario,
        };
        odooApi.post('/comentarios_eventos/', payload)
            .then((response) => {
                toast.success(response.data.mensaje);
                obtenerComentarios();
                resetComentarios({ comentario: '' });
            })
            .catch((error) => {
                toast.error('Error al enviar el comentario:' + error);
            });
    };

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
                console.error('Error al obtener api:', err);
            });
    };

    const obtenerEvento = () => {
        setIsLoading(true);
        const baseUrl = '/eventos/' + id_evento;

        odooApi.get(baseUrl)
            .then(response => {
                reset(response.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Error al obtener el evento:', err);
            });
    };

    const actualizar = (data: Evento) => {
        setIsLoading(true);
        odooApi.patch('/eventos/' + id_evento, data)
            .then(response => {
                toast.success("Datos enviados exitosamente.");
                onClose();
                setIsLoading(false);
                console.log(response.data);
            })
            .catch(err => {
                toast.error("Error al enviar los datos:" + err);
                setIsLoading(false);
            });
    };

    const atenderEvento = () => {
        setIsLoading(true);
        odooApi.get('/eventos/atender/' + id_evento)
            .then(response => {
                onClose();
                setIsLoading(false);
                obtenerEvento();
                console.log(response.data);
            })
            .catch(err => {
                console.error("Error al enviar los datos:", err);
                setIsLoading(false);
            });
    };

    const obtenerComentarios = () => {
        const baseUrl = '/comentarios_eventos/evento_id/' + id_evento;
        odooApi.get(baseUrl)
            .then(response => {
                setComentarios(response.data);
            })
            .catch(err => {
                console.error('Error al obtener el evento:', err);
            });
    };

    const estado = watchEvento("estado");

    return (<>

        {isLoading && (
            <Box sx={{ width: '100%', marginTop: 2 }}>
                <LinearProgress />
            </Box>
        )}

        <Grid container spacing={2} p={3}>

            <Grid item xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader className="flex gap-3">
                        <h1>Evento E-{id_evento}</h1>
                        <Button
                            color="primary"
                            onPress={() => handleSubmit(actualizar)()}
                            radius="full">Actualizar</Button>
                        <Button
                            color="success"
                            className="text-white"
                            onPress={atenderEvento}
                            isDisabled={estado == 'atendido' ? true : false}
                            radius="full">{estado == 'atendido' ? 'Atendido' : 'Atender'}
                        </Button>
                    </CardHeader>
                    <Divider />

                    <CardBody>
                        <div className="flex flex-col gap-4">
                            <TextInput
                                control={control}
                                label="Titulo"
                                name="titulo"
                                variant="bordered"
                                isDisabled={estado == 'atendido' ? true : false} />

                            <AutocompleteInput
                                control={control}
                                label="Sucursal"
                                name="sucursal"
                                items={sucursales}
                                variant="bordered"
                                isDisabled={estado == 'atendido' ? true : false}
                            />

                            <AutocompleteInput
                                control={control}
                                name="id_tipo_evento"
                                label="Tipo de evento"
                                items={tipo_eventos}
                                variant="bordered"
                                isDisabled={estado == 'atendido' ? true : false}
                            />

                            <TextareaInput
                                control={control}
                                size="lg"
                                label="Descripción del evento"
                                name="descripcion"
                                variant="bordered"
                                isDisabled={estado == 'atendido' ? true : false}
                            />

                        </div>
                    </CardBody>
                </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
                <h1>Seguimiento</h1>

                {isLoading ? (
                    <Progress isIndeterminate size="sm"></Progress>
                ) : (
                    comentarios.map((comentario, index) => (
                        <Timeline
                            key={index}
                            sx={{
                                [`& .MuiTimelineOppositeContent-root`]: {
                                    flex: 0.2,
                                },
                            }}
                        >
                            <TimelineItem>
                                <TimelineOppositeContent color="textSecondary">
                                    {comentario.fecha_creacion}
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>

                                    <Card>
                                        <CardHeader className="justify-between">
                                            <div className="flex gap-5">
                                                <div className="flex flex-col gap-1 items-start justify-center">
                                                    <h4 className="text-small font-semibold leading-none text-default-600"> ({comentario.id_usuario}) {comentario.nombre}</h4>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardBody className="px-3 py-0 text-small text-default-400">
                                            <p>{comentario.comentario}</p>
                                        </CardBody>
                                        <CardFooter className="gap-3">
                                            <div className="flex gap-1">
                                                <p className=" text-default-400 text-small">{comentario.fecha_creacion}</p>
                                            </div>
                                        </CardFooter>
                                    </Card>

                                </TimelineContent>
                            </TimelineItem>
                        </Timeline>
                    ))
                )}
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Avatar src="/broken-image.jpg" />
                            </Grid>
                            <Grid item xs>
                                <TextareaInput
                                    name="comentario"
                                    control={controlComentarios}
                                    label="Comentarios"
                                    placeholder="Ingresa tu comentario"
                                    variant={"bordered"}
                                />
                            </Grid>
                            <Grid item>
                                <Button color="primary" onPress={() => handleSubmitComentarios(GuardarComentario)()} radius="full">Guardar</Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid >
    </>
    );
};

export default DetalleForm;
