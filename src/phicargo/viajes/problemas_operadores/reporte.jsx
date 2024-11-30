import React, { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    Grid,
    TextField,
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import axios from "axios";
import { toast } from 'react-toastify';
const { VITE_PHIDES_API_URL } = import.meta.env;

export default function ReporteOperador({ id_reporte, open, onClose }) {

    const [isLoading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        id_reporte: "",
        atendido: "",
        fecha_creacion: "",
        referencia: "",
        nombre_operador: "",
        unidad: "",
        comentarios_operador: "",
        comentarios_monitorista: "",
        usuario_resolvio: "",
        fecha_atendido: "",
    });

    const getEstatus = async () => {
        try {
            setLoading(true);
            const response = await fetch(VITE_PHIDES_API_URL + '/viajes/problemas_operadores/getReporte.php', {
                method: 'POST',
                body: new URLSearchParams({
                    id_reporte: id_reporte
                }),
            })
            const jsonData = await response.json();
            setFormData(jsonData);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error al obtener los datos:', error);
        }
    };

    useEffect(() => {
        getEstatus();
    }, [id_reporte]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Datos del formulario:", formData);

        try {
            setLoading(true);
            const response = await fetch(VITE_PHIDES_API_URL + '/viajes/problemas_operadores/atenderReporte.php', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                onClose();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error en la comunicación con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth={true}
            maxWidth={"lg"}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle>
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-sm mb-2 mb-sm-0">
                            <h2 className="page-header-title">
                                Reporte: Operador tiene un problema
                            </h2>
                        </div>
                        <div className="col-sm-auto">
                            <Button
                                disabled={formData.atendido == true ? true : false}
                                variant="contained"
                                color="error"
                                onClick={handleSubmit}
                            >
                                Atender
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogTitle>
            <DialogContent>
                <form id="formrpo">
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={6}>
                            <Card>
                                <CardContent>
                                    <Box mb={3}>
                                        <input type="text" id="id_reporte" name="id_reporte" value={formData.id_reporte} disabled />
                                    </Box>
                                    <Box mb={3}>
                                        <Typography variant="subtitle1">Fecha del reporte</Typography>
                                        <TextField
                                            fullWidth
                                            id="fecha_creacion"
                                            name="fecha_creacion"
                                            size="small"
                                            variant="standard"
                                            disabled
                                            value={formData.fecha_creacion}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box mb={3}>
                                        <Typography variant="subtitle1">Referencia de viaje</Typography>
                                        <TextField
                                            fullWidth
                                            id="referencia"
                                            name="referencia"
                                            size="small"
                                            variant="standard"
                                            disabled
                                            value={formData.referencia}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box mb={3}>
                                        <Typography variant="subtitle1">Operador</Typography>
                                        <TextField
                                            fullWidth
                                            id="nombre_operador"
                                            name="nombre_operador"
                                            size="small"
                                            variant="standard"
                                            disabled
                                            value={formData.nombre_operador}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box mb={3}>
                                        <Typography variant="subtitle1">Unidad</Typography>
                                        <TextField
                                            fullWidth
                                            id="unidad"
                                            name="unidad"
                                            size="small"
                                            variant="standard"
                                            disabled
                                            value={formData.unidad}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} lg={6}>
                            <Card>
                                <CardContent>
                                    <Box mb={3}>
                                        <Typography variant="subtitle1">Comentarios del operador</Typography>
                                        <TextField
                                            fullWidth
                                            id="comentarios_operador"
                                            name="comentarios_operador"
                                            variant="outlined"
                                            multiline
                                            rows={4}
                                            disabled
                                            value={formData.comentarios_operador}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box mb={3}>
                                        <Typography variant="subtitle1">Comentarios del monitorista</Typography>
                                        <TextField
                                            disabled={formData.atendido == true ? true : false}
                                            fullWidth
                                            id="comentarios_monitorista"
                                            name="comentarios_monitorista"
                                            variant="outlined"
                                            multiline
                                            rows={4}
                                            value={formData.comentarios_monitorista}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box mb={3}>
                                        <Typography variant="subtitle1">Atendido por</Typography>
                                        <TextField
                                            fullWidth
                                            id="usuario_resolvio"
                                            name="usuario_resolvio"
                                            size="small"
                                            variant="standard"
                                            disabled
                                            value={formData.usuario_resolvio}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box mb={3}>
                                        <Typography variant="subtitle1">Fecha de atención</Typography>
                                        <TextField
                                            fullWidth
                                            id="fecha_atendido"
                                            name="fecha_atendido"
                                            size="small"
                                            variant="standard"
                                            disabled
                                            value={formData.fecha_atendido}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Salir</Button>
            </DialogActions>
        </Dialog>
    );
}
