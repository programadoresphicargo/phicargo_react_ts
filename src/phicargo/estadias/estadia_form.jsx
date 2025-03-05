import React, { useState, useEffect } from "react";
import { Grid, Stack } from "@mui/material";
import { toast } from "react-toastify";
import odooApi from "../modules/core/api/odoo-api";
import { Input, Button, DateInput, DatePicker, Chip, Divider } from "@heroui/react";
import { useDateFormatter } from "@react-aria/i18n";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import { Progress, Card, CardBody, CardHeader } from "@heroui/react";
import { NumberInput } from "@heroui/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { CostosExtrasProvider } from "../costos/context/context";
import FormularioCostoExtra from "../costos/maniobras/form_costos_extras";

const EstadiasForm = ({ id_viaje, referencia }) => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();

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
            {loading ? (
                <Grid container spacing={2} className="mb-5" justifyContent="center" alignItems="center" style={{ height: '80vh' }}>
                    <Grid item>
                        <Progress
                            isIndeterminate
                            label="Obteniendo información"
                            className="mt-3"
                            size="lg"
                        />
                    </Grid>
                </Grid>
            ) : (
                <Grid container spacing={2} className="mb-5">
                    <Grid item xs={12}>
                        <Chip color="primary" size="lg">{data[0]?.travel_name}</Chip>
                        <div className="mt-3">
                            <p>Cliente: {data[0]?.cliente}</p>
                            <p>Horas estadias permitidas: {data[0]?.horas_estadias}</p>
                            <p>Operador: {data[0]?.employee_name}</p>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader>
                                <Button color="primary" onPress={onOpen}>Crear costo extra</Button>
                            </CardHeader>
                            <Divider></Divider>
                            <CardBody>
                                <Table aria-label="Example static collection table" fullWidth={true}>
                                    <TableHeader>
                                        <TableColumn>Llegada a planta programada</TableColumn>
                                        <TableColumn>Llegada a planta real reportada</TableColumn>
                                        <TableColumn>Tiempo diferencia</TableColumn>
                                        <TableColumn>Salida de planta</TableColumn>
                                        <TableColumn>Tiempo en planta</TableColumn>
                                        <TableColumn>Cortes estadias</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow key="1">
                                            <TableCell>{data[0]?.llegada_planta_programada}</TableCell>
                                            <TableCell>{data[0]?.llegada_planta}</TableCell>
                                            <TableCell>{data[0]?.diferencia_llegada_planta}</TableCell>
                                            <TableCell>{data[0]?.salida_planta}</TableCell>
                                            <TableCell>{data[0]?.horas_estadia_real}</TableCell>
                                            <TableCell>{data[0]?.cortes_cobrados}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Grid>
                </Grid>
            )}


            <CostosExtrasProvider>
                <FormularioCostoExtra show={isOpen} handleClose={onClose}></FormularioCostoExtra>
            </CostosExtrasProvider>

        </>
    );
};

export default EstadiasForm;
