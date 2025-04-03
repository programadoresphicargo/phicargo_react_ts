import { Autocomplete, AutocompleteItem } from "@heroui/react";
import React, { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import axios from 'axios';
import odooApi from '@/api/odoo-api';

const MyComponent = ({ label, id, name, onChange, value, tipo, disabled, error_flota }) => {
    const [options, setOptions] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        odooApi.get(`/vehicles/by_fleet_type/${tipo}`)
            .then(response => {
                const data = response.data.map(item => ({
                    key: item.id,
                    label: item.name,
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

    return (
        <Autocomplete
            label={label}
            isLoading={isLoading}
            id={id}
            name={name}
            isDisabled={disabled}
            defaultItems={options}
            variant='bordered'
            selectedKey={String(value)}
            onSelectionChange={(e) => onChange(e, name)}
        >
            {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
        </Autocomplete>
    );
};

export default MyComponent;
