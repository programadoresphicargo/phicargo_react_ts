import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
const { VITE_PHIDES_API_URL } = import.meta.env;

const SelectOperador = ({ label, id, name, onChange, value, disabled, error_operador }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const baseUrl = VITE_PHIDES_API_URL + '/modulo_maniobras/data/get_operadores.php';

        axios.get(`${baseUrl}`)
            .then(response => {
                const data = response.data.map(item => ({
                    value: Number(item.id),
                    label: item.nombre_operador,
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
                        error={error_operador}
                        helperText={error_operador}
                    />
                )}
            />
        </div>
    );
};

export default SelectOperador;
