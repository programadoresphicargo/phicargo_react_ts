import odooApi from "@/api/odoo-api";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    DatePicker,
    Progress,
} from "@heroui/react";
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import BajaEquipoComputo from "./baja_form";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import HistorialAsignaciones from "../asignacion/historial";
import { Controller, useForm } from "react-hook-form";
import { AutocompleteInput, NumberInput, TextInput, TextareaInput } from "@/components/inputs";
import { parseDate } from "@internationalized/date";
import dayjs, { Dayjs } from "dayjs";

export type EquipoComputo = {
    id_ec?: number;
    nombre: string | null;
    id_empresa: string | null;
    so: string | null;
    sucursal: string | null;
    estado: string | null;
    tipo_equipo: string | null;
    modelo: string | null;
    marca: string | null;
    comentarios: string | null;
    procesador: string | null;
    activo: boolean;
    sn: string | null;
    ram: number | null;
    tipodd: string | null;
    dd: string | null;
    fecha_compra: Dayjs;
    expiracion_garantia: Dayjs;
}

const initialForm: EquipoComputo = {
    sucursal: null,
    id_empresa: null,
    tipo_equipo: null,
    estado: "disponible",
    so: null,
    nombre: null,
    modelo: null,
    marca: null,
    comentarios: null,
    procesador: null,
    activo: true,
    sn: null,
    ram: 0,
    tipodd: null,
    dd: null,
    fecha_compra: dayjs(),
    expiracion_garantia: dayjs(),
}

export default function FormCelulares({ isOpen, onOpenChange, id_equipo }: { isOpen: boolean, onOpenChange: () => void, id_equipo: number | null }) {

    const { control, handleSubmit, reset, watch } = useForm<EquipoComputo>({
        defaultValues: initialForm,
    });

    const [isBajaModalOpen, setBajaModalOpen] = useState(false);
    const openBajaModal = () => setBajaModalOpen(true);
    const [isLoading, setLoading] = useState(false);

    const fetchData = async () => {
        if (id_equipo) {
            try {
                setLoading(true);
                const response = await odooApi.get('/inventarioti/dispositivos/id_dispositivo/computo/' + id_equipo);
                reset(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (!id_equipo) {
            reset(initialForm);
            return;
        }
        fetchData();
    }, [id_equipo, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            reset(initialForm);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isBajaModalOpen == false && id_equipo) {
            fetchData();
        }
    }, [isBajaModalOpen]);

    const handleSave = async (data: EquipoComputo) => {

        const payload = {
            ...data,

            fecha_compra: data.fecha_compra
                ? dayjs(data.fecha_compra).format("YYYY-MM-DD")
                : null,

            expiracion_garantia: data.expiracion_garantia
                ? dayjs(data.expiracion_garantia).format("YYYY-MM-DD")
                : null,
        };

        try {
            setLoading(true);
            if (id_equipo) {
                const response = await odooApi.put(`/inventarioti/dispositivos/computo/${id_equipo}`, payload);
                if (response.data.status == "success") {
                    toast.success(response.data.message);
                    onOpenChange();
                }
            } else {
                const response = await odooApi.post(`/inventarioti/dispositivos/computo`, payload);
                if (response.data.status == "success") {
                    toast.success(response.data.message);
                    onOpenChange();
                }
            }
        } catch (error) {
            console.error("Error al guardar:", error);
        } finally {
            setLoading(false);
        }
    };

    const [valueTab, setValueTab] = React.useState('1');

    const handleChangeTab = (
        _: React.SyntheticEvent,
        newValue: string
    ) => {
        setValueTab(newValue);
    };

    const activo = watch("activo")

    return (
        <>
            {id_equipo && (
                <BajaEquipoComputo
                    isOpen={isBajaModalOpen}
                    onOpenChange={setBajaModalOpen}
                    id_equipo={id_equipo}
                />
            )}

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" scrollBehavior="outside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Equipo computo: {id_equipo}</ModalHeader>
                            {isLoading && (
                                <Progress color="primary" isIndeterminate size="sm" />
                            )}
                            <ModalBody>

                                <Box sx={{ width: '100%' }}>
                                    <TabContext value={valueTab}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                                                <Tab label="Información" value="1" sx={{ fontFamily: 'Inter' }} />
                                                <Tab label="Historial" value="2" sx={{ fontFamily: 'Inter' }} />
                                            </TabList>
                                        </Box>
                                        <TabPanel value="1">
                                            <div className="grid grid-cols-3 gap-4">
                                                <AutocompleteInput
                                                    control={control}
                                                    name="id_empresa"
                                                    label="Empresa"
                                                    rules={{ required: "Campo obligatorio" }}
                                                    items={
                                                        [
                                                            { key: "1", value: "Phi-cargo" },
                                                            { key: "2", value: "Servicontainer" },
                                                            { key: "3", value: "Tankcontainer" }
                                                        ]
                                                    }
                                                />

                                                <AutocompleteInput
                                                    control={control}
                                                    name="tipo_equipo"
                                                    label="Tipo"
                                                    rules={{ required: "Campo obligatorio" }}
                                                    items={
                                                        [
                                                            { key: "All in One", value: "All in One" },
                                                            { key: "Laptop", value: "Laptop" },
                                                            { key: "PC", value: "PC" }
                                                        ]
                                                    }
                                                />

                                                <AutocompleteInput
                                                    control={control}
                                                    name="sucursal"
                                                    label="Sucursal"
                                                    rules={{ required: "Campo obligatorio" }}
                                                    items={
                                                        [
                                                            { key: "Veracruz", value: "Veracruz" },
                                                            { key: "Manzanillo", value: "Manzanillo" },
                                                            { key: "México", value: "México" }
                                                        ]
                                                    }
                                                />

                                                <TextInput
                                                    control={control}
                                                    name="nombre"
                                                    label="Nombre"
                                                    variant="flat"
                                                    rules={{ required: "Campo obligatorio" }}
                                                />

                                                <TextInput
                                                    control={control}
                                                    label="SN"
                                                    name="sn"
                                                    variant="flat"
                                                    rules={{ required: "Campo obligatorio" }}
                                                />

                                                <AutocompleteInput
                                                    control={control}
                                                    name="marca"
                                                    label="Marca"
                                                    rules={{ required: "Campo obligatorio" }}
                                                    items={
                                                        [
                                                            { key: "Acer", value: "Acer" },
                                                            { key: "Apple", value: "Apple" },
                                                            { key: "DELL", value: "DELL" },
                                                            { key: "HP", value: "HP" }
                                                        ]
                                                    }
                                                />

                                                <AutocompleteInput
                                                    control={control}
                                                    name="so"
                                                    label="Sistema Operativo"
                                                    rules={{ required: "Campo obligatorio" }}
                                                    items={
                                                        [
                                                            { key: "Windows 10 Home", value: "Windows 10 Home" },
                                                            { key: "Windows 10 Pro", value: "Windows 10 Pro" },
                                                            { key: "Windows 11 Home", value: "Windows 11 Home" },
                                                            { key: "Windows 11 Pro", value: "Windows 11 Pro" }
                                                        ]
                                                    }
                                                />

                                                <TextInput
                                                    control={control}
                                                    name="modelo"
                                                    label="Modelo"
                                                    variant="flat"
                                                    rules={{ required: "Campo obligatorio" }}
                                                />

                                                <AutocompleteInput
                                                    control={control}
                                                    name="tipodd"
                                                    label="Tipo de disco duro"
                                                    rules={{ required: "Campo obligatorio" }}
                                                    items={
                                                        [
                                                            { key: "HDD", value: "HDD" },
                                                            { key: "SSD", value: "SSD" },
                                                        ]
                                                    }
                                                />

                                                <AutocompleteInput
                                                    control={control}
                                                    name="dd"
                                                    label="Disco duro"
                                                    rules={{ required: "Campo obligatorio" }}
                                                    items={
                                                        [
                                                            { key: "500 GB", value: "500 GB" },
                                                            { key: "256 GB", value: "256 GB" },
                                                            { key: "1 TB", value: "1 TB" },
                                                        ]
                                                    }
                                                />

                                                <NumberInput
                                                    control={control}
                                                    label="RAM"
                                                    name="ram"
                                                    rules={{ required: "Campo obligatorio" }}
                                                />

                                                <TextareaInput
                                                    control={control}
                                                    label="Procesador"
                                                    name="procesador"
                                                    rules={{ required: "Campo obligatorio" }}
                                                />

                                                <Controller
                                                    control={control}
                                                    name="fecha_compra"
                                                    render={({ field, fieldState }) => {
                                                        const calendarValue =
                                                            field.value
                                                                ? parseDate(dayjs(field.value).format('YYYY-MM-DD'))
                                                                : null;

                                                        return (
                                                            <DatePicker
                                                                variant="flat"
                                                                label="Fecha compra"
                                                                isDisabled={!activo}
                                                                value={calendarValue}
                                                                onChange={(val) => {
                                                                    field.onChange(val ? dayjs(val.toString()) : null);
                                                                }}
                                                                isInvalid={!!fieldState.error}
                                                                errorMessage={fieldState.error?.message}
                                                            />
                                                        );
                                                    }}
                                                />

                                                <Controller
                                                    control={control}
                                                    name="expiracion_garantia"
                                                    render={({ field, fieldState }) => {
                                                        const calendarValue =
                                                            field.value
                                                                ? parseDate(dayjs(field.value).format('YYYY-MM-DD'))
                                                                : null;

                                                        return (
                                                            <DatePicker
                                                                label="Expiracion Garantia"
                                                                variant="flat"
                                                                isDisabled={!activo}
                                                                value={calendarValue}
                                                                onChange={(val) => {
                                                                    field.onChange(val ? dayjs(val.toString()) : null);
                                                                }}
                                                                isInvalid={!!fieldState.error}
                                                                errorMessage={fieldState.error?.message}
                                                            />
                                                        );
                                                    }}
                                                />

                                                <TextareaInput
                                                    control={control}
                                                    name="comentarios"
                                                    label="Comentarios"
                                                />

                                            </div>
                                        </TabPanel>
                                        <TabPanel value="2">
                                            {id_equipo && (
                                                <HistorialAsignaciones id_dispositivo={id_equipo}></HistorialAsignaciones>
                                            )}
                                        </TabPanel>
                                    </TabContext>
                                </Box>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>

                                {activo == true && id_equipo && (
                                    <Button
                                        color="danger"
                                        onPress={openBajaModal}
                                        className="text-white"
                                        isDisabled={isLoading}
                                        radius="full"
                                    >
                                        Baja
                                    </Button>
                                )}

                                {(
                                    !id_equipo ||
                                    (id_equipo && activo == true)
                                ) && (
                                        <Button
                                            color={id_equipo ? "success" : "primary"}
                                            onPress={() => handleSubmit(handleSave)()}
                                            className="text-white"
                                            isDisabled={isLoading}
                                            radius="full"
                                        >
                                            {id_equipo ? "Actualizar" : "Registrar"}
                                        </Button>
                                    )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    );
}
