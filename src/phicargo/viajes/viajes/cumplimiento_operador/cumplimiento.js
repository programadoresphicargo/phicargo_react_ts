import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Progress } from "@nextui-org/react";
import { ViajeContext } from '../context/viajeContext';

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
            const response = await fetch('/phicargo/aplicacion/viajes/porcentaje_cumplimiento.php', {
                method: 'POST',
                body: new URLSearchParams({
                    id_viaje: id_viaje,
                    id_operador: viaje.id_operador
                }),
            })
            const jsonData = await response.json();
            const data = await jsonData[0];

            setValue(data.porcentaje_cumplimiento);
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
