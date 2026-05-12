import {
    Box,
    Grid,
} from "@mui/material";
import { Button, Card, CardBody, Input, Textarea } from "@heroui/react";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader
} from "@heroui/modal";
import { useEffect, useState } from "react";
import { Progress } from "@heroui/react";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import React from "react";

type Reporte = {
    id_reporte: number;
    fecha_creacion: string;
    referencia: string;
    nombre_operador: string;
    atendido: boolean;
    comentarios_monitorista: string;
    unidad: string;
    comentarios_operador: string;
    nombre_usuario_resolvio: string;
    fecha_atendido: string;
}

type Props = {
    id_reporte: number;
    isOpen: boolean;
    onOpenChange: () => void;
};

const ReporteOperador: React.FC<Props> = ({
    id_reporte,
    isOpen,
    onOpenChange
}) => {

    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState<Reporte>();

    const getEstatus = async () => {
        if (!id_reporte) return;
        try {
            setLoading(true);
            const response = await odooApi.get('/problemas_operadores/id_reporte/' + id_reporte);
            setData(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error al obtener los datos:', error);
        }
    };

    useEffect(() => {
        getEstatus();
    }, [id_reporte, open]);

    const AtenderReporte = async () => {
        if (!data?.comentarios_monitorista) {
            toast.error("El comentario del monitorista es obligatorio.");
            return;
        }
        try {
            setLoading(true);
            const response = await odooApi.get(`/problemas_operadores/atender/${data?.id_reporte}`, {
                params: {
                    comentarios_monitorista: data?.comentarios_monitorista
                }
            });

            if (response.data) {
                toast.success(response.data.message);
                onOpenChange();
            } else {
                toast.error(response.data.message);
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
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Operador tengo un problema</ModalHeader>
                            {isLoading && <Progress isIndeterminate size="sm" color="danger" />}
                            <ModalBody>
                                <div className="page-header">
                                    <div className="row align-items-center">
                                        <div className="col-sm-auto">
                                            <Button
                                                isDisabled={data?.atendido == true ? true : false}
                                                color="danger"
                                                onPress={AtenderReporte}
                                                radius="full"
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
                                                <Box mb={2}>
                                                    <Input
                                                        id="fecha_creacion"
                                                        label="Fecha creacion"
                                                        value={data?.fecha_creacion}
                                                        variant="flat"
                                                        readOnly
                                                    />
                                                </Box>
                                                <Box mb={2}>
                                                    <Input
                                                        id="referencia"
                                                        label="Viaje"
                                                        variant="flat"
                                                        readOnly
                                                        value={data?.referencia}
                                                    />
                                                </Box>
                                                <Box mb={2}>
                                                    <Input
                                                        id="nombre_operador"
                                                        label="Operador"
                                                        variant="flat"
                                                        readOnly
                                                        value={data?.nombre_operador}
                                                    />
                                                </Box>
                                                <Box mb={2}>
                                                    <Input
                                                        id="unidad"
                                                        label="Unidad"
                                                        variant="flat"
                                                        readOnly
                                                        value={data?.unidad}
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
                                                        variant="flat"
                                                        rows={4}
                                                        disabled
                                                        value={data?.comentarios_operador}
                                                    />
                                                </Box>
                                                <Box mb={3}>
                                                    <Textarea
                                                        isDisabled={data?.atendido == true ? true : false}
                                                        id="comentarios_monitorista"
                                                        label="Comentarios Monitorista / Ejecutivo"
                                                        variant="bordered"
                                                        rows={5}
                                                        name="comentarios_monitorista"
                                                        value={data?.comentarios_monitorista}
                                                        onValueChange={(value) =>
                                                            setData((prev) =>
                                                                prev
                                                                    ? { ...prev, comentarios_monitorista: value }
                                                                    : prev
                                                            )
                                                        }
                                                    />
                                                </Box>
                                                {data?.atendido && (
                                                    <>
                                                        <Box mb={3}>
                                                            <Input
                                                                id="nombre_usuario_resolvio"
                                                                label="Usuario resolvio"
                                                                variant="flat"
                                                                isReadOnly
                                                                value={data?.nombre_usuario_resolvio}
                                                            />
                                                        </Box>
                                                        <Box mb={3}>
                                                            <Input
                                                                id="fecha_atendido"
                                                                label="Fecha atendido"
                                                                variant="flat"
                                                                isReadOnly
                                                                value={data?.fecha_atendido}
                                                            />
                                                        </Box>
                                                    </>
                                                )}
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

export default ReporteOperador;