import React, { useState, useEffect } from "react";
import { Grid, Stack } from "@mui/material";
import { toast } from "react-toastify";
import odooApi from "../modules/core/api/odoo-api";
import { Input, Button, DateInput, DatePicker, Chip } from "@heroui/react";
import { useDateFormatter } from "@react-aria/i18n";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import { Progress } from "@heroui/react";
import { NumberInput } from "@heroui/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

const EstadiasForm = ({ id_viaje, referencia, onClose }) => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [tiemposViaje, SeTiemposViaje] = useState([]);

    const getDatos = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/tms_travel/reporte_estadias/', {
                params: { travel_id: id_viaje },
            });
            setData(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error("Error de conexión: " + error.message);
        }
    };

    const getTiemposViaje = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get(`/tms_travel/tiempos_viaje//` + id_viaje);
            setData(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error("Error de conexión: " + error.message);
        }
    };

    const [loadingSaldo, setLoadingSaldo] = useState(false);

    const [formData, setFormData] = useState({
        id_saldo: "",
        id_viaje: id_viaje || "",
        saldo: 0.0,
        id_usuario: "",
        disponible: 0.0,
        utilizado: 0.0,
    });

    useEffect(() => {
        getDatos();
    }, []);

    return (
        <>
            {loadingSaldo ? ( // Muestra solo el loader mientras loadingSaldo sea true
                <Grid container spacing={2} className="mb-5" justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
                    <Grid item>
                        <Progress
                            isIndeterminate
                            label="Obteniendo saldo..."
                            className="mt-3"
                            size="lg"
                        />
                    </Grid>
                </Grid>
            ) : ( // Cuando loadingSaldo sea false, muestra el Grid principal
                <Grid container spacing={2} className="mb-5">
                    <Grid item xs={12}>
                        <Chip color="primary" size="lg">{data[0]?.travel_name}</Chip>
                        <Stack spacing={1} direction="row" className="mt-2">
                            <Button color="danger">Cancelar</Button>
                            <Button color="success" className="text-white">Guadar cobro</Button>
                        </Stack>
                        <div className="mt-3">
                            <p>Cliente: {data[0]?.cliente}</p>
                            <p>Horas estadias permitidas: {data[0]?.horas_estadias}</p>
                            <p>Operador: {data[0]?.employee_name}</p>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Table aria-label="Example static collection table" fullWidth={true}>
                            <TableHeader>
                                <TableColumn>Llegada a planta programada</TableColumn>
                                <TableColumn>Llegada a planta real reportada</TableColumn>
                                <TableColumn>Tiempo diferencia</TableColumn>
                                <TableColumn>Salida de planta</TableColumn>
                                <TableColumn>Tiempo en planta</TableColumn>
                            </TableHeader>
                            <TableBody>
                                <TableRow key="1">
                                    <TableCell>{data[0]?.llegada_planta_programada}</TableCell>
                                    <TableCell>{data[0]?.llegada_planta}</TableCell>
                                    <TableCell>{data[0]?.diferencia_llegada_planta}</TableCell>
                                    <TableCell>{data[0]?.salida_planta}</TableCell>
                                    <TableCell>{data[0]?.horas_estadia_real}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Grid>
                    <Grid item xs={12}>
                        <NumberInput
                            label='Horas permitidas'
                            variant="bordered"
                            aria-label="Amount"
                            defaultValue={8}
                            placeholder="Enter the amount"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <NumberInput
                            label='Precio por hora'
                            variant="bordered"
                            aria-label="Amount"
                            defaultValue={0}
                            placeholder="Enter the amount"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <NumberInput
                            label='Horas a cobrar'
                            variant="bordered"
                            aria-label="Amount"
                            defaultValue={0}
                            placeholder="Enter the amount"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <NumberInput
                            label='Total a cobrar'
                            variant="bordered"
                            aria-label="Amount"
                            defaultValue={1024}
                            placeholder="Enter the amount"
                        />
                    </Grid>
                </Grid>
            )}
        </>
    );
};

export default EstadiasForm;
