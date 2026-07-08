import { Avatar, Progress } from "@heroui/react";
import { Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";
import React, { useEffect } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import odooApi from '@/api/odoo-api';
import { tiempoTranscurrido } from '../../funciones/tiempo';
import { Estatus } from "./type";
import { Dialog, DialogContent } from "@mui/material";
import ArchivosAdjuntos from "@/phicargo/viajes/estatus/archivos_adjuntos";

function EstatusHistorialAgrupado({ id_reporte, open, handleClose }: { id_reporte: number, open: boolean, handleClose: () => void }) {

    const [estatus, setEstatus] = React.useState<Estatus[]>([]);
    const [isLoading, setLoading] = React.useState(false);

    useEffect(() => {
        getEstatus();
    }, [id_reporte]);

    const getEstatus = async () => {
        if (!id_reporte) return;

        try {
            setLoading(true);
            const response = await odooApi.get('/maniobras/reportes_estatus_maniobras/id_reporte/' + id_reporte);
            setEstatus(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error al obtener los datos:', error);
        }
    };

    return (
        <>
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                fullWidth={true}
                maxWidth={"md"}
            >
                <DialogTitle
                    sx={{
                        background: "linear-gradient(90deg, #002887 0%, #0059b3 100%)",
                        color: "white",
                        fontFamily: "Inter",
                    }}>
                    Detalle de estatus
                </DialogTitle>
                <DialogContent>
                    {isLoading && (
                        <Progress size="sm" isIndeterminate />
                    )}
                    {!isLoading && (
                        <div>
                            {estatus.map((step) => (
                                <div key={step.id_reporte} className="mt-5">
                                    <div className="d-flex align-items-start mt-3">
                                        <Card className="max-w-full m-3 w-100">
                                            <CardHeader className="justify-between">
                                                <div className="flex gap-5">
                                                    <Avatar
                                                        color="success"
                                                        isBordered
                                                        radius="full"
                                                        size="md"
                                                    />
                                                    <div className="flex flex-col gap-1 items-start justify-center">
                                                        <h4 className="text-small font-semibold leading-none text-default-600">
                                                            {step.nombre_estatus}
                                                        </h4>
                                                        <h5 className="text-small tracking-tight text-default-400">
                                                            {step.nombre}
                                                        </h5>
                                                    </div>
                                                </div>
                                                {tiempoTranscurrido(step.fecha_hora)}
                                            </CardHeader>
                                            <CardBody className="text-small text-default-500">
                                                {step.comentarios_estatus && (
                                                    <Chip color='success' className='text-white' size='sm'>{step.comentarios_estatus}</Chip>
                                                )}
                                                <span>Referencia reporte: {step.id_reporte}</span>
                                                <span>Placas: {step.placas}</span>
                                                <span>Coordenadas: {step.latitud}, {step.longitud}</span>
                                                <span>Localidad: {step.localidad}</span>
                                                <span>Sublocalidad: {step.sublocalidad}</span>
                                                <span>Calle: {step.calle}</span>
                                                <span>Codigo postal: {step.codigo_postal}</span>
                                                <span>Fecha y hora: {step.fecha_hora}</span>

                                                < ArchivosAdjuntos id_reporte={step.id_reporte} tabla="reportes_estatus_maniobras"></ArchivosAdjuntos>
                                            </CardBody>
                                            <CardFooter className="gap-3">
                                            </CardFooter>
                                        </Card>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EstatusHistorialAgrupado;
