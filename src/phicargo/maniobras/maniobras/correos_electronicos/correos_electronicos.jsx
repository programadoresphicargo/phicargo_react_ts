import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import FormularioCorreo from './formulario';

const AutocompleteManager = ({ onValuesChange, id_maniobra, id_cliente, disabled }) => {
    const [options, setOptions] = useState([]);
    const [addedValues, setAddedValues] = useState([]);
    const [initialValues, setInitialValues] = useState([]);
    const [removedValues, setRemovedValues] = useState([]);

    const [open2, setOpen2] = React.useState(false);

    const handleClickOpen2 = () => {
        setOpen2(true);
    };

    const fetchCorreos = () => {
        const baseUrl = `/phicargo/modulo_maniobras/correos/correos_disponibles.php?id_cliente=${id_cliente}`;

        axios.get(baseUrl)
            .then(response => {
                const data = response.data.map(item => ({
                    value: item.id_correo,
                    title: item.correo,
                }));
                setOptions(data);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const handleClose2 = () => {
        setOpen2(false);
        fetchCorreos();
    };

    useEffect(() => {
        fetchCorreos();
    }, [id_cliente]);

    useEffect(() => {
        const baseUrl = `/phicargo/modulo_maniobras/correos/correos_ligados.php?id_maniobra=${id_maniobra}`;

        axios.get(baseUrl)
            .then(response => {
                const data = response.data.map(item => ({
                    id: item.id,
                    value: item.id_correo,
                    title: item.correo,
                }));
                setAddedValues(data);
                setInitialValues(data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [id_maniobra]);

    const handleAdd = (event, newValue) => {
        const removed = initialValues.filter(item => !newValue.includes(item));
        const added = newValue.filter(item => !initialValues.some(initial => initial.value === item.value));

        // Actualiza solo los valores añadidos y removidos correctamente
        setAddedValues(newValue);
        setRemovedValues(removed);

        console.log('añadido');
        console.log(added);
        console.log('borrado');
        console.log(removed);

        onValuesChange({ addedValues: added, removedValues: removed });
    };

    return (<>
        <div className='mb-5'>
            <h2>Correos electronicos</h2>
            <Button variant="contained" onClick={handleClickOpen2} disableElevation>Registrar nuevo correo</Button>
        </div>
        <FormularioCorreo open={open2} handleClose={handleClose2} id_cliente={id_cliente}></FormularioCorreo>
        <Autocomplete
            multiple
            options={options}
            getOptionLabel={(option) => option.title}
            value={addedValues}
            renderInput={(params) => <TextField {...params} label="Seleccionar correos" variant="outlined" />}
            onChange={handleAdd}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            filterSelectedOptions
            disabled={disabled}
            renderTags={(value, getTagProps) => (
                value.map((option, index) => (
                    <Chip
                        color="primary"
                        key={option.title}
                        label={option.title}
                        avatar={<Avatar alt={option.title} src={option.avatar} />}
                        {...getTagProps({ index })}
                    />
                ))
            )}
        />    </>
    );
};

export default AutocompleteManager;
