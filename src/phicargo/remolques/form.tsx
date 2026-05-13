import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { Button, Select, SelectItem } from '@heroui/react';
import { Controller, useForm } from 'react-hook-form';
import { SelectInput } from '@/components/inputs';

type Remolque = {
    x_sucursal: number;
    x_tipo_carga: string;
    x_hc_compatible: string;
    x_modalidad: string;
    x_dc_compatible: string;
}

const initialForm: Remolque = {
    x_sucursal: 1,
    x_tipo_carga: '',
    x_hc_compatible: '',
    x_modalidad: '',
    x_dc_compatible: ''
};

const sucursales = [
    { value: 'Veracruz', key: '1' },
    { value: 'Manzanillo', key: '9' },
    { value: 'Mexico', key: '2' },
];

const modalidad = [
    { value: 'Sencillo', key: 'sencillo' },
    { value: 'Full', key: 'full' },
];

const tipo_carga = [
    { value: 'IMO', key: 'imo' },
    { value: 'General', key: 'general' },
];

const FormularioRemolques = ({ vehicle_data, isOpen, onOpenChange }: { vehicle_data: any, isOpen: boolean, onOpenChange: any }) => {

    const { control, handleSubmit, reset } = useForm<Remolque>({
        defaultValues: initialForm,
    });

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        getData();
    }, [vehicle_data]);

    const actualizar = async (data: Remolque) => {
        try {
            setLoading(true);

            const res = await odooApi.patch(
                `/vehicles/remolque/${vehicle_data?.id}`,
                data
            );

            if (res.status === 200) {
                toast.success(res.data.message || "Actualizado correctamente");
                onOpenChange();
            }
        } catch (error: any) {
            toast.error("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const getData = async () => {
        if (!vehicle_data?.id) return;
        try {
            setLoading(true);
            const res = await odooApi.get(`/vehicles/${vehicle_data?.id}`);
            reset(res.data);
        } catch (error: any) {
            toast.error("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={() => onOpenChange()}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    elevation: 3,
                    sx: {
                        borderRadius: "24px",
                        padding: "8px 0",
                    }
                }
            }}>
            <DialogTitle>{vehicle_data?.name2}</DialogTitle>

            <DialogContent dividers>

                <div style={{ display: "flex", gap: "20px" }}>
                    <div style={{ flex: 2 }}>

                        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                            <Button
                                color="success"
                                className='text-white'
                                radius='full'
                                onPress={() => handleSubmit(actualizar)()}
                                isLoading={isLoading}
                            >
                                Guardar
                            </Button>
                        </div>

                        <div className="w-full flex flex-row flex-wrap gap-4 mt-3">

                            <SelectInput
                                control={control}
                                name="x_sucursal"
                                label="Sucursal"
                                variant="bordered"
                                items={sucursales}
                                rules={{ required: 'Sucursal obligatoria' }}
                            />

                            <SelectInput
                                control={control}
                                name="x_modalidad"
                                label="Modalidad"
                                variant="bordered"
                                items={modalidad}
                                rules={{ required: 'Modalidad obligatoria' }}
                            />

                            <SelectInput
                                control={control}
                                name="x_tipo_carga"
                                label="Tipo de carga"
                                variant="bordered"
                                items={tipo_carga}
                                rules={{ required: 'Tipo de carga obligatorio' }}
                            />

                            <Controller
                                control={control}
                                name="x_dc_compatible"
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        label="DC compatible"
                                        placeholder="DC compatible"
                                        selectedKeys={
                                            field.value
                                                ? new Set([String(field.value)])
                                                : new Set()
                                        }
                                        variant="bordered"
                                        onSelectionChange={(keys) => {
                                            const value = Array.from(keys)[0];
                                            field.onChange(value ?? null);
                                        }}
                                    >
                                        <SelectItem key={"20"}>20</SelectItem>
                                        <SelectItem key={"40"}>40</SelectItem>
                                        <SelectItem key={"20_40"}>20_40</SelectItem>
                                    </Select>
                                )}
                            />

                            <Controller
                                control={control}
                                name="x_hc_compatible"
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        label="HC compatible"
                                        placeholder="HC compatible"
                                        selectedKeys={
                                            field.value
                                                ? new Set([String(field.value)])
                                                : new Set()
                                        }
                                        variant="bordered"
                                        onSelectionChange={(keys) => {
                                            const value = Array.from(keys)[0];
                                            field.onChange(value ?? null);
                                        }}
                                    >
                                        <SelectItem key={"20"}>20</SelectItem>
                                        <SelectItem key={"40"}>40</SelectItem>
                                        <SelectItem key={"20_40"}>20 40</SelectItem>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                </div>

            </DialogContent>

            <DialogActions>
                <Button color="danger" onPress={() => onOpenChange()} radius='full'>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FormularioRemolques;
