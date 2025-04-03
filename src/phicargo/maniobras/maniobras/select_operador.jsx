import { Autocomplete, AutocompleteItem } from "@heroui/react";
import React, { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import axios from 'axios';
import odooApi from '@/api/odoo-api';

const SelectOperador = ({ label, id, name, onChange, value, disabled, error_operador }) => {
    const [options, setOptions] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        odooApi.get('/drivers/')
            .then(response => {
                const data = response.data.map(item => ({
                    key: Number(item.id),
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
    }, []);

    return (
        <div>
            <Autocomplete
                variant='bordered'
                id={id}
                label={label}
                isLoading={isLoading}
                name={name}
                isDisabled={disabled}
                defaultItems={options}
                selectedKey={String(value)}
                isInvalid={error_operador}
                errorMessage={error_operador}
                onSelectionChange={(e) => onChange(e, name)}
            >
                {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
            </Autocomplete>
        </div>
    );
};

export default SelectOperador;
