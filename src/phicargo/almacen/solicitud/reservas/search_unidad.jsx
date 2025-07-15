import { Autocomplete, AutocompleteItem } from "@heroui/react";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import odooApi from '@/api/odoo-api';
import { useAlmacen } from "../../contexto/contexto";
import toast from 'react-hot-toast';

const SearchUnidad = ({ data }) => {
    const { reservasGlobales, setReservasGlobales } = useAlmacen();
    const [options, setOptions] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [selectedKey, setSelectedKey] = useState(null);
    console.log(reservasGlobales);

    const onSelectionChange = (id) => {
        const idNum = parseInt(id, 10); // convertir a número entero

        if (!idNum || !data?.id || !data?.x_cantidad_solicitada) return;

        const reservasLinea = reservasGlobales.filter(
            (r) => r.id_solicitud_equipo_line === data.id
        );

        // 🔐 Validar que la unidad no esté reservada en ninguna línea
        const yaExiste = reservasGlobales.some((r) => r.id_unidad === idNum);
        if (yaExiste) {
            toast.error("Esta unidad ya fue seleccionada en otra línea.");
            return;
        }

        if (reservasLinea.length >= data.x_cantidad_solicitada) {
            toast.error("Ya alcanzaste el máximo de unidades permitidas para esta línea.");
            return;
        }

        const nueva = {
            id_reserva: -Date.now(), // ID temporal
            id_solicitud_equipo_line: data.id,
            id_unidad: idNum, // aseguramos que sea número
        };

        setReservasGlobales((prev) => [...prev, nueva]);
        setSelectedKey(null);
        setOptions((prev) => prev.filter((item) => item.key !== id));
    };

    useEffect(() => {
        if (!data?.x_producto_id) return;

        setLoading(true);
        setOptions([]); // Reset previo
        odooApi.get(`/tms_travel/unidades_equipo/producto_estado/${data.x_producto_id}/disponible`)
            .then(response => {
                const opciones = response.data.map(item => ({
                    key: Number(item.id_unidad),
                    label: item.x_name,
                }));
                setOptions(opciones);
            })
            .catch(() => {
                toast.error("Error al obtener unidades disponibles.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [data?.x_producto_id, data]);

    return (
        <Autocomplete
            className="max-w-xs"
            label="Unidades disponibles"
            isLoading={isLoading}
            items={options}
            variant="bordered"
            selectedKey={selectedKey}
            onSelectionChange={onSelectionChange}
            placeholder="Selecciona una unidad"
        >
            {(item) => (
                <AutocompleteItem key={item.key}>
                    {item.key} - {item.label}
                </AutocompleteItem>
            )}
        </Autocomplete>
    );
};

export default SearchUnidad;
