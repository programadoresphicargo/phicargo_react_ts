import { Alert } from "@heroui/react";
import { useContext, useEffect, useState } from 'react';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { ViajeContext } from "./context/viajeContext";

// 🔹 Tipos bien definidos
type ArrivalStatus =
    | 'arrived_early'
    | 'arrived_late'
    | 'arrived_late_justified'
    | 'no_arrival_recorded'
    | 'no_info';

type Viaje = {
    referencia: string;
    llegada_planta: string;
    llegada_planta_programada: string;
    diferencia_tiempo_llegada: string;
    arrival_status: ArrivalStatus;
};

type StatusConfig = {
    label: string;
    color: 'success' | 'danger' | 'warning' | 'default';
};

function LlegadaTarde() {
    const { id_viaje } = useContext(ViajeContext);

    const [data, setData] = useState<Viaje | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // 🔹 Mapa tipado correctamente
    const arrivalStatusMap: Record<ArrivalStatus, StatusConfig> = {
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
        if (!id_viaje) return;

        setIsLoading(true);
        try {
            const response = await odooApi.get(
                `/tms_travel/departures-arrivals/?travel_id=${id_viaje}`
            );
            setData(response.data);
        } catch (error: any) {
            toast.error(
                'Error al obtener los datos: ' + (error?.message || 'Error desconocido')
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id_viaje]);

    // 🔹 Manejo limpio del render
    if (isLoading || !data) return null;

    const status =
        arrivalStatusMap[data.arrival_status] ?? arrivalStatusMap.no_info;

    return (
        <Alert
            className="text-white mb-5"
            radius="lg"
            color={status.color}
            title={status.label}
            variant="solid"
            description={
                <>
                    <div>🚚 <strong>Viaje:</strong> {data.referencia}</div>
                    <div>📅 <strong>Llegada programada:</strong> {data.llegada_planta_programada}</div>
                    <div>🚚 <strong>Llegada real:</strong> {data.llegada_planta}</div>
                    <div>⏱ <strong>Diferencia:</strong> {data.diferencia_tiempo_llegada}</div>
                </>
            }
        />
    );
}

export default LlegadaTarde;