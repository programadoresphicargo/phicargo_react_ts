import { Autocomplete, AutocompleteItem } from "@heroui/react";
import React, { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import axios from 'axios';
import odooApi from '@/api/odoo-api';

const SelectOperador = ({ label, id, name, onChange, value, disabled, error_operador, options = [], isLoading = false }) => {

    return (
        <div>
            <Autocomplete
                variant={disabled ? 'flat' : 'bordered'}
                id={id}
                label={label}
                isLoading={isLoading}
                name={name}
                isReadOnly={disabled}
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
