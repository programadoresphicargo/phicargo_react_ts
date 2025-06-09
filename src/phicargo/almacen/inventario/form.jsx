import {
    Input, Progress, Button, NumberInput
} from "@heroui/react";
import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';
import { Select, SelectItem } from "@heroui/react";

const EPPForm = ({ id_epp, open, handleClose, onSaveSuccess }) => {
    const [data, setData] = useState({
        x_name: '',
        x_cantidad_actual: 0,
        x_tipo: ''
    });
    const [isLoading, setLoading] = useState(false);
    const [isSaving, setSaving] = useState(false);

    const requiredFields = ['x_name', 'x_cantidad_actual', 'x_tipo'];

    const validate = (data) => {
        const errors = {};
        requiredFields.forEach(field => {
            if (
                data[field] === null ||
                data[field] === undefined ||
                data[field] === '' ||
                (typeof data[field] === 'number' && isNaN(data[field]))
            ) {
                errors[field] = 'Este campo es obligatorio';
            }
        });
        return errors;
    };

    const fetchData = async () => {
        if (!id_epp) return;
        try {
            setLoading(true);
            const response = await odooApi.get(`/tms_travel/inventario_equipo/id/${id_epp}`);
            setData(response.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        const errors = validate(data);
        if (Object.keys(errors).length > 0) {
            toast.error('Por favor completa todos los campos obligatorios.');
            return;
        }

        setSaving(true);
        try {
            if (!data.x_name || data.x_cantidad_actual < 0 || !data.x_tipo) {
                toast.error("Por favor completa todos los campos correctamente.");
                setSaving(false);
                return;
            }

            let response;
            if (id_epp === null) {
                response = await odooApi.post('/tms_travel/inventario_equipo/', data);
            } else {
                response = await odooApi.put(`/tms_travel/inventario_equipo/${id_epp}`, data);
            }

            if (onSaveSuccess) onSaveSuccess(response.data);
            handleClose();
        } catch (error) {
            toast.error('Error al guardar: ' + (error?.message || JSON.stringify(error)));
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (open && id_epp !== null) {
            fetchData();
        } else if (open && id_epp === null) {
            setData({
                x_name: '',
                x_cantidad_actual: 0,
                x_tipo: ''
            });
        }
    }, [open, id_epp]);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{id_epp ? `Editar (ID: ${id_epp})` : 'Nuevo'}</DialogTitle>

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
                            value={data.x_cantidad_actual || 0}
                            onChange={(value) =>
                                setData({ ...data, x_cantidad_actual: parseInt(value) || 0 })
                            }
                        />

                        <Select
                            label="Tipo"
                            variant="bordered"
                            selectedKeys={data.x_tipo ? [data.x_tipo] : []}
                            onSelectionChange={(keys) =>
                                setData({ ...data, x_tipo: Array.from(keys)[0] })
                            }
                        >
                            <SelectItem key="epp">Equipo de protección personal</SelectItem>
                            <SelectItem key="amarre">Equipo de amarre</SelectItem>
                        </Select>
                    </div>
                </DialogContent>
            )}

            <DialogActions>
                <Button onPress={handleClose}>Cancelar</Button>
                <Button
                    onPress={handleSave}
                    color={id_epp ? 'success' : 'primary'}
                    isDisabled={isSaving || !data.x_name || !data.x_tipo}
                    className={id_epp ? 'text-white' : ''}
                >
                    {isSaving ? 'Guardando...' : id_epp ? 'Actualizar' : 'Registrar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EPPForm;
