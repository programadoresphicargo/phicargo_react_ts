import React, { useState, useEffect, useContext } from "react";
import { Grid, Stack, Box } from "@mui/material";
import { toast } from "react-toastify";
import odooApi from "../modules/core/api/odoo-api";
import { Button, Chip, Divider, Progress, Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, useDisclosure } from "@heroui/react";
import ResponsiveAppBar from "./Navbar";
import FormularioCostoExtra from "../costos/maniobras/form_costos_extras";
import { CostosExtrasContext, CostosExtrasProvider } from "../costos/context/context";
import { ViajeContext } from "../viajes/context/viajeContext";
import { useNavigate, useLocation } from "react-router-dom";

const EstadiasForm = () => {
    const navigate = useNavigate();

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
                console.log(id_viaje);
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
            <CostosExtrasProvider>
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
                                <Button onPress={() => navigate(-1)} color="primary">Regresar</Button>

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
                                                    <TableCell>{data[0]?.cortes_cobrados}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </CardBody>
                                </Card>
                            </Grid>
                        </Grid>
                    )}
                </Box>
                <FormularioCostoExtra show={isOpen} handleClose={onClose} />
            </CostosExtrasProvider>
        </>
    );
};

export default EstadiasForm;
