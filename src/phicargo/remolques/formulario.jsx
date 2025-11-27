import React, { useEffect, useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button as MUIButton,
    TextField,
} from "@mui/material";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import SelectFlota from '@/phicargo/maniobras/maniobras/selects_flota';
import Swal from "sweetalert2";
import { Button, Textarea } from '@heroui/react';
import { Select, SelectItem } from '@heroui/react';

const FormularioRemolques = ({ id_pre_asignacion, isOpen, onOpenChange }) => {

    const [formData, setFormData] = useState({});
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setFormData({});
        getData();
    }, [id_pre_asignacion]);

    const handleSelectChange = (value, name) => {
        setFormData(prev => ({
            ...prev,
            [name]: value ?? null,
        }));
    };

    const actualizar = async () => {
        try {
            setLoading(true);

            const res = await odooApi.patch(
                `/vehicles/remolque/${id_pre_asignacion}`,
                formData
            );

            if (res.status === 200) {
                toast.success(res.data.message || "Actualizado correctamente");
                onOpenChange();
            }
        } catch (error) {
            toast.error("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const asignar_viaje = async () => {
        try {
            setLoading(true);
            const res = await odooApi.post(`/preasignacion_equipo/asignar_viaje/${id_pre_asignacion}`);
            if (res.data.status === "success") toast.success(res.data.message);
            getData();

        } catch (error) {
            toast.error("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const getData = async () => {
        if (!id_pre_asignacion) return;

        try {
            setLoading(true);
            const res = await odooApi.get(`/vehicles/${id_pre_asignacion}`);
            setFormData(res.data);
        } catch (error) {
            toast.error("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={() => onOpenChange(false)}
            maxWidth="sm"
            fullWidth>
            <DialogTitle>Asignación de equipo</DialogTitle>

            <DialogContent dividers>

                <div style={{ display: "flex", gap: "20px" }}>
                    <div style={{ flex: 2 }}>

                        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                            <Button
                                color="success"
                                className='text-white'
                                radius='full'
                                onPress={actualizar}
                                isLoading={isLoading}
                            >
                                Guardar
                            </Button>
                        </div>

                        <div className="w-full flex flex-row flex-wrap gap-4 mt-3">

                            <Select
                                label="Sucursal"
                                placeholder="Selecciona una sucursal"
                                selectedKeys={formData.x_sucursal ? new Set([String(formData.x_sucursal)]) : new Set()}
                                variant="bordered"
                                onSelectionChange={(keys) => {
                                    const value = [...keys][0];
                                    handleSelectChange(value, "x_sucursal");
                                }}
                            >
                                <SelectItem key={"1"}>Veracruz</SelectItem>
                                <SelectItem key={"9"}>Manzanillo</SelectItem>
                                <SelectItem key={"2"}>México</SelectItem>
                            </Select>

                            <Select
                                label="Modalidad"
                                placeholder="Selecciona una modalidad"
                                selectedKeys={formData.x_modalidad ? new Set([formData.x_modalidad]) : new Set()}
                                variant="bordered"
                                onSelectionChange={(keys) => {
                                    const value = [...keys][0];
                                    handleSelectChange(value, "x_modalidad");
                                }}
                            >
                                <SelectItem key="sencillo">Sencillo</SelectItem>
                                <SelectItem key="full">Full</SelectItem>
                            </Select>

                            <Select
                                label="Tipo de carga"
                                placeholder="Tipo de carga"
                                selectedKeys={formData.x_tipo_carga ? new Set([formData.x_tipo_carga]) : new Set()}
                                variant="bordered"
                                onSelectionChange={(keys) => {
                                    const value = [...keys][0];
                                    handleSelectChange(value, "x_tipo_carga");
                                }}
                            >
                                <SelectItem key="general">General</SelectItem>
                                <SelectItem key="imo">IMO</SelectItem>
                            </Select>

                            <Select
                                label="Altura compatible"
                                placeholder="Altura compatible"
                                selectedKeys={formData.x_altura_compatible ? new Set([String(formData.x_altura_compatible)]) : new Set()}
                                variant="bordered"
                                onSelectionChange={(keys) => {
                                    const value = [...keys][0];
                                    handleSelectChange(value, "x_altura_compatible");
                                }}
                            >
                                <SelectItem key={"HC"}>HC</SelectItem>
                                <SelectItem key={"DC"}>DC</SelectItem>
                                <SelectItem key={"DC_HC"}>DC HC</SelectItem>
                            </Select>

                            <Select
                                label="Longitud compatible"
                                placeholder="Longitud compatible"
                                selectedKeys={formData.x_longitud_compatible ? new Set([String(formData.x_longitud_compatible)]) : new Set()}
                                variant="bordered"
                                onSelectionChange={(keys) => {
                                    const value = [...keys][0];
                                    handleSelectChange(value, "x_longitud_compatible");
                                }}
                            >
                                <SelectItem key={"20"}>20</SelectItem>
                                <SelectItem key={"40"}>40</SelectItem>
                                <SelectItem key={"20_40"}>20 40</SelectItem>
                            </Select>

                        </div>
                    </div>
                </div>

            </DialogContent>

            <DialogActions>
                <Button color="danger" onPress={() => onOpenChange(false)} radius='full'>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FormularioRemolques;
