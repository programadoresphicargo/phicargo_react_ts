import { Autocomplete, AutocompleteItem } from "@heroui/react";
import React, { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import axios from 'axios';
import odooApi from '@/api/odoo-api';

const SelectTerminal = ({ label, id, name, onChange, value, disabled, error_terminal }) => {
    const [options, setOptions] = useState([]);
    const [isLoading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true);

        odooApi
            .get('/maniobras/terminales/')
            .then(response => {
                const data = response.data.map(item => ({
                    key: Number(item.id_terminal),
                    label: item.terminal,
                }));
                setOptions(data);
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <Autocomplete
                isRequired
                variant={disabled ? 'flat' : 'bordered'}
                id={id}
                label={label}
                isLoading={isLoading}
                name={name}
                isReadOnly={disabled}
                defaultItems={options}
                selectedKey={String(value)}
                onSelectionChange={(e) => onChange(e, name)}
                isInvalid={error_terminal ? true : false}
                errorMessage={error_terminal}
            >
                {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
            </Autocomplete>
        </div>
    );
};

export default SelectTerminal;
