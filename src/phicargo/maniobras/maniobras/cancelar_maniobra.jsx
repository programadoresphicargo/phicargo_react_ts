import React, { useState } from 'react';
import { Button } from "@heroui/react"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useAuthContext } from "@/modules/auth/hooks";
import { Select, SelectItem } from "@heroui/react";

const CancelarManiobraDialog = ({ open, handleClose, id_maniobra }) => {
    const [loading, setLoading] = useState(false);
    const [motivo_cancelacion, setValue] = React.useState("");

    const handleSelectionChange = (e) => {
        setValue(e.target.value);
    };

    const cancelarManiobra = () => {

        if (motivo_cancelacion == "") {
            toast.error('Añade un motivo de cancelación.');
            return;
        }

        setLoading(true);

        odooApi.get(`/maniobras/cancelar/${id_maniobra}/${motivo_cancelacion}`)
            .then((response) => {
                setLoading(false);
                if (response.data.status === 'success') {
                    handleClose();
                    toast.success(response.data.message);
                    setValue("");
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
            maxWidth

        >
            <DialogTitle id="alert-dialog-title">{"¿Estás seguro?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    ¿Deseas realmente cancelar este registro?
                </DialogContentText>

                <Select
                    className="max-w-xs mt-3"
                    label="Motivo de cancelacion"
                    onChange={handleSelectionChange}
                >
                    <SelectItem key="perdida_operador">Pérdida del operador</SelectItem>
                    <SelectItem key="error_datos">Error en los datos</SelectItem>
                </Select>

            </DialogContent>
            <DialogActions>
                <Button onPress={handleClose} color="primary" radius='full'>
                    Volver
                </Button>
                <Button
                    radius='full'
                    onPress={cancelarManiobra}
                    color="danger"
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
