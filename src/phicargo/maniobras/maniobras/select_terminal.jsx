import { Autocomplete, AutocompleteItem } from "@heroui/react";
import React, { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import axios from 'axios';
import odooApi from '@/api/odoo-api';

const SelectTerminal = ({ label, id, name, onChange, value, disabled, error_terminal, options = [], isLoading = false }) => {

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
