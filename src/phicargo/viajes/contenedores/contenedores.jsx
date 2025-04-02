import { Avatar, Badge, Card, CardHeader } from "@heroui/react";
import React, { useContext, useEffect, useState } from 'react';

import { Spinner } from "@heroui/react";
import { ViajeContext } from '../context/viajeContext';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';

function Contenedores() {
    const { id_viaje } = useContext(ViajeContext);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true); // Inicia la carga
        try {
            const response = await odooApi.get('/tms_waybill/get_by_travel_id/' + id_viaje);
            setData(response.data);
        } catch (error) {
            toast.error('Error al obtener los contenedores: ' + error);
        } finally {
            setIsLoading(false); // Finaliza la carga
        }
    };

    useEffect(() => {
        fetchData();
    }, [id_viaje]);

    return (
        <>
            {isLoading ? (
                <div className="flex justify-center items-center h-20">
                    <Spinner size="lg" color="primary" />
                </div>
            ) : (
                data.map((step, index) => (
                    <Card key={index} className="mb-2 w-full" isPressable>
                        <CardHeader className="justify-between">
                            <div className="flex gap-5">
                                <Avatar
                                    color={"primary"}
                                    isBordered
                                    radius="full"
                                    size="md"
                                    src={'https://cdn-icons-png.flaticon.com/512/6260/6260181.png'}
                                />
                                <div className="flex flex-col gap-1 items-start justify-center">
                                    <h4 className="text-small font-semibold leading-none text-default-600">{step.x_reference}</h4>
                                    <h5 className="text-small tracking-tight text-default-400">
                                        {step.x_medida_bel}
                                    </h5>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                ))
            )}
        </>
    );
}

export default Contenedores;
