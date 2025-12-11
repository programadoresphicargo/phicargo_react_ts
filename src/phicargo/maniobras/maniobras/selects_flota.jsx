import { Autocomplete, AutocompleteItem } from "@heroui/react";
import React, { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import axios from 'axios';
import odooApi from '@/api/odoo-api';

const SelectFlota = ({
    label,
    id,
    name,
    onChange,
    value,
    tipo,
    disabled = false,
    error_flota,

    filtroActivo = false,      // true = filtrar, false = mostrar todos
    modalidad,           // "single" | "full"
    tipoCarga            // "imo" | "general"
}) => {
    const [options, setOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        odooApi.get(`/vehicles/fleet_type/${tipo}`)
            .then(response => {
                const data = response.data.map(item => ({
                    key: item.id,
                    label: item.name,
                    x_tipo_carga: item.x_tipo_carga,
                    x_modalidad: item.x_modalidad
                }));
                setOptions(data);
            })
            .catch(err => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [tipo]);

    useEffect(() => {
        if (!filtroActivo) {
            setFilteredOptions(options);
            return;
        }

        const filtrados = options.filter((item) => {
            const tipoOk = item.x_tipo_carga === tipoCarga;
            const modalidadOk = item.x_modalidad === modalidad;
            return tipoOk && modalidadOk;
        });

        setFilteredOptions(filtrados);
    }, [filtroActivo, options, modalidad, tipoCarga]);

    return (
        <Autocomplete
            label={label}
            isLoading={isLoading}
            id={id}
            name={name}
            isReadOnly={disabled}
            defaultItems={filteredOptions}
            variant={disabled ? 'flat' : 'bordered'}
            selectedKey={String(value)}
            onSelectionChange={(e) => onChange(e, name)}
        >
            {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
        </Autocomplete>
    );
};

export default SelectFlota;
