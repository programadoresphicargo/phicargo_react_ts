import React, { useState, useEffect } from "react";
import { Grid, Stack } from "@mui/material";
import { toast } from "react-toastify";
import odooApi from "../modules/core/api/odoo-api";
import { Input, Button, DateInput, DatePicker } from "@nextui-org/react";
import { useDateFormatter } from "@react-aria/i18n";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";

const SaldoForm = ({ id_cuenta, referencia, onClose }) => {
    const currentDate = today(getLocalTimeZone());
    const [value, setValue] = useState(currentDate);
    const [formData, setFormData] = useState({
        id_saldo: "",
        id_cuenta: id_cuenta || "",
        fecha: value.toString(),
        saldo: 0,
        id_usuario: "",
        disponible: 0,
        utilizado: 0,
    });

    let formatter = useDateFormatter({ dateStyle: "full" });

    const actualizarSaldo = async () => {
        try {
            const response = await odooApi.post(`/saldos/actualizar_saldo/`, formData);
            const data = response.data || response;
            if (data.mensaje === "Saldo actualizado exitosamente") {
                toast.success(data.mensaje);
            } else {
                toast.error(data.mensaje);
            }
        } catch (error) {
            toast.error("Error de conexión: " + error.message);
        }
    };

    const getSaldoCuentaByFecha = async () => {
        try {
            const response = await odooApi.get(
                `/saldos/get_saldo_by_cuenta_and_fecha/${id_cuenta}/${value.toString()}`
            );
            if (response.data && response.data.length > 0) {
                const saldoData = response.data[0];
                setFormData({
                    id_saldo: saldoData.id_saldo,
                    id_cuenta: saldoData.id_cuenta,
                    fecha: saldoData.fecha,
                    saldo: saldoData.saldo,
                    id_usuario: saldoData.id_usuario,
                    disponible: saldoData.disponible,
                    utilizado: saldoData.utilizado,
                });
                toast.success("Datos cargados correctamente.");
            } else {
                setFormData({
                    id_saldo: "",
                    id_cuenta: id_cuenta || "",
                    fecha: value.toString(),
                    saldo: 0,
                    id_usuario: "",
                    disponible: 0,
                    utilizado: 0,
                });
                toast.warn("No se encontraron datos para la cuenta y fecha especificadas.");
            }
        } catch (error) {
            toast.error("Error al obtener los datos: " + error.message);
        }
    };

    useEffect(() => {
        if (id_cuenta) {
            getSaldoCuentaByFecha();
        }
    }, [id_cuenta, value]);

    return (
        <Grid container spacing={2} className="mb-5">
            <Grid item xs={12}>
                <h1>{referencia}</h1>
            </Grid>
            <Grid item xs={12}>
                <DatePicker
                    label="Fecha del saldo"
                    variant="bordered"
                    value={value}
                    onChange={(newValue) => {
                        setValue(newValue);
                        setFormData({ ...formData, fecha: newValue.toString() });
                    }}
                />
                <p className="text-default-500 text-sm">
                    Fecha seleccionada: {value ? formatter.format(value.toDate(getLocalTimeZone())) : "--"}
                </p>
            </Grid>
            <Grid item xs={12}>
                <Input
                    label="Nuevo saldo"
                    variant="bordered"
                    type="number"
                    value={formData.saldo}
                    onChange={(e) =>
                        setFormData({ ...formData, saldo: e.target.value })
                    }
                />
            </Grid>
            <Grid item xs={12}>
                <Input
                    variant="bordered"
                    label="Disponible"
                    type="number"
                    value={formData.disponible}
                    onChange={(e) =>
                        setFormData({ ...formData, disponible: e.target.value })
                    }
                />
            </Grid>
            <Grid item xs={12}>
                <Stack spacing={2} direction="row">
                    <Button color="primary" onClick={actualizarSaldo}>
                        Actualizar
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default SaldoForm;
