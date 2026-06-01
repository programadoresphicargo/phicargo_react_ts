import { Box, Dialog, DialogActions, DialogContent, Grid, } from "@mui/material";
import { Card, CardBody, CardHeader, Chip, Divider, Progress, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { useEffect, useState } from "react";
import FoliosCostosExtrasViaje from "../viajes/costos_extras/tabla";
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { Estadia } from "./registros";
import { Button } from "@mui/material";

const EstadiasForm = ({ travel_id, open, handleClose }: { travel_id: number, open: boolean, handleClose: () => void }) => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Estadia>();

    useEffect(() => {
        const getDatos = async () => {
            try {
                setLoading(true);
                const response = await odooApi.get('/tms_travel/reporte_estadias/', {
                    params: { travel_id: travel_id },
                });
                setData(response.data[0]);
            } catch (error: any) {
                toast.error("Error de conexión: " + error.message);
            } finally {
                setLoading(false);
            }
        };
        getDatos();
    }, [travel_id]);

    return (
        <>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
                <DialogContent>
                    <Box m={2}>
                        {loading ? (
                            <Grid container justifyContent="center" alignItems="center" style={{ height: '80vh' }}>
                                <Grid item>
                                    <Progress isIndeterminate label="Cargando" size="sm" />
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid container spacing={2} className="mb-5">
                                <Grid item xs={12}>
                                    <Chip color="primary" size="lg">{data?.travel_name}</Chip>
                                    <div className="mt-3">
                                        <p>Cliente: {data?.cliente}</p>
                                        <p>Primeras horas gratuitas: {data?.x_horas_gracia}</p>
                                        <p>Horas estadias permitidas: {data?.x_horas_estadias}</p>
                                        <p>Operador: {data?.employee_name}</p>
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
                                                    <TableColumn>Cortes calculados</TableColumn>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>{data?.llegada_planta_programada}</TableCell>
                                                        <TableCell>{data?.llegada_planta}</TableCell>
                                                        <TableCell>{data?.diferencia_llegada_planta}</TableCell>
                                                        <TableCell>{data?.salida_planta}</TableCell>
                                                        <TableCell>{data?.horas_planta}</TableCell>
                                                        <TableCell>{data?.cortes_calculados}</TableCell>
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
                    <DialogActions>
                        <Button onClick={handleClose}>Cerrar</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default EstadiasForm;
