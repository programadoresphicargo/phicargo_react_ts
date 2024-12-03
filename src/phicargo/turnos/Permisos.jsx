import React, { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';
import { Grid } from '@mui/material';
import { toast } from "react-toastify";

const Permisos = () => {
    const [checkboxes, setCheckboxes] = useState([]);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

    useEffect(() => {
        axios.get('/phicargo/usuarios/permisos/getPermisos.php')
            .then(response => {
                setCheckboxes(response.data);
            })
            .catch(error => {
                console.error("Error al obtener todos los checkboxes:", error);
            });

        axios.get('/phicargo/usuarios/permisos/getPermisosUsuario.php')
            .then(response => {
                const selectedIds = response.data.map(item => item.id_permiso);
                setSelectedCheckboxes(selectedIds);
            })
            .catch(error => {
                console.error("Error al obtener los checkboxes seleccionados:", error);
            });
    }, []);

    const handleCheckboxChange = (id_permiso) => {
        setSelectedCheckboxes(prevSelected =>
            prevSelected.includes(id_permiso)
                ? prevSelected.filter(item => item !== id_permiso) // Deseleccionar
                : [...prevSelected, id_permiso] // Seleccionar
        );
        const isSelected = selectedCheckboxes.includes(id_permiso);
        if (isSelected == true) {
            toast.success(`Permiso revocado`);
        } else {
            toast.success(`Permiso concedido.`);
        }
    };

    return (
        <Grid container spacing={2}>
            {checkboxes.map((checkbox) => (
                <Grid item md={4}>
                    <FormControlLabel
                        control={
                            <Checkbox checked={selectedCheckboxes.includes(checkbox.id_permiso)}
                                onChange={() => handleCheckboxChange(checkbox.id_permiso)}
                            />}
                        label={checkbox.descripcion} />
                </Grid>
            ))}
        </Grid>
    );
};

export default Permisos;
