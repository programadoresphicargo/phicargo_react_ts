import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    FormHelperText,
    CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios'; // o usa tu `odooApi`
import { Button } from '@heroui/react';
import odooApi from '@/api/odoo-api';

const CancelarSolicitudDialog = ({ open, onClose, id_solicitud, fetchData }) => {
    const [motivo_cancelacion, setMotivo] = useState(null);
    const [comentarios_cancelacion, setComentario] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleCancel = async () => {
        const newErrors = {};
        if (!motivo_cancelacion) newErrors.motivo_cancelacion = 'Este campo es obligatorio';
        if (!comentarios_cancelacion.trim()) newErrors.comentarios_cancelacion = 'Este campo es obligatorio';
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);
        try {
            const response = await odooApi.patch(`/tms_travel/solicitudes_equipo/cancelar/`, {
                "id_solicitud": id_solicitud,
                "motivo_cancelacion": motivo_cancelacion,
                "comentarios_cancelacion": comentarios_cancelacion,
            });

            if (response.data.status === 'success') {
                toast.success(response.data.message);
                fetchData?.();
                onClose();
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error('Error al cancelar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Cancelar solicitud</DialogTitle>
            <DialogContent dividers>
                <FormControl fullWidth margin="normal" error={!!errors.motivo_cancelacion}>
                    <InputLabel>Motivo de cancelación</InputLabel>
                    <Select
                        value={motivo_cancelacion}
                        label="Motivo de cancelación"
                        onChange={(e) => setMotivo(e.target.value)}
                    >
                        <MenuItem value="error de captura">Error de captura</MenuItem>
                        <MenuItem value="solicitud duplicada">Solicitud duplicada</MenuItem>
                        <MenuItem value="operador no se presento">Operador no se presento</MenuItem>
                        <MenuItem value="otro">Otro</MenuItem>
                    </Select>
                    {errors.motivo_cancelacion && <FormHelperText>{errors.motivo_cancelacion}</FormHelperText>}
                </FormControl>

                <TextField
                    label="Comentarios"
                    fullWidth
                    multiline
                    minRows={3}
                    value={comentarios_cancelacion}
                    onChange={(e) => setComentario(e.target.value)}
                    error={!!errors.comentarios_cancelacion}
                    helperText={errors.comentarios_cancelacion}
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onPress={onClose} disabled={loading}>Cancelar</Button>
                <Button onPress={handleCancel} color="danger" isDisabled={loading} isLoading={loading}>
                    Confirmar cancelación
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CancelarSolicitudDialog;
