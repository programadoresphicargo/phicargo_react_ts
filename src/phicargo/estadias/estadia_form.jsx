import { Box, Grid, Stack } from "@mui/material";
import { Button, Card, CardBody, CardHeader, Chip, Divider, Modal, Progress, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@heroui/react";
import { CostosExtrasContext, CostosExtrasProvider } from "../costos/context/context";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FoliosCostosExtrasViaje from "../viajes/costos_extras/tabla";
import FormularioCostoExtra from "../costos/maniobras/form_costos_extras";
import { ViajeContext } from "../viajes/context/viajeContext";
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";

const EstadiasForm = () => {
    const navigate = useNavigate();

    const { id_folio, CostosExtras, setCostosExtras, setCostosExtrasEliminados, DisabledForm, setDisabledForm, agregarConcepto, setAC, horasEstadias, setHE } = useContext(CostosExtrasContext);
    const { ActualizarIDViaje } = useContext(ViajeContext);
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const id_viaje = location.state?.id_viaje;
    ActualizarIDViaje(id_viaje);

    useEffect(() => {
        const getDatos = async () => {
            try {
                setLoading(true);
                const response = await odooApi.get('/tms_travel/reporte_estadias/', {
                    params: { travel_id: id_viaje },
                });
                setData(response.data);
                setHE(response.data[0]?.cortes_calculados);
            } catch (error) {
                toast.error("Error de conexión: " + error.message);
            } finally {
                setLoading(false);
            }
        };
        getDatos();
    }, [id_viaje]);

    return (
        <>
            <Box m={2}>
                {loading ? (
                    <Grid container justifyContent="center" alignItems="center" style={{ height: '80vh' }}>
                        <Grid item>
                            <Progress isIndeterminate label="Obteniendo información" size="lg" />
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container spacing={2} className="mb-5">
                        <Grid item xs={12}>
                            <Button onPress={() => navigate(-1)} color="success" className="text-white">Regresar</Button>

                            <Chip color="primary" size="lg">{data[0]?.travel_name}</Chip>
                            <div className="mt-3">
                                <p>Cliente: {data[0]?.cliente}</p>
                                <p>Primeras horas gratuitas: {data[0]?.x_horas_gracia}</p>
                                <p>Horas estadias permitidas: {data[0]?.x_horas_estadias}</p>
                                <p>Operador: {data[0]?.employee_name}</p>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader>
                                    Datos del viaje
                                </CardHeader>
                                <Divider />
                                <CardBody>
                                    <Table aria-label="Reporte de estadías" fullWidth>
                                        <TableHeader>
                                            <TableColumn>Llegada programada</TableColumn>
                                            <TableColumn>Llegada real</TableColumn>
                                            <TableColumn>Tiempo diferencia</TableColumn>
                                            <TableColumn>Salida de planta</TableColumn>
                                            <TableColumn>Tiempo en planta</TableColumn>
                                            <TableColumn>Cortes cobrados</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{data[0]?.llegada_planta_programada}</TableCell>
                                                <TableCell>{data[0]?.llegada_planta}</TableCell>
                                                <TableCell>{data[0]?.diferencia_llegada_planta}</TableCell>
                                                <TableCell>{data[0]?.salida_planta}</TableCell>
                                                <TableCell>{data[0]?.horas_estadia_real}</TableCell>
                                                <TableCell>{data[0]?.cortes_calculados}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <CardBody>
                                    <FoliosCostosExtrasViaje></FoliosCostosExtrasViaje>
                                </CardBody>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </>
    );
};

export default EstadiasForm;
