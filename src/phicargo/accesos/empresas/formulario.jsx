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

export default function FormEmpresa({ open, handleClose }) {
    const [nombreEmpresa, setNombreEmpresa] = useState('');
    const { setEmpresas } = useContext(AccesoContext);

    const handleChange = (e) => {
        const inputValue = e.target.value;

        // Validar que solo contenga letras y espacios
        if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(inputValue)) {
            setNombreEmpresa(inputValue);
        } else {
            toast.warn('Solo se permiten letras y espacios');
        }
    };

    const AñadirEmpresa = async () => {
        if (!nombreEmpresa.trim()) {
            toast.error('El nombre de la empresa no puede estar vacío.');
            return;
        }

        try {
            const response = await axios.get(VITE_PHIDES_API_URL + '/accesos/empresas/registrar_empresa.php', {
                params: { nombre_empresa: nombreEmpresa.trim() },
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setNombreEmpresa(''); // Limpiar el campo después de registrar
                handleClose(); // Cerrar el diálogo
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Error en la solicitud: ' + error.message);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>Nueva empresa</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    id="nombre_empresa"
                    name="nombre_empresa"
                    label="Ingresa el nombre de la empresa"
                    fullWidth
                    variant="standard"
                    value={nombreEmpresa}
                    onChange={handleChange} // Validación en tiempo real
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={AñadirEmpresa}>Registrar</Button>
            </DialogActions>
        </Dialog>
    );
}
