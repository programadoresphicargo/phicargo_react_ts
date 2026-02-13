import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormHelperText,
} from '@mui/material';
import { toast } from 'react-toastify';
import odooApi from '@/api/odoo-api';
import { Button, Select, SelectItem, Textarea } from '@heroui/react';
import { useAlmacen } from '../contexto/contexto';

const CancelarSolicitudDialog = ({ open, onClose, id_solicitud }) => {
    const [motivo_cancelacion, setMotivo] = useState(null);
    const [comentarios_cancelacion, setComentario] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { fetchData } = useAlmacen();

    const handleCancel = async () => {
        const newErrors = {};
        if (!motivo_cancelacion) newErrors.motivo_cancelacion = 'Este campo es obligatorio';
        if (!comentarios_cancelacion.trim()) newErrors.comentarios_cancelacion = 'Este campo es obligatorio';
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);
        try {
            const response = await odooApi.patch(`/tms_travel/solicitudes_equipo/cancelar/`, {
                id_solicitud,
                motivo_cancelacion,
                comentarios_cancelacion,
            });

            if (response.data.status === 'success') {
                toast.success(response.data.message);
                fetchData?.(id_solicitud);
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
                {/* Select con HeroUI */}
                <div className="my-3">
                    <Select
                        label="Motivo de cancelación"
                        placeholder="Selecciona un motivo"
                        selectedKeys={motivo_cancelacion ? [motivo_cancelacion] : []}
                        onSelectionChange={(keys) => setMotivo(Array.from(keys)[0])}
                        isInvalid={!!errors.motivo_cancelacion}
                        errorMessage={errors.motivo_cancelacion}
                    >
                        <SelectItem key="error de captura">Error de captura</SelectItem>
                        <SelectItem key="solicitud duplicada">Solicitud duplicada</SelectItem>
                        <SelectItem key="operador no se presento">Operador no se presentó</SelectItem>
                        <SelectItem key="otro">Otro</SelectItem>
                    </Select>
                </div>

                {/* Textarea con HeroUI */}
                <div className="my-3">
                    <Textarea
                        label="Comentarios"
                        placeholder="Escribe un comentario"
                        minRows={3}
                        value={comentarios_cancelacion}
                        onChange={(e) => setComentario(e.target.value)}
                        isInvalid={!!errors.comentarios_cancelacion}
                        errorMessage={errors.comentarios_cancelacion}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onPress={onClose} disabled={loading} radius='full'>Cancelar</Button>
                <Button
                    radius='full'
                    onPress={handleCancel}
                    color="danger"
                    isDisabled={loading}
                    isLoading={loading}
                >
                    Confirmar cancelación
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CancelarSolicitudDialog;
