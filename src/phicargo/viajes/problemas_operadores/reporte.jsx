import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { Button, Card, CardBody, Input, Textarea } from "@heroui/react";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader
} from "@heroui/modal";
import React, { useEffect, useState } from "react";

import { Progress } from "@heroui/react";
import axios from "axios";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useAuthContext } from "@/modules/auth/hooks";

export default function ReporteOperador({ id_reporte, isOpen, onOpenChange }) {

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
            const response = await odooApi.get('/problemas_operadores/by_id_reporte/' + id_reporte);
            setFormData(response.data);
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

    const AtenderReporte = async () => {
        if (!formData.comentarios_monitorista) {
            toast.error("El comentario del monitorista es obligatorio.");
            return;
        }
        try {
            setLoading(true);
            const response = await odooApi.get(`/problemas_operadores/atender/${formData.id_reporte}`, {
                params: {
                    comentarios_monitorista: formData.comentarios_monitorista
                }
            });

            const data = response.data;

            if (data.success) {
                toast.success(data.message);
                onOpenChange(); 
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error en la comunicación con el servidor: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Operador tengo un problema</ModalHeader>
                            {isLoading && <Progress isIndeterminate size="sm" color="danger" />}
                            <ModalBody>
                                <div className="page-header">
                                    <div className="row align-items-center">
                                        <div className="col-sm-auto">
                                            <Button
                                                disabled={formData.atendido == true ? true : false}
                                                color="danger"
                                                onPress={AtenderReporte}
                                            >
                                                Atender
                                            </Button>
                                        </div>
                                    </div>
                                </div>
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
                                                        label="Comentarios Monitorista / Ejecutivo"
                                                        variant="bordered"
                                                        multiline
                                                        rows={5}
                                                        name="comentarios_monitorista"
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
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}