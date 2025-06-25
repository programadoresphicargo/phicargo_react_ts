import { DatePicker, NumberInput, Button } from "@heroui/react";
import { now, getLocalTimeZone } from "@internationalized/date";
import Slide from '@mui/material/Slide';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ViajeContext } from "../context/viajeContext";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FormularioCorte = ({ opened, onClose }) => {
    const { id_viaje, viaje, getViaje, loading, error, setIDViaje, isLoading } = useContext(ViajeContext);
    const [fechaCorte, setFechaCorte] = useState(now(getLocalTimeZone()));
    const [costo, setCosto] = React.useState();

    const obtenerCorteEstadias = async ({ id_viaje, fecha_corte, costo }) => {
        try {
            const params = new URLSearchParams({
                id_viaje: id_viaje.toString(),
                fecha_corte,
                costo: costo.toString(),
            });

            const url = `http://localhost:8000/tms_travel/estadias/cortes/?${params.toString()}`;

            const response = await axios.get(url);
            console.log('Respuesta del servidor:', response.data);

            toast.success("Datos obtenidos correctamente");
            return response.data;
        } catch (error) {
            console.error("Error al obtener los datos del corte:", error);
            toast.error("Error al obtener los datos del corte");
            return null;
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
                        variant="bordered"
                        hideTimeZone
                        value={fechaCorte}
                        onChange={setFechaCorte}
                        showMonthAndYearPickers
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
                        onPress={obtenerCorteEstadias}
                    >
                        Generar
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FormularioCorte;
