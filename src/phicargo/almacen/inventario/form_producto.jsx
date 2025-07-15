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
import { Stack } from "@mui/material";

const FormProducto = ({ data, setData }) => {

    const [isLoading, setLoading] = useState(false);
    const [isSaving, setSaving] = useState(false);

    const requiredFields = ['x_name', 'x_tipo'];

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

    const handleSave = async () => {
        const errors = validate(data);
        if (Object.keys(errors).length > 0) {
            toast.error('Por favor completa todos los campos obligatorios.');
            return;
        }

        setSaving(true);
        try {
            if (!data.x_name || !data.x_tipo) {
                toast.error("Por favor completa todos los campos correctamente.");
                setSaving(false);
                return;
            }

            let response;
            if (data.id === undefined) {
                response = await odooApi.post('/tms_travel/inventario_equipo/', data);
            } else {
                response = await odooApi.put(`/tms_travel/inventario_equipo/${data.id}`, data);
            }

            if (response.data.status == 'success') {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            toast.error('Error al guardar: ' + (error?.message || JSON.stringify(error)));
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Stack spacing={2} direction="row" className="mb-3">
                <Button
                    onPress={handleSave}
                    color={data.id ? 'success' : 'primary'}
                    isDisabled={isSaving || !data.x_name || !data.x_tipo}
                    className={data.id ? 'text-white' : ''}
                >
                    {isSaving ? 'Guardando...' : data.id ? 'Actualizar' : 'Registrar'}
                </Button>
            </Stack>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.5rem',
                    alignItems: 'center',
                }}
            >

                {/* Campo: Nombre */}
                <Input
                    label="Nombre"
                    variant="bordered"
                    value={data.x_name}
                    onChange={(e) =>
                        setData({ ...data, x_name: e.target.value.toUpperCase() })
                    }
                />

                {/* Campo: Tipo */}
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
        </>
    );
};

export default FormProducto;
