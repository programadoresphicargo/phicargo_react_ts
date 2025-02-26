import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import { toast } from 'react-toastify';
import { useAuthContext } from "../../modules/auth/hooks";
import { Button, Card, CardBody, Input, Textarea } from "@heroui/react";
const { VITE_PHIDES_API_URL } = import.meta.env;

export default function ReporteOperador({ id_reporte, open, onClose }) {

    const { session } = useAuthContext();
    const [isLoading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        id_reporte: "",
        id_usuario: session.user.id,
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
                                color="danger"
                                onPress={handleSubmit}
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
                                <CardBody>
                                    <Box mb={3}>
                                        <Input type="text"
                                            id="id_reporte"
                                            label="ID reporte"
                                            variant="bordered"
                                            value={formData.id_reporte}
                                            disabled />
                                    </Box>
                                    <Box mb={2}>
                                        <Input
                                            fullWidth
                                            id="fecha_creacion"
                                            label="Fecha creacion"
                                            variant="bordered"
                                            disabled
                                            value={formData.fecha_creacion}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box mb={2}>
                                        <Input
                                            id="referencia"
                                            label="Referencia de viaje"
                                            variant="bordered"
                                            disabled
                                            value={formData.referencia}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box mb={2}>
                                        <Input
                                            id="nombre_operador"
                                            label="Operador"
                                            variant="bordered"
                                            disabled
                                            value={formData.nombre_operador}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box mb={2}>
                                        <Input
                                            id="unidad"
                                            label="Unidad"
                                            variant="bordered"
                                            disabled
                                            value={formData.unidad}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                </CardBody>
                            </Card>
                        </Grid>

                        <Grid item xs={12} lg={6}>
                            <Card>
                                <CardBody>
                                    <Box mb={3}>
                                        <Textarea
                                            id="comentarios_operador"
                                            label="Comentarios operador"
                                            variant="bordered"
                                            multiline
                                            rows={4}
                                            disabled
                                            value={formData.comentarios_operador}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box mb={3}>
                                        <Textarea
                                            disabled={formData.atendido == true ? true : false}
                                            id="comentarios_monitorista"
                                            label="Comentarios Monitorista"
                                            variant="bordered"
                                            multiline
                                            rows={5}
                                            value={formData.comentarios_monitorista}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box mb={3}>
                                        <Input
                                            id="usuario_resolvio"
                                            label="Usuario resolvio"
                                            variant="bordered"
                                            disabled
                                            value={formData.usuario_resolvio}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box mb={3}>
                                        <Input
                                            id="fecha_atendido"
                                            label="Fecha atendido"
                                            variant="bordered"
                                            disabled
                                            value={formData.fecha_atendido}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                </CardBody>
                            </Card>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onPress={onClose} color="danger">Salir</Button>
            </DialogActions>
        </Dialog>
    );
}
