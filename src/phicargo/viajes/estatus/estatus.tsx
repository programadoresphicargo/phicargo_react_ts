import { Card, CardHeader, Input } from "@heroui/react";
import { useContext, useEffect, useState } from 'react';
import { Avatar } from "@heroui/react";
import { Badge } from "@heroui/react";
import { Button } from "@heroui/react";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import EstatusHistorialAgrupado from './estatus_agrupados';
import { Progress } from "@heroui/react";
import { ViajeContext } from '../context/viajeContext';
import odooApi from '@/api/odoo-api';
import { tiempoTranscurrido } from '../../funciones/tiempo';
import { Stack } from "rsuite";
const { VITE_ODOO_API_URL } = import.meta.env;

type EstatusHistorial = {
    nombre_estatus: string;
    tipo_registrante: string;
    ultima_fecha_envio: string;
    nombre_registrante: string;
    imagen: string;
    registros: number;
    id_reportes_agrupados: number[]
}

function EstatusHistorial() {

    const { id_viaje, drawerOpen, setDrawerOpen } = useContext(ViajeContext);
    const [id_reportes_agrupados, setEstatusAgrupados] = useState<number[]>([]);

    const [estatusHistorial, setHistorial] = useState<EstatusHistorial[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [isLoading, setLoading] = useState(false);

    const handleClickOpen = (registros: number[]) => {
        setEstatusAgrupados(registros);
        setDrawerOpen(true);
    };

    const filteredHistorial = estatusHistorial.filter((item) =>
        item.nombre_estatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nombre_registrante?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedHistorial = [...filteredHistorial].sort((a, b) => {
        const fechaA = new Date(a.ultima_fecha_envio).getTime();
        const fechaB = new Date(b.ultima_fecha_envio).getTime();
        return sortOrder === 'asc' ? fechaA - fechaB : fechaB - fechaA;
    });

    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    const getHistorialEstatus = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get(`/tms_travel/reportes_estatus_viajes/by_id_viaje/${id_viaje}`);
            setHistorial(response.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getHistorialEstatus();
    }, []);

    const generarReporte = async () => {
        try {
            const response = await odooApi.get(
                `/tms_travel/reportes_estatus_viajes/excel/${id_viaje}`,
                {
                    responseType: "blob",
                }
            );
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `historial_estatus_${id_viaje}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("Error al generar el reporte");
            console.error(error);
        };
    }

    const exportPDF = () => {
        window.open(`${odooApi.defaults.baseURL}/tms_travel/reportes_estatus_viajes/pdf/${id_viaje}`, "_blank");
    };

    return (
        <>
            <Dialog
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogContent>
                    <EstatusHistorialAgrupado id_reportes_agrupados={id_reportes_agrupados} />
                </DialogContent>
            </Dialog>

            <Stack spacing={2} direction="row">
                <Button
                    radius="full"
                    color="primary"
                    onPress={() => getHistorialEstatus()}
                    className="w-fit self-end mb-3"
                    startContent={<i className="bi bi-arrow-clockwise"></i>}>
                    Refrescar historial
                </Button>

                <Input
                    radius="full"
                    className="w-96 mb-2"
                    isClearable
                    label="Buscador"
                    color="primary"
                    fullWidth
                    size="sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClear={() => setSearchTerm('')}
                    startContent={<i className="bi bi-search"></i>}
                />

                <Button
                    radius="full"
                    onPress={toggleSortOrder}
                    color="primary"
                    className="w-fit self-end mb-3"
                >
                    Ordenar: {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
                </Button>

                <Button
                    radius="full"
                    onPress={generarReporte}
                    color="success"
                    className="text-white w-fit self-end mb-3"
                >
                    <i className="bi bi-file-earmark-excel"></i>
                    Exportar Excel
                </Button>
                <Button
                    radius="full"
                    onPress={exportPDF}
                    color="danger"
                    className="text-white w-fit self-end mb-3"
                >
                    <i className="bi bi-file-earmark-pdf"></i>
                    Exportar PDF
                </Button>
            </Stack>

            {isLoading ? (
                <Progress size="sm" isIndeterminate color="primary" />
            ) : (
                <ol className="step">
                    {sortedHistorial.map((step) => {

                        const getBadgeClass = () => {
                            if (step.tipo_registrante == 'automatico') return "primary";
                            if (step.tipo_registrante == 'usuario') return "secondary";
                            if (step.tipo_registrante == 'operador') return "success";
                            return "secondary";
                        };

                        return (
                            <Card className="mb-2 w-full" isPressable onPress={() => handleClickOpen(step.id_reportes_agrupados)}>
                                <CardHeader className="justify-between">
                                    <div className="flex gap-5">
                                        <Badge color="danger" content={step.registros} placement="top-right" isInvisible={step.registros > 1 ? false : true}>
                                            <Avatar
                                                color={`${getBadgeClass()}`}
                                                isBordered
                                                radius="full"
                                                size="md"
                                                src={VITE_ODOO_API_URL + `/assets/trafico/estatus_operativos/${step.imagen}`}
                                            />
                                        </Badge>
                                        <div className="flex flex-col gap-1 items-start justify-center">
                                            <h4 className="text-small font-semibold leading-none text-default-600">{step.nombre_estatus}</h4>
                                            <h5 className="text-small tracking-tight text-default-400">
                                                {step.nombre_registrante}
                                            </h5>
                                        </div>
                                    </div>
                                    {tiempoTranscurrido(step.ultima_fecha_envio)}
                                </CardHeader>
                            </Card>
                        );
                    })}
                </ol>
            )}
        </>
    )
}

export default EstatusHistorial;
