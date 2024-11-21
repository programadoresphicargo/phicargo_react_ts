import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';

const MyComponent = ({ label, id, name, onChange, value, tipo, disabled, error_flota }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const baseUrl = '/phicargo/modulo_maniobras/data/get_flota.php';

        axios.get(`${baseUrl}?fleet_type=${tipo}`)
            .then(response => {
                const data = response.data.map(item => ({
                    value: Number(item.vehicle_id),
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
                        error={error_flota}
                        helperText={error_flota}
                    />
                )}
            />
        </div>
    );
};

export default MyComponent;
