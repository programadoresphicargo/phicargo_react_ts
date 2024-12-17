import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AccesoContext } from '../context';
const { VITE_PHIDES_API_URL } = import.meta.env;

export default function FormVisitante({ open, handleClose }) {
    const [nombreVisitante, setNombreVisitante] = useState('');
    const { formData, setVisitantes } = useContext(AccesoContext);

    const handleChange = (e) => {
        const value = e.target.value;
        // Validación: solo permite letras y espacios
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setNombreVisitante(value);
        } else {
            toast.warn('Solo se permiten letras y espacios.');
        }
    };

    const registrarNuevoVisitante = async () => {
        if (!nombreVisitante.trim()) {
            toast.error("El nombre del visitante no puede estar vacío.");
            return;
        }

        const dataToSend = {
            id_empresa: formData.id_empresa,
            nombre_visitante: nombreVisitante.trim(),
        };

        try {
            const response = await axios.post(VITE_PHIDES_API_URL + '/accesos/visitantes/ingresar.php', dataToSend);

            if (response.data.success) {
                toast.success(response.data.mensaje);

                const nuevoVisitante = {
                    id_visitante: response.data.id_visitante,
                    nombre_visitante: nombreVisitante,
                };

                setVisitantes((prevVisitantes) => [...prevVisitantes, nuevoVisitante]);
                setNombreVisitante('');
                handleClose();
            } else {
                toast.error(response.data.mensaje);
            }
        } catch (error) {
            toast.error("Error al comunicarse con el servidor: " + error.message);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>Nuevo visitante</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    id="nombre_visitante"
                    name="nombre_visitante"
                    label="Ingresa el nombre completo del visitante"
                    fullWidth
                    variant="standard"
                    value={nombreVisitante}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={registrarNuevoVisitante}>Registrar visitante</Button>
            </DialogActions>
        </Dialog>
    );
}
