import { Chip } from "@heroui/react";
import { Card, CardHeader } from "@heroui/react";
import React, { useEffect } from 'react';
import { Avatar } from "@heroui/react";
import { Button } from "@heroui/react";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import EstatusHistorialAgrupado from './estatus_agrupados';
import { Stack } from 'rsuite';
import odooApi from '@/api/odoo-api';
import { tiempoTranscurrido } from '../../funciones/tiempo';
import { Estatus } from "./type";

const { VITE_ODOO_API_URL } = import.meta.env;

function EstatusHistorialManiobras({ id_maniobra }: { id_maniobra: number }) {

    const [estatusHistorial, setHistorial] = React.useState<Estatus[]>([]);
    const [id_reporte, setReporte] = React.useState<number | null>(null);
    const [open, setOpen] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);

    const handleClickOpen = (id_registro: number) => {
        setOpen(true);
        setReporte(id_registro);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getHistorialEstatus = async () => {
        if (!id_maniobra) return;

        try {
            setLoading(true);
            const response = await odooApi.get('/maniobras/reportes_estatus_maniobras/id_maniobra/' + id_maniobra)
            setHistorial(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error al obtener los datos:', error);
        }
    };

    useEffect(() => {
        getHistorialEstatus();
    }, []);

    return (
        <>
            <Stack className='mb-3'>
                <Button color='primary' onPress={getHistorialEstatus} isLoading={isLoading} radius="full" size="sm">Actualizar</Button>
            </Stack>
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                fullWidth={true}
                maxWidth={"md"}
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '20px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.0)',
                    },
                }}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    },
                }}
            >
                <DialogContent>
                    {id_reporte && (
                        <EstatusHistorialAgrupado id_reporte={id_reporte}></EstatusHistorialAgrupado>
                    )}
                </DialogContent>
            </Dialog>

            <ol className="step">
                {estatusHistorial.map((step) => {

                    const getBadgeClass = () => {
                        if (step.id_usuario == 172 || step.id_usuario == 8) return "primary";
                        if ([5, 6].includes(step.department_id)) return "success";
                        return "secondary";
                    };

                    return (
                        <Card className="mb-2 w-full" isPressable onClick={() => handleClickOpen(step.id_reporte)}>
                            <CardHeader className="justify-between">
                                <div className="flex gap-5">
                                    <Avatar
                                        color={`${getBadgeClass()}`}
                                        isBordered
                                        radius="full"
                                        size="sm"
                                        src={VITE_ODOO_API_URL + `/assets/trafico/estatus_operativos/${step.imagen}`}
                                    />
                                    <div className="flex flex-col gap-1 items-start justify-center">
                                        <h4 className="text-small font-semibold leading-none text-default-600">{step.nombre_estatus}</h4>
                                        {step.comentarios_estatus != '' && (
                                            <Chip color='success' className='text-white' size='sm'>
                                                {step.comentarios_estatus}
                                            </Chip>
                                        )}
                                        <h5 className="text-small tracking-tight text-default-400">
                                            {step.nombre}
                                        </h5>
                                    </div>
                                </div>
                                {tiempoTranscurrido(step.fecha_hora)}
                            </CardHeader>
                        </Card>
                    );
                })}
            </ol>
        </>
    )
}

export default EstatusHistorialManiobras;
