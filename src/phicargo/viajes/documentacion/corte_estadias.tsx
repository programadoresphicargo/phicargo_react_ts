import { DatePicker, NumberInput, Button } from "@heroui/react";
import React, { useContext, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ViajeContext } from "../context/viajeContext";
import toast from 'react-hot-toast';
import { parseDateTime, getLocalTimeZone, DateValue } from "@internationalized/date";

const { VITE_ODOO_API_URL } = import.meta.env;

const FormularioCorte = ({ opened, onClose }: { opened: boolean, onClose: () => void }) => {

    function getLocalISOString() {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const localDate = new Date(now.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 19);
    }

    const { id_viaje } = useContext(ViajeContext);
    const [fechaCorte, setFechaCorte] = useState(getLocalISOString());
    const [costo, setCosto] = React.useState<number>(0);

    const updateFecha = (newValue: DateValue | null) => {
        if (!newValue) return;
        const date = newValue.toDate(getLocalTimeZone());
        const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        setFechaCorte(formatted);
    };

    const obtenerCorteEstadias = () => {

        if (costo <= 0) {
            toast.error("Ingrese un costo válido");
            return;
        }

        const params = new URLSearchParams();
        params.append('id_viaje', id_viaje);
        params.append('fecha_corte', fechaCorte);
        params.append('costo', String(costo));

        const url = VITE_ODOO_API_URL + `/tms_travel/estadias/cortes/?${params.toString()}`;

        window.open(url, '_blank');
        toast.success("Se abrió la pestaña con el corte de estadías");
        
    };

    return (
        <>
            <Dialog
                open={opened}
                keepMounted
                onClose={onClose}
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
                        radius="full"
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
