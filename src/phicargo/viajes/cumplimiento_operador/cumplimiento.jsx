import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Progress } from "@heroui/react";
import { ViajeContext } from '../context/viajeContext';
import odooApi from '@/api/odoo-api';
import { User, Link } from "@heroui/react";

function CumplimientoOperador() {

    const { id_viaje, viaje } = useContext(ViajeContext);
    const [value, setValue] = React.useState(0.0);
    const [isLoading, setLoading] = React.useState(false);

    useEffect(() => {
        if (id_viaje && viaje?.employee?.id) {
            getEstatus();
        }
    }, [id_viaje, viaje?.employee?.id]);

    const getEstatus = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/tms_travel/reportes_estatus_viajes/cumplimiento_estatus_operadores/', {
                params: {
                    id_viaje: id_viaje,
                    id_operador: viaje?.employee?.id
                }
            });
            const data = await response.data;
            if (Array.isArray(data) && data.length > 0) {
                setValue(data[0].porcentaje_estatus);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error al obtener los datos:', error);
        }
    };


    return (
        <>
            {isLoading ? (
                <div>Cargando cumplimiento...</div>
            ) : (
                <>
                    <Progress
                        aria-label="Downloading..."
                        size="md"
                        value={value}
                        color="primary"
                        showValueLabel={true}
                        className="max-w-md"
                    />
                </>
            )}
        </>
    )
}

export default CumplimientoOperador;
