import { useState, useEffect } from "react";
import { TextField, MenuItem, InputLabel, FormControl, Grid } from "@mui/material";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { toast } from 'react-toastify';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import { green, pink } from '@mui/material/colors';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent, { timelineContentClasses } from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
    timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuthContext } from "../modules/auth/hooks";
import { Input } from "@nextui-org/react";
import { Card, CardHeader, CardFooter, CardBody, Divider } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import odooApi from "../modules/core/api/odoo-api";
import { Select } from "@mui/material"

const DetalleForm = ({ id_evento, onClose }) => {

    const { session } = useAuthContext();
    const [comentario, setComentario] = useState('');
    const [comentarios, setComentarios] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleComentarioChange = (event) => {
        setComentario(event.target.value);
    };

    const initialFormData = {
        id_evento: id_evento,
        id_usuario: session.user.id,
        titulo: '',
        descripcion: '',
        sucursal: '',
        id_tipo_evento: '',
        estado: '',
        usuario_atendio: '',
        fecha_atencion: '',
        usuario_creacion: ''
    };

    const sucursales = [
        { key: "veracruz", label: "Veracruz" },
        { key: "manzanillo", label: "Manzanillo" },
        { key: "mexico", label: "México" }, ,
    ];

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        fetchTipoEvento();
    }, []);

    useEffect(() => {
        obtenerEvento();
        obtenerComentarios();
    }, [id_evento]);

    const [tipo_eventos, setTipoEventos] = useState([]);

    const GuardarComentario = () => {
        const data = {
            id_evento: id_evento,
            comentario: comentario,
        };

        odooApi.post('/comentarios/crear_comentario/', data)
            .then((response) => {
                console.log('Respuesta exitosa:', response.data);
                setComentario('');
                obtenerComentarios();
            })
            .catch((error) => {
                toast.error('Error al enviar el comentario:' + error);
            });
    };

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
                console.error('Error al obtener api:', err);
            });
    };

    const obtenerEvento = () => {
        setIsLoading(true);
        const baseUrl = '/eventos/evento_by_id/' + id_evento;

        odooApi.get(baseUrl)
            .then(response => {
                const evento = response.data;
                setFormData({
                    id_evento: id_evento,
                    id_entrega: evento.id_entrega,
                    id_usuario: session.user.id,
                    titulo: evento.titulo || '',
                    descripcion: evento.descripcion || '',
                    sucursal: evento.sucursal || '',
                    usuario_creacion: evento.usuario_creacion || '',
                    id_tipo_evento: evento.tipoEvento.id_tipo_evento || '',
                    estado: evento.estado || '',
                    usuario_atendio: evento.usuario_atendio || '',
                    fecha_atencion: evento.fecha_atencion || null
                });
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Error al obtener el evento:', err);
            });
    };

    const actualizarEvento = () => {
        setIsLoading(true);
        odooApi.post('/eventos/actualizar_evento/' + id_evento, formData)
            .then(response => {
                toast.success("Datos enviados exitosamente:", response.data);
                onClose();
                setIsLoading(false);
            })
            .catch(err => {
                toast.error("Error al enviar los datos:", err);
                setIsLoading(false);
            });
    };

    const atenderEvento = () => {
        setIsLoading(true);
        odooApi.get('/eventos/atender_evento/' + formData.id_evento)
            .then(response => {
                console.log("Datos enviados exitosamente:", response.data);
                onClose();
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error al enviar los datos:", err);
                setIsLoading(false);
            });
    };

    const obtenerComentarios = () => {
        const baseUrl = '/comentarios/comentarios_by_evento_id/' + id_evento;

        odooApi.get(baseUrl)
            .then(response => {
                const evento = response.data;
                setComentarios(evento);
            })
            .catch(err => {
                console.error('Error al obtener el evento:', err);
            });
    };

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
                        <Button color="primary" onClick={actualizarEvento} isDisabled={formData.usuario_creacion == session.user.id ? false : true}>Actualizar</Button>
                        <Button color="success" className="text-white" onClick={atenderEvento} isDisabled={formData.estado == 'atendido' ? true : false}>{formData.estado == 'atendido' ? 'atendido' : 'atender'}</Button>
                    </CardHeader>
                    <Divider />

                    <CardBody>

                        <Input
                            id="titulo"
                            name="titulo"
                            label="Titulo del evento"
                            className="mb-2"
                            value={formData.titulo}
                            onChange={handleChange}
                            variant="bordered"
                            isDisabled={formData.usuario_creacion == session.user.id ? false : true}
                            type="email" />


                        <Select
                            labelId="sucursal"
                            id="sucursal"
                            name="sucursal"
                            label="Sucursal"
                            value={formData.sucursal}
                            onChange={handleChange}
                            disabled={formData.usuario_creacion == session.user.id ? false : true}
                            fullWidth={true}
                            size='small'
                            className="mb-4"
                        >
                            <MenuItem value={'veracruz'}>Veracruz</MenuItem>
                            <MenuItem value={'manzanillo'}>Manzanillo</MenuItem>
                            <MenuItem value={'mexico'}>México</MenuItem>
                        </Select>

                        <Autocomplete
                            disabled={formData.usuario_creacion == session.user.id ? false : true}
                            id="id_tipo_evento"
                            name="id_tipo_evento"
                            size='small'
                            value={tipo_eventos.find(option => option.value === formData.id_tipo_evento) || null}
                            onChange={(event, newValue) => {
                                setFormData({
                                    ...formData,
                                    id_tipo_evento: newValue ? newValue.value : ''
                                });
                            }} // Aquí
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

                        <Textarea
                            value={formData.descripcion}
                            onChange={handleChange}
                            className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                            label="Descripción del evento"
                            name="descripcion"
                            labelPlacement="outside"
                            placeholder="Ingresa detalles acerca del evento"
                            isDisabled={formData.usuario_creacion == session.user.id ? false : true}
                            variant={"bordered"}
                        />
                    </CardBody>
                </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
                <h1>Seguimiento</h1>

                {isLoading ? (
                    <CircularProgress />
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
                                                <Avatar
                                                    radius="full"
                                                    size="md"
                                                    src="/broken-image.jpg"
                                                />
                                                <div className="flex flex-col gap-1 items-start justify-center">
                                                    <h4 className="text-small font-semibold leading-none text-default-600"> ({comentario.usuario.id_usuario}) {comentario.usuario.nombre}</h4>
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
                                <Textarea
                                    value={comentario}
                                    onChange={handleComentarioChange}
                                    className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                                    label="Comentarios"
                                    labelPlacement="outside"
                                    placeholder="Ingresa tu comentario"
                                    variant={"bordered"}
                                />
                            </Grid>

                            <Grid item>
                                <Button color="primary" onClick={GuardarComentario}>Guardar comentario</Button>
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
