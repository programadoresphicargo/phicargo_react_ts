import {
    Input, Progress, Button, NumberInput
} from "@heroui/react";
import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';

const EPPForm = ({ id_epp, open, handleClose, onSaveSuccess }) => {
    const [data, setData] = useState({ x_name: '', x_cantidad_actual: 0 });
    const [isLoading, setLoading] = useState(false);
    const [isSaving, setSaving] = useState(false);

    const fetchData = async () => {
        if (!id_epp) return;
        try {
            setLoading(true);
            const response = await odooApi.get(`/tms_travel/epp/id_epp/${id_epp}`);
            setData(response.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (id_epp === null) {
                const response = await odooApi.post('/tms_travel/epp', data);
                if (onSaveSuccess) onSaveSuccess(response.data);
            } else {
                const response = await odooApi.put(`/tms_travel/epp/${id_epp}`, data);
                if (onSaveSuccess) onSaveSuccess(response.data);
            }
            handleClose();
        } catch (error) {
            toast.error('Error al guardar:', error);
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (open && id_epp !== null) {
            fetchData();
        } else if (open && id_epp === null) {
            setData({ nombre: '' });
        }
    }, [open, id_epp]);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{id_epp ? `Editar EPP (ID: ${id_epp})` : 'Nuevo EPP'}</DialogTitle>

            {isLoading ? (
                <Progress isIndeterminate size="sm" />
            ) : (
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Input
                            label="Nombre"
                            variant="bordered"
                            value={data.x_name}
                            onChange={(e) => setData({ ...data, x_name: e.target.value })}
                        />
                        <NumberInput
                            label="Cantidad actual"
                            variant="bordered"
                            value={data.x_cantidad_actual}
                            onChange={(e) => setData({ ...data, x_cantidad_actual: e.target.value })}
                        />
                    </div>
                </DialogContent>
            )}

            <DialogActions>
                <Button onPress={handleClose}>Cancelar</Button>
                <Button
                    onPress={handleSave}
                    color={id_epp ? 'success' : 'primary'}
                    isDisabled={isSaving}
                    className={id_epp ? 'text-white' : ''}
                >
                    {isSaving ? 'Guardando...' : id_epp ? 'Actualizar' : 'Registrar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EPPForm;
