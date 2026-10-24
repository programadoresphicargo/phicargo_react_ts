import { Avatar, Card, CardBody, CardFooter, CardHeader, Progress } from "@heroui/react";
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
            {id_reporte && (
                <ReporteOperador id_reporte={id_reporte} isOpen={openReporte} onOpenChange={handleCloseReporte}></ReporteOperador>
            )}
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
                                        <Progress color="primary" isIndeterminate size="sm" />
                                    )}

                                    {estatus.map((step) => (
                                        <>

                                            <Card
                                                isPressable
                                                fullWidth
                                                onPress={() => handleClickOpen(step.id_reporte)}
                                                className="
    group m-2 w-[calc(100%-1rem)]
    rounded-2xl border border-default-200
    bg-content1 shadow-sm
    transition-all duration-200
    hover:-translate-y-0.5 hover:border-primary-300
    hover:shadow-md
  "
                                            >
                                                <CardBody className="gap-3 p-4">
                                                    {/* Encabezado */}
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="
          flex h-12 w-12 shrink-0 items-center justify-center
          rounded-xl bg-primary-50 text-primary
          dark:bg-primary-900/5
        "
                                                        >
                                                            <i className="bi bi-clipboard2-check text-xl" />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-default-400">
                                                                Reporte de operación
                                                            </p>

                                                            <h4 className="truncate text-sm font-bold text-foreground">
                                                                {step.referencia}
                                                            </h4>

                                                            <p className="mt-1 truncate text-xs text-default-500">
                                                                {step.nombre_operador || 'Operador no asignado'}
                                                            </p>
                                                        </div>

                                                        {step.atendido ? (
                                                            <Chip
                                                                color="success"
                                                                variant="flat"
                                                                size="sm"
                                                                startContent={<i className="bi bi-check-circle-fill text-xs" />}
                                                                classNames={{
                                                                    content: 'font-semibold',
                                                                }}
                                                            >
                                                                Atendido
                                                            </Chip>
                                                        ) : (
                                                            <Chip
                                                                color="warning"
                                                                variant="flat"
                                                                size="sm"
                                                                startContent={<i className="bi bi-clock-fill text-xs" />}
                                                                classNames={{
                                                                    content: 'font-semibold',
                                                                }}
                                                            >
                                                                Pendiente
                                                            </Chip>
                                                        )}
                                                    </div>

                                                    {/* Separador */}
                                                    <div className="h-px w-full bg-default-100" />

                                                    {/* Pie */}
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex min-w-0 items-center gap-2 text-default-500">
                                                            <i className="bi bi-calendar3 text-sm" />

                                                            <span className="truncate text-xs font-medium">
                                                                {step.fecha_creacion}
                                                            </span>
                                                        </div>

                                                        <div className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary transition-transform group-hover:translate-x-0.5">
                                                            Ver detalle
                                                            <i className="bi bi-arrow-up-right" />
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>

                                        </>
                                    ))}
                                </ul>
                            </DrawerBody>
                            <DrawerFooter>
                                <Button color="primary" onPress={onClose} radius="md" size="sm">
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
