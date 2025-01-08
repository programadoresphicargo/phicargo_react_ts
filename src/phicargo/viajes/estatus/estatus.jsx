import React, { useState, useEffect, useMemo, useContext } from 'react';
import { ViajeContext } from '../context/viajeContext';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { Button } from '@nextui-org/button';
import EstatusHistorialAgrupado from './estatus_agrupados';
import { tiempoTranscurrido } from '../../funciones/tiempo';
import { Card, CardHeader } from '@nextui-org/react';
import { Avatar } from '@nextui-org/react';
import { Badge } from '@nextui-org/react';
const { VITE_PHIDES_API_URL } = import.meta.env;

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function EstatusHistorial() {

    const { id_viaje, estatusHistorial, getHistorialEstatus } = useContext(ViajeContext);
    const [id_reportes_agrupados, setEstatusAgrupados] = useState([]);

    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');

    const handleClickOpen = (id_registros, scrollType) => {
        setOpen(true);
        setScroll(scrollType);
        setEstatusAgrupados(id_registros);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getHistorialEstatus();
    }, []);

    return (
        <>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                scroll={scroll}
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
                <DialogContent dividers={scroll === 'paper'}>
                    <EstatusHistorialAgrupado registros_agrupados={id_reportes_agrupados}></EstatusHistorialAgrupado>
                </DialogContent>
            </Dialog>
            <ol className="step">
                {estatusHistorial.map((step, index) => {

                    const getBadgeClass = () => {
                        if (step.id_usuario == 172 || step.id_usuario == 8) return "primary";
                        if ([5, 6].includes(step.department_id)) return "success";
                        return "secondary";
                    };

                    return (
                        <Card className="mb-2 w-full" isPressable onClick={() => handleClickOpen(step.id_reportes_agrupados, "body")}>
                            <CardHeader className="justify-between">
                                <div className="flex gap-5">
                                    <Badge color="danger" content={step.registros} placement="top-right" isInvisible={step.registros > 1 ? false : true}>
                                        <Avatar
                                            color={`${getBadgeClass()}`}
                                            isBordered
                                            radius="full"
                                            size="md"
                                            src={VITE_PHIDES_API_URL + `/img/status/${step.imagen}`}
                                        />
                                    </Badge>
                                    <div className="flex flex-col gap-1 items-start justify-center">
                                        <h4 className="text-small font-semibold leading-none text-default-600">{step.nombre_estatus}</h4>
                                        <h5 className="text-small tracking-tight text-default-400">
                                            {step.department_id === 5 || step.department_id === 6 ? step.name : step.nombre}
                                        </h5>
                                    </div>
                                </div>

                                {tiempoTranscurrido(step.ultima_fecha_envio)}
                            </CardHeader>
                        </Card>
                    );
                })}
            </ol>
        </>
    )
}

export default EstatusHistorial;
