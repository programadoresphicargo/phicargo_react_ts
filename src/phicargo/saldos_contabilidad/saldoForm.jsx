import React, { useState, useEffect } from "react";
import { Grid, Stack } from "@mui/material";
import { toast } from "react-toastify";
import odooApi from "../modules/core/api/odoo-api";
import { Input, Button, DateInput, DatePicker, Chip } from "@nextui-org/react";
import { useDateFormatter } from "@react-aria/i18n";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import { Progress } from "@nextui-org/react";

const SaldoForm = ({ id_cuenta, referencia, onClose }) => {

    const [loading, setLoading] = useState(false);

    const [loadingSaldo, setLoadingSaldo] = useState(false);

    const currentDate = today(getLocalTimeZone());
    const [value, setValue] = useState(currentDate);
    const [formData, setFormData] = useState({
        id_saldo: "",
        id_cuenta: id_cuenta || "",
        fecha: value.toString(),
        saldo: 0.0,
        id_usuario: "",
        disponible: 0.0,
        utilizado: 0.0,
    });

    let formatter = useDateFormatter({ dateStyle: "full" });

    const actualizarSaldo = async () => {
        try {
            setLoading(true);
            const response = await odooApi.post(`/saldos/actualizar_saldo/`, formData);
            const data = response.data || response;
            if (data.mensaje === "Saldo actualizado exitosamente") {
                toast.success(data.mensaje);
                onClose();
            } else {
                toast.error(data.mensaje);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error("Error de conexión: " + error.message);
        }
    };

    const getSaldoCuentaByFecha = async () => {
        try {
            setLoadingSaldo(true);
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
                    saldo: 0.0,
                    id_usuario: "",
                    disponible: 0.0,
                    utilizado: 0.0,
                });
                console.log("No se encontraron datos para la cuenta y fecha especificadas.");
            }
            setLoadingSaldo(false);
        } catch (error) {
            setLoadingSaldo(false);
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
                <Chip color="primary" size="lg">Cuenta - {referencia}</Chip>
                {loadingSaldo && (
                    <Progress
                        isIndeterminate
                        label="Obteniendo saldo..."
                        className="mt-3"
                        size="sm"
                    />
                )}
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
                    <Button color="primary" onClick={actualizarSaldo} isLoading={loading}>
                        Actualizar saldo
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default SaldoForm;
