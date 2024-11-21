import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { toast } from 'react-toastify';

const Validador = ({ id_acceso, estado_acceso, open, handleClose }) => {

    const [pin, setPin] = useState('');

    useEffect(() => {
        if (open) {
            setPin('');
        }
    }, [open]);

    const validar_pin = async () => {

        if (pin == '') {
            toast.error('Ingresa tu pin');
            return;
        }

        try {
            const baseUrl = '/phicargo/accesos/vigilancia/validacion.php';
            const response = await axios.get(baseUrl, {
                params: {
                    pin: pin,
                }
            });

            const data = response.data;
            if (data.respuesta === 1) {
                toast.success('Se valido el acceso.');
                cambiar_estado(data.id_usuario, estado_acceso, id_acceso);
                handleClose();
            } else {
                toast.error('Invalid PIN');
            }

        } catch (error) {
            console.error("Error obteniendo los datos:", error);
        }
    };

    const cambiar_estado = async (id_usuario, estado_acceso, id_acceso) => {
        try {
            var baseUrl = '';
            if (estado_acceso == 'espera') {
                baseUrl = '/phicargo/accesos/acceso/validar.php';
            } else if (estado_acceso == 'validado') {
                baseUrl = '/phicargo/accesos/acceso/archivar.php';
            }
            const response = await axios.get(baseUrl, {
                params: {
                    'id_acceso': id_acceso,
                    'id_usuario': id_usuario,
                }
            });

            const data = response.data;
        } catch (error) {
            console.error("Error obteniendo los datos:", error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle id="alert-dialog-title">
                {"Ingresa tu PIN"}
            </DialogTitle>
            <DialogContent>

                <TextField
                    id="pin"
                    label="PIN"
                    onChange={(event) => setPin(event.target.value)}
                    fullWidth
                    variant="outlined" />

            </DialogContent>
            <DialogActions>
                <Button >Cancelar</Button>
                <Button autoFocus onClick={validar_pin}>
                    Validar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default Validador;