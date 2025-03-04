import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from "@heroui/react"
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuthContext } from '@/phicargo/modules/auth/hooks';
import odooApi from '@/phicargo/modules/core/api/odoo-api';

const CancelarManiobraDialog = ({ open, handleClose, id_maniobra }) => {
    const [loading, setLoading] = useState(false);

    const cancelarManiobra = () => {

        setLoading(true);

        odooApi.get(`/maniobras/cancelar/` + id_maniobra)
            .then((response) => {
                setLoading(false);
                if (response.data.status === 'success') {
                    handleClose();
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                setLoading(false);
                toast.error('Error: Hubo un problema al cancelar el registro.' + error);
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
                    disabled={loading}
                >
                    Sí, cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CancelarManiobraDialog;
