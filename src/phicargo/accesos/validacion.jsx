import React, { useEffect, useState } from 'react';
import { Button } from "@heroui/react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { InputOtp } from "@heroui/react";
import TextField from '@mui/material/TextField';
import axios from 'axios';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useAuthContext } from '@/modules/auth/hooks';
import LockIcon from '@mui/icons-material/Lock';
import { Box, Typography, Divider } from '@mui/material';

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
            toast.warning('Validando pin');
            const response = await odooApi.post('/users/by_pin/' + pin);
            const data = response.data;
            if (data.id_usuario) {
                toast.success('Pin valido.');
                cambiar_estado(id_acceso, data.id_usuario);
            } else {
                toast.error(data.error);
            }

        } catch (error) {
            toast.error("Error" + error);
        }
    };

    const cambiar_estado = async (id_acceso, id_usuario) => {
        try {
            var baseUrl = '';
            if (estado_acceso == 'espera' || estado_acceso == 'autorizado') {
                baseUrl = '/accesos/validar_acceso/';
            } else if (estado_acceso == 'validado' || estado_acceso == 'rechazado') {
                baseUrl = '/accesos/archivar_acceso/';
            }
            const response = await odooApi.get(baseUrl + id_acceso + '/' + id_usuario);
            if (response.data.status == 'success') {
                toast.success(response.data.message);
                handleClose();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error obteniendo los datos:", error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    p: 2,
                    boxShadow: 4,
                },
            }}
        >
            <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                <LockIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                    Verificación de Seguridad
                </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <DialogContent>
                <Typography variant="subtitle1" align="center" mb={2}>
                    Por favor, ingresa tu PIN de 4 dígitos para continuar.
                </Typography>

                <Box display="flex" justifyContent="center">
                    <InputOtp
                        length={4}
                        value={pin}
                        onValueChange={setPin}
                        size="lg"
                        autoFocus
                        inputStyle={{
                            width: '3rem',
                            height: '3rem',
                            fontSize: '1.5rem',
                            borderRadius: '10px',
                            border: '1px solid #ccc',
                            margin: '0 0.5rem',
                        }}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
                <Button onClick={handleClose} color="secondary" variant="outlined">
                    Cancelar
                </Button>
                <Button
                    onClick={validar_pin}
                    color="primary"
                >
                    Validar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default Validador;