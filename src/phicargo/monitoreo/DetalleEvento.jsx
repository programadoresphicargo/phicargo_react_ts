import { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid } from "@mui/material";
import axios from "axios";
import { toast } from 'react-toastify';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
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

const DetalleForm = ({ id_evento, onClose }) => {

    const [comentario, setComentario] = useState('');
    const [comentarios, setComentarios] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleComentarioChange = (event) => {
        setComentario(event.target.value);
    };

    const initialFormData = {
        id_evento: id_evento,
        titulo: '',
        descripcion: '',
        sucursal: '',
        id_tipo_evento: '',
        estado: '',
        usuario_atendio: '',
        fecha_atencion: ''
    };

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

        axios.post('/phicargo/monitoreo/entrega_turno/guardar_comentario.php', data)
            .then((response) => {
                console.log('Respuesta exitosa:', response.data);
                setComentario('');
                obtenerComentarios();
            })
            .catch((error) => {
                console.error('Error al enviar el comentario:', error);
            });
    };

    const fetchTipoEvento = () => {
        const baseUrl = '/phicargo/monitoreo/entrega_turno/getTipoEvento.php';

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

    const obtenerEvento = () => {
        setIsLoading(true);
        const baseUrl = '/phicargo/monitoreo/entrega_turno/getEvento.php?id_evento=' + id_evento;

        axios.get(baseUrl)
            .then(response => {
                const evento = response.data[0];
                setFormData({
                    id_evento: id_evento,
                    titulo: evento.titulo || '',
                    descripcion: evento.descripcion || '',
                    sucursal: evento.sucursal || '',
                    id_tipo_evento: evento.id_tipo_evento || '',
                    estado: evento.estado || '',
                    usuario_atendio: evento.usuario_atendio || '',
                    fecha_atencion: evento.fecha_atencion || ''
                });
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Error al obtener el evento:', err);
            });
    };

    const actualizarEvento = () => {
        setIsLoading(true);
        axios.post('/phicargo/monitoreo/entrega_turno/actualizarEvento.php', formData)
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

    const atenderEvento = () => {
        setIsLoading(true);
        axios.post('/phicargo/monitoreo/entrega_turno/atenderEvento.php', formData)
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
        const baseUrl = '/phicargo/monitoreo/entrega_turno/getComentarios.php?id_evento=' + id_evento;

        axios.get(baseUrl)
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
                <Stack spacing={2} direction="row">
                    <h1>Evento E-{id_evento}</h1>
                    <Button variant="contained" onClick={actualizarEvento}>Actualizar</Button>
                    <Button variant="contained" onClick={atenderEvento} disabled={formData.estado == 'atendido' ? true : false}>Atender</Button>
                </Stack>
            </Grid>

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
                    onChange={handleChange} // Aquí
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
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
                <TextField
                    label="Descripcion"
                    placeholder="Ingresa detalles acerca del evento"
                    multiline={true}
                    rows={4}
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange} // Aquí
                    fullWidth={true}
                />
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
                                    <Paper style={{ padding: "20px 20px 0px 20px", marginTop: 10 }} variant="outlined">
                                        <Grid container spacing={2}>
                                            <Grid item>
                                                <Avatar alt={comentario.nombre} sx={{ bgcolor: green[500] }} src="/broken-image.jpg" />
                                            </Grid>
                                            <Grid justifyContent="left" item>
                                                <h4 style={{ margin: 0, textAlign: "left" }}>
                                                    ({comentario.id_usuario}) {comentario.nombre}
                                                </h4>
                                                <p style={{ textAlign: "left" }}>{comentario.comentario}</p>
                                                <p style={{ textAlign: "left", color: "gray" }}>{comentario.fecha_creacion}</p>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </TimelineContent>
                            </TimelineItem>
                        </Timeline>
                    ))
                )}
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
                <Card variant="outlined">
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Avatar src="/broken-image.jpg" />
                            </Grid>

                            <Grid item xs>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Comentarios"
                                    fullWidth={true}
                                    multiline
                                    rows={4}
                                    value={comentario}
                                    onChange={handleComentarioChange}
                                />
                            </Grid>

                            <Grid item>
                                <Button variant="contained" onClick={GuardarComentario}>Guardar</Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

        </Grid>
    </>
    );
};

export default DetalleForm;
