import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import TextField from '@mui/material/TextField';
import odooApi from '@/phicargo/modules/core/api/odoo-api';

const SelectTerminal = ({ label, id, name, onChange, value, disabled, error_terminal }) => {
    const [options, setOptions] = useState([]);
    const [isLoading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true);

        odooApi
            .get('/terminales_maniobras/')
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
                variant='bordered'
                id={id}
                label={label}
                isLoading={isLoading}
                name={name}
                isDisabled={disabled}
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
