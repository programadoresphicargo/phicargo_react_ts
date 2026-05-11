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
import Travel from '../control/viaje';
import odooApi from '@/api/odoo-api';
import { tiempoTranscurrido } from '../../funciones/tiempo';

type Notificacion = {
    id_origen: number;
    name: string;
    referencia_viaje: string;
    titulo: string;
    mensaje: string;
    fecha_creacion: string;
}

type Props = {
    isOpen: boolean,
    onOpenChange: (open: boolean) => void;
};

const Notificaciones: React.FC<Props> = ({
    isOpen,
    onOpenChange
}) => {

    const [estatus, setEstatus] = React.useState<Notificacion[]>([]);
    const [isLoading, setLoading] = React.useState(false);
    const [openTravel, setOpenTravel] = React.useState(false);
    const [idViaje, setIDViaje] = React.useState<number | null>(null);

    const handleClickOpen = (id_viaje: number) => {
        setIDViaje(id_viaje);
        setOpenTravel(true);
    };

    const handleClose = () => {
        setOpenTravel(false);
    };

    useEffect(() => {
        getEstatus();
    }, [open]);

    const getEstatus = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/notificaciones/estatus_operadores/');
            setEstatus(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error al obtener los datos:', error);
        }
    };

    return (
        <>
            {idViaje && (
                <Travel idViaje={idViaje} open={openTravel} handleClose={handleClose}></Travel>
            )}
            <Drawer
                isOpen={isOpen}
                size='lg'
                onOpenChange={onOpenChange}
            >
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">Notificaciones</DrawerHeader>
                            <DrawerBody>
                                <ul className="list-group list-group-flush navbar-card-list-group">

                                    {isLoading && (
                                        <Progress isIndeterminate aria-label="Loading..." size="sm" />
                                    )}

                                    {estatus.map((step) => (
                                        <>
                                            <Card className='m-2' onPress={() => handleClickOpen(step.id_origen)} isPressable fullWidth>
                                                <CardHeader className="justify-between">
                                                    <div className="flex gap-5">
                                                        <Avatar
                                                            isBordered
                                                            radius="full"
                                                            size="md"
                                                            src="https://static.vecteezy.com/system/resources/previews/000/442/250/original/vector-notification-icon.jpg"
                                                        />
                                                        <div className="flex flex-col gap-1 items-start justify-center">
                                                            <h4 className="text-small font-semibold leading-none text-default-600">{step.name}</h4>
                                                            <h5 className="text-small tracking-tight text-default-400">{step.titulo}</h5>
                                                            <h5 className="text-small tracking-tight text-default-400">Viaje: {step.referencia_viaje}</h5>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardBody className="px-3 py-0 text-small text-default-400">
                                                    {step.mensaje}
                                                </CardBody>
                                                <CardFooter className="gap-3">
                                                    <div className="flex gap-1">
                                                        <p className="font-semibold text-default-400 text-small">{tiempoTranscurrido(step.fecha_creacion)}</p>
                                                    </div>
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

export default Notificaciones;