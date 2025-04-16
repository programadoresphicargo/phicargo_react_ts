import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Progress } from "@heroui/react";
import { ViajeContext } from '../context/viajeContext';
import odooApi from '@/api/odoo-api';
import { User, Link } from "@heroui/react";

function CumplimientoOperador() {

    const { id_viaje, viaje } = useContext(ViajeContext);
    const [value, setValue] = React.useState(0);
    const [isLoading, setLoading] = React.useState(false);

    useEffect(() => {
        getEstatus();
    }, []);

    const getEstatus = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/reportes_estatus_viajes/cumplimiento_estatus_operadores/', {
                params: {
                    id_viaje: id_viaje,
                    id_operador: viaje.id_operador
                }
            });
            const data = await response.data;
            setValue(data[0].porcentaje_estatus);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error al obtener los datos:', error);
        }
    };


    return (
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
    )
}

export default CumplimientoOperador;
