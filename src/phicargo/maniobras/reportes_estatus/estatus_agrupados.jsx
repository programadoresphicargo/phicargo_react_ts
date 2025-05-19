import { Accordion, AccordionItem, Avatar } from "@heroui/react";
import { Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button } from "@heroui/react";
import { CircularProgress } from "@heroui/react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import axios from 'axios';
import odooApi from '@/api/odoo-api';
import { tiempoTranscurrido } from '../../funciones/tiempo';

function EstatusHistorialAgrupado({ id_reporte }) {

    const [open, setOpen] = React.useState(false);
    const [estatus, setEstatus] = React.useState([]);
    const [isLoading, setLoading] = React.useState(false);

    const [comentarios, setComentarios] = useState('');
    const [estatus_seleccionado, setEstatusSeleccionado] = useState(null);
    const [fileList, setFileList] = useState([]);

    const handleClickOpen = (id_reporte) => {
        setOpen(true);
        getEstatusReenvio(id_reporte);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getEstatus();
    }, [id_reporte]);

    const getEstatus = async () => {

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
            <DialogTitle sx={{ m: 0, p: 2, fontFamily: 'Inter' }} id="customized-dialog-title">
                Detalle de estatus
            </DialogTitle>

            {isLoading && (
                <div style={{ marginTop: '20px' }} className="d-flex justify-content-center">
                    <CircularProgress size="lg" aria-label="Loading..." />
                </div>
            )}

            {!isLoading && (
                <div>
                    {estatus.map((step, index) => (
                        <div key={step.id_reporte} className="mb-4">
                            <div className="d-flex align-items-start mt-3">
                                <Card className="max-w-full m-3 w-100">
                                    <CardHeader className="justify-between">
                                        <div className="flex gap-5">
                                            <Avatar
                                                isBordered
                                                radius="full"
                                                size="md"
                                                src="/img/operador.png"
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
                                        <Chip color='success' className='text-white' size='sm'>{step.comentarios_estatus}</Chip>
                                        <span>Referencia reporte: {step.id_reporte}</span>
                                        <span>Placas: {step.placas}</span>
                                        <span>Coordenadas: {step.latitud}, {step.longitud}</span>
                                        <span>Localidad: {step.localidad}</span>
                                        <span>Sublocalidad: {step.sublocalidad}</span>
                                        <span>Calle: {step.calle}</span>
                                        <span>Codigo postal: {step.codigo_postal}</span>
                                        <span>Fecha y hora: {step.fecha_hora}</span>
                                    </CardBody>
                                    <CardFooter className="gap-3">
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default EstatusHistorialAgrupado;
