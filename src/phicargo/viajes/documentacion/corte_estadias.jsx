import { DatePicker, NumberInput, Button } from "@heroui/react";
import Slide from '@mui/material/Slide';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ViajeContext } from "../context/viajeContext";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import odooApi from "@/api/odoo-api";
import { parseDate, parseDateTime, getLocalTimeZone } from "@internationalized/date";

const { VITE_ODOO_API_URL } = import.meta.env;

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FormularioCorte = ({ opened, onClose }) => {

    function getLocalISOString() {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const localDate = new Date(now.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 19);
    }

    const { id_viaje, viaje, getViaje, loading, error, setIDViaje, isLoading } = useContext(ViajeContext);
    const [fechaCorte, setFechaCorte] = useState(getLocalISOString());
    const [costo, setCosto] = React.useState();

    const updateFecha = (newValue) => {
        const date = newValue.toDate(getLocalTimeZone());
        const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        setFechaCorte(formatted);
    };

    const obtenerCorteEstadias = () => {
        try {
            const params = new URLSearchParams();
            params.append('id_viaje', id_viaje);
            params.append('fecha_corte', fechaCorte);
            params.append('costo', costo);

            const url = VITE_ODOO_API_URL + `/tms_travel/estadias/cortes/?${params.toString()}`;

            window.open(url, '_blank');
            toast.success("Se abrió la pestaña con el corte de estadías");

        } catch (error) {
            console.error("Error al generar la URL:", error);
            toast.error("No se pudo abrir la pestaña del corte");
        }
    };

    return (
        <>
            <Dialog
                open={opened}
                TransitionComponent={Transition}
                keepMounted
                onClose={onClose}
                aria-describedby="alert-dialog-slide-description"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>{"Corte parcial de estadías"}</DialogTitle>

                <DialogContent>
                    <DatePicker
                        label="Fecha de corte"
                        value={parseDateTime(fechaCorte)}
                        onChange={updateFecha}
                        hideTimeZone
                        variant="bordered"
                    />

                    <NumberInput
                        variant="bordered"
                        label="Costo"
                        value={costo}
                        onValueChange={setCosto}
                        className="mt-4"
                    />

                    <Button
                        color="success"
                        size="lg"
                        className="text-white mt-6"
                        onPress={() => obtenerCorteEstadias()}
                    >
                        Generar
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FormularioCorte;
