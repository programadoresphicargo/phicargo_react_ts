import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import axios from 'axios';
import { toast } from 'react-toastify';
const { VITE_PHIDES_API_URL } = import.meta.env;

const CancelarManiobraDialog = ({ open, handleClose, id_maniobra }) => {
    const [loading, setLoading] = useState(false);

    const cancelarManiobra = () => {
        setLoading(true); // Mostrar un estado de carga mientras se realiza la solicitud

        axios.post(VITE_PHIDES_API_URL + `/modulo_maniobras/maniobra/cancelar_maniobra.php?id_maniobra=${id_maniobra}`)
            .then((response) => {
                setLoading(false);
                if (response.data === 1) {
                    handleClose(); // Cerrar el diálogo
                    toast.success('El registro ha sido cancelado exitosamente.');
                } else {
                    console.error(response.data);
                    toast.error('Hubo un error al intentar cancelar la maniobra.');
                }
            })
            .catch((error) => {
                setLoading(false);
                toast.error('Error: Hubo un problema al eliminar el registro.');
            });
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"¿Estás seguro?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    ¿Deseas realmente cancelar este registro?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancelar
                </Button>
                <Button
                    onClick={cancelarManiobra}
                    color="secondary"
                    autoFocus
                    disabled={loading} // Desactivar el botón mientras se procesa
                >
                    Sí, cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CancelarManiobraDialog;
