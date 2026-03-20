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
    disabled = false,
    isLoading = false,
    options = [],
    filtroActivo = false,      // true = filtrar, false = mostrar todos
    modalidad = null,           // "single" | "full"
    tipoCarga = null        // "imo" | "general"
}) => {

    const [filteredOptions, setFilteredOptions] = useState([]);

    useEffect(() => {
        if (!filtroActivo) {
            setFilteredOptions(options);
            return;
        }

        if (!modalidad || !tipoCarga) {
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
