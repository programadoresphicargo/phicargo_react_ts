import { Avatar, Card, CardFooter, CardHeader, CircularProgress } from "@heroui/react";
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
} from "@heroui/react";
import React, { useEffect } from 'react';
import { Chip } from "@heroui/react";
import ReporteOperador from "./reporte";
import odooApi from '@/api/odoo-api';

type Reporte = {
    id_reporte: number;
    atendido: boolean;
    nombre_operador: string;
    referencia: string;
    fecha_creacion: string;
};

type ProblemasOperadoresProps = {
    isOpen: boolean;
    onOpenChange: () => void;
};

const ProblemasOperadores: React.FC<ProblemasOperadoresProps> = ({
    isOpen,
    onOpenChange
}) => {

    const [id_reporte, setIDReporte] = React.useState<number | null>(null);
    const [estatus, setEstatus] = React.useState<Reporte[]>([]);
    const [isLoading, setLoading] = React.useState(false);

    const [openReporte, setOpenReporte] = React.useState(false);

    const handleClickOpen = (id_reporte: number) => {
        setIDReporte(id_reporte);
        setOpenReporte(true);
    };

    const handleCloseReporte = () => {
        setOpenReporte(false);
        getEstatus();
    };

    useEffect(() => {
        getEstatus();
    }, [isOpen]);

    const getEstatus = async () => {

        try {
            setLoading(true);
            const response = await odooApi.get('/problemas_operadores/');
            setEstatus(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error al obtener los datos:', error);
        }
    };

    return (
        <>
            <ReporteOperador id_reporte={id_reporte} isOpen={openReporte} onOpenChange={handleCloseReporte}></ReporteOperador>
            <Drawer
                isOpen={isOpen}
                size='lg'
                motionProps={{
                    variants: {
                        enter: {
                            opacity: 1,
                            x: 0,
                        },
                        exit: {
                            x: 100,
                            opacity: 0,
                        },
                    },
                }}
                onOpenChange={onOpenChange}
            >
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">Problemas operador</DrawerHeader>
                            <DrawerBody>

                                <ul className="list-group list-group-flush navbar-card-list-group">

                                    {isLoading && (
                                        <div style={{ marginTop: '20px' }} className="d-flex justify-content-center">
                                            <CircularProgress size="lg" aria-label="Loading..." />
                                        </div>
                                    )}

                                    {estatus.map((step) => (
                                        <>
                                            <Card className='m-2' onPress={() => handleClickOpen(step.id_reporte)} isPressable fullWidth>
                                                <CardHeader className="justify-between">
                                                    <div className="flex gap-5">
                                                        <Avatar
                                                            color='danger'
                                                            isBordered
                                                            radius="full"
                                                            size="md"
                                                        />
                                                        <div className="flex flex-col gap-1 items-start justify-center">
                                                            <h4 className="text-small font-semibold leading-none text-default-600">{step.referencia}</h4>
                                                            <h5 className="text-small tracking-tight text-default-400">{step.nombre_operador}</h5>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardFooter className="gap-3">
                                                    <div className="flex gap-1">
                                                        <p className="font-semibold text-default-400 text-small">{step.fecha_creacion}</p>
                                                    </div>

                                                    {step.atendido && (
                                                        <Chip color="success" className="text-white">Atendido</Chip>
                                                    )}
                                                </CardFooter>
                                            </Card>
                                        </>
                                    ))}
                                </ul>
                            </DrawerBody>
                            <DrawerFooter>
                                <Button color="primary" onPress={onClose} radius="full">
                                    Cerrar
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default ProblemasOperadores;
