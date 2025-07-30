import {
    Button,
    Checkbox,
    DateRangePicker
} from '@heroui/react';
import {
    Dialog,
    DialogContent,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Slide
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import { parseDate } from "@internationalized/date";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import Swal from "sweetalert2";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AbrirPeriodo = ({ fetchData, open, close }) => {

    const [isLoading, setLoading] = useState(false);
    const [isLoadingMovedores, setLoadingMovedores] = useState(false);

    const [movedores, setMovedores] = useState([]);
    const [movedoresSeleccionados, setMovedoresSeleccionados] = useState([]);

    const toggleSeleccion = (id) => {
        setMovedoresSeleccionados((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id) // lo quita si ya estaba
                : [...prev, id] // lo agrega si no estaba
        );
    };

    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + 7);

    const format = (date) => date.toISOString().split('T')[0];

    const [value, setValue] = useState({
        start: parseDate(format(start)),
        end: parseDate(format(end)),
    });

    const abrirPeriodo = async () => {

        if (movedoresSeleccionados.length === 0) {
            toast.warning('Selecciona al menos un movedor');
            return;
        }

        try {
            const query = new URLSearchParams({
                fecha_inicio: value.start.toString(),
                fecha_fin: value.end.toString(),
            });

            const payload = movedoresSeleccionados.map((id) => ({ id }));
            setLoading(true);
            const response = await odooApi.post(
                `/maniobras/periodos_pagos_maniobras/?${query.toString()}`,
                payload
            );
            if (response.data.status === 'success') {
                toast.success(response.data.message);
                fetchData();
                setOpen(false);
            } else {
                toast.error(response.data.message);
                if (response.data.message == "pendiente cierre") {
                    const maniobras = response.data.maniobras;

                    const htmlList = maniobras.map(m => `
                        <li>
                            <strong>ID Maniobra:</strong> ${m.id_maniobra} |
                            <strong>Estado:</strong> ${m.estado_maniobra} |
                            <strong>Inicio programado:</strong> ${m.inicio_programado}
                            <strong>Operador:</strong> ${m.operador}
                            <strong>Registro:</strong> ${m.usuarioregistro}
                        </li>
                    `).join('');

                    Swal.fire({
                        title: "<strong>Maniobras pendientes de cierre, finalice estas maniobras para abrir periodos de nomina</strong>",
                        icon: "info",
                        html: `<ul style="text-align:center">${htmlList}</ul>`,
                        width: '1800px',
                        showCloseButton: true,
                        focusConfirm: false,
                        confirmButtonText: `
                          <i class="fa fa-thumbs-up"></i> OK
                        `,
                        confirmButtonAriaLabel: "Thumbs up, great!",
                        cancelButtonText: `
                          <i class="fa fa-thumbs-down"></i>
                        `,
                        cancelButtonAriaLabel: "Thumbs down"
                    });
                }
            }
        } catch (error) {
            console.error('Error al abrir periodo:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMovedores = async () => {
        try {
            setLoadingMovedores(true);
            const response = await odooApi.get('/drivers/job_id/26');
            setMovedores(response.data);
        } catch (error) {
            console.error('Error al obtener movedores:', error);
        } finally {
            setLoadingMovedores(false);
        }
    };

    useEffect(() => {
        getMovedores();
    }, []);

    return (
        <>
            <Dialog
                fullWidth
                open={open}
                onClose={() => close(false)}
                TransitionComponent={Transition}
                scroll="body"
            >
                <AppBar sx={{ position: 'relative' }} elevation={0}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => close(false)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Nuevo periodo de pago
                        </Typography>
                    </Toolbar>
                </AppBar>

                <DialogContent>
                    <div className="px-2 py-4 w-full">
                        <h3 className="text-lg font-semibold mb-2">Lista de Movedores ACTIVOS</h3>

                        {isLoadingMovedores ? (
                            <p>Cargando...</p>
                        ) : (
                            <ul className="mb-4">
                                {movedores.map((movedor) => (
                                    <li key={movedor.id}>
                                        <Checkbox
                                            isSelected={movedoresSeleccionados.includes(movedor.id)}
                                            onChange={() => toggleSeleccion(movedor.id)}
                                        >
                                            {movedor.name ?? JSON.stringify(movedor)}
                                        </Checkbox>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <DateRangePicker
                            label="Periodo"
                            value={value}
                            onChange={setValue}
                            variant='bordered'
                            className="mb-4"
                        />

                        <Button
                            fullWidth
                            color="primary"
                            isLoading={isLoading}
                            onPress={() => abrirPeriodo()}
                        >
                            Confirmar apertura
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AbrirPeriodo;
