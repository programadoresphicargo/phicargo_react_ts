import {
    Button,
} from "@heroui/react";
import { useEffect, useState } from 'react';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';
import { Stack } from "@mui/material";
import { AutocompleteInput, TextInput } from "@/components/inputs";
import { Producto } from "./tabla_productos";
import { useForm } from "react-hook-form";

const initialForm: Producto = {
    id: null,
    x_name: "",
    x_tipo: ""
}

const FormProducto = ({ id_producto, onClose }: { id_producto: number | null, onClose?: () => void }) => {

    const { control, handleSubmit, reset } = useForm<Producto>({
        defaultValues: initialForm,
    });

    const [isSaving, setSaving] = useState(false);

    const handleSave = async (data: Producto) => {
        setSaving(true);
        try {
            let response;
            if (!id_producto) {
                response = await odooApi.post('/tms_travel/inventario_equipo/', data);
            } else {
                response = await odooApi.put(`/tms_travel/inventario_equipo/${id_producto}`, data);
            }
            if (response.data.status == 'success') {
                toast.success(response.data.message);
                onClose?.();
            } else {
                toast.error(response.data.message);
            }
        } catch (error: any) {
            toast.error('Error al guardar: ' + (error?.message || JSON.stringify(error)));
        } finally {
            setSaving(false);
        }
    };

    const fetchData = async () => {
        try {
            const response = await odooApi.get(`/tms_travel/inventario_equipo/id/${id_producto}`);
            reset(response.data);
        } catch (error: any) {
            toast.error('Error al guardar: ' + (error?.message || JSON.stringify(error)));
        }
    };

    useEffect(() => {
        if (id_producto) {
            fetchData();
        }
    }, [id_producto]);

    return (
        <>
            <Stack spacing={2} direction="row" className="mb-3">
                <Button
                    radius="full"
                    onPress={() => handleSubmit(handleSave)()}
                    color={id_producto ? 'success' : 'primary'}
                    isDisabled={isSaving}
                    className={id_producto ? 'text-white' : ''}
                >
                    {isSaving ? 'Guardando...' : id_producto ? 'Actualizar' : 'Registrar'}
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
                <TextInput
                    control={control}
                    label="Nombre"
                    name="x_name"
                    variant="bordered"
                    rules={{ required: "Campo obligatorio" }}
                />
                <AutocompleteInput
                    control={control}
                    name="x_tipo"
                    label="Tipo"
                    variant="bordered"
                    items={[{ key: "epp", value: "Equipo de protección personal" }, { key: "amarre", value: "Equipo de amarre" }, { key: "herramienta", value: "Herramienta" }]}
                    rules={{ required: "Campo obligatorio" }}
                />
            </div>
        </>
    );
};

export default FormProducto;
