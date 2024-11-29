import React, { useState, useEffect, useMemo, useContext } from 'react';
import { ViajeContext } from '../context/viajeContext';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { Button } from '@nextui-org/button';
import EstatusHistorialAgrupado from './estatus_agrupados';
import { tiempoTranscurrido } from '../../../funciones/tiempo';

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
                        if (step.id_usuario == 172 || step.id_usuario == 8) return "bg-primary";
                        if ([5, 6].includes(step.department_id)) return "bg-success";
                        return "bg-morado";
                    };

                    return (
                        <li className="step-item mb-3" onClick={() => handleClickOpen(step.id_reportes_agrupados, "body")} key={index}>
                            <div className="step-content-wrapper">
                                <div className="step-avatar">
                                    <img
                                        src={`/phicargo/img/status/${step.imagen}`}
                                        alt="Image Description"
                                    />
                                </div>
                                <div className="step-content">
                                    <div className="items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                                        <span className={`${getBadgeClass()} badge rounded-pill`}>
                                            {step.nombre_estatus}
                                            {step.registros > 1 && (
                                                <span className="bg-danger badge rounded-pill">{step.registros}</span>
                                            )}
                                        </span>

                                        <time className="mb-1 text-xs font-normal text-gray-700 sm:order-last sm:mb-0">
                                            {step.name || step.nombre}
                                            | {tiempoTranscurrido(step.ultima_fecha_envio)}
                                        </time>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </>
    )
}

export default EstatusHistorial;
