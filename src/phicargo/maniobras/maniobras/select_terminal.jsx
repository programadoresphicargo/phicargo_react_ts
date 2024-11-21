import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';

const SelectTerminal = ({ label, id, name, onChange, value, disabled, error_terminal }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const baseUrl = '/phicargo/modulo_maniobras/terminales/getTerminales.php';

        axios.get(`${baseUrl}`)
            .then(response => {
                const data = response.data.map(item => ({
                    value: Number(item.id_terminal),
                    label: item.terminal,
                }));
                setOptions(data);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    return (
        <div>
            <Autocomplete
                size="small"
                id={id}
                name={name}
                disabled={disabled}
                options={options}
                isClearable={true}
                value={options.find(option => option.value === value) || null}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={(event, selectedOption) => onChange(selectedOption, name)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        variant="outlined"
                        disabled={disabled} 
                        error={error_terminal}
                        helperText={error_terminal}
                    />
                )}
            />
        </div>
    );
};

export default SelectTerminal;
