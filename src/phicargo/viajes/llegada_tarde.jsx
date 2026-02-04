import { Alert, Avatar, Badge, Card, CardHeader } from "@heroui/react";
import React, { useContext, useEffect, useState } from 'react';
import { Snippet } from "@heroui/snippet";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { Spinner } from "@heroui/spinner";
import { ViajeContext } from "./context/viajeContext";

function LlegadaTarde() {
    const { id_viaje } = useContext(ViajeContext);
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const arrivalStatusMap = {
        arrived_early: {
            label: 'Llegada temprana',
            color: 'success',
        },
        arrived_late: {
            label: 'Llegada tarde. Aplica descuento de $1,000.00 MXN.',
            color: 'danger',
        },
        arrived_late_justified: {
            label: 'Llegada tarde con justificación',
            color: 'warning',
        },
        no_arrival_recorded: {
            label: 'Sin registro de llegada',
            color: 'default',
        },
        no_info: {
            label: 'Sin información',
            color: 'default',
        },
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await odooApi.get('/tms_travel/departures-arrivals/?travel_id=' + id_viaje);
            setData(response.data);
        } catch (error) {
            toast.error('Error al obtener los contenedores: ' + error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id_viaje]);

    return (
        <>
            {!isLoading && data && (
                (() => {
                    const status = arrivalStatusMap[data.arrival_status] || {
                        label: 'Sin información',
                        color: 'default',
                    };

                    return (
                        <Alert
                            className="text-white mb-3"
                            radius="lg"
                            color={status.color}
                            title={status.label}
                            variant="solid"
                            description={
                                <>
                                    <div>📅 <strong>Viaje:</strong> {data?.referencia}</div>
                                    <div>📅 <strong>Llegada programada:</strong> {data?.llegada_planta_programada}</div>
                                    <div>🚚 <strong>Llegada real:</strong> {data?.llegada_planta}</div>
                                    <div>⏱ <strong>Diferencia:</strong> {data?.diferencia_tiempo_llegada}</div>
                                </>
                            }
                        />
                    );
                })()
            )}
        </>
    );

}

export default LlegadaTarde;
