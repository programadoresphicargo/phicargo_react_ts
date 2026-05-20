import odooApi from "@/api/odoo-api";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Progress, DatePicker,
} from "@heroui/react";
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import BajaCelular from "./baja_form";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import HistorialAsignaciones from "../asignacion/historial";
import { Controller, useForm } from "react-hook-form";
import { Celular } from "./schema";
import { AutocompleteInput, CheckboxInput, NumberInput, SelectInput, TextInput, TextareaInput } from "@/components/inputs";
import dayjs from "dayjs";
import { parseDate } from "@internationalized/date";

const initialForm: Celular = {
    id_celular: 0,
    activo: true,
    estado: "disponible",
    id_empresa: null,
    marca: "",
    modelo: "",
    imei: 0,
    correo: "",
    passwoord: "",
    fecha_compra: dayjs(),
    comentarios: ""
}

export default function FormCelulares({ isOpen, onOpenChange, id_celular }: { isOpen: boolean, onOpenChange: () => void, id_celular: number | null }) {

    const { control, handleSubmit, reset, watch } = useForm<Celular>({
        defaultValues: initialForm,
    });

    const [isBajaModalOpen, setBajaModalOpen] = useState(false);
    const openBajaModal = () => setBajaModalOpen(true);

    const [isLoading, setLoading] = useState(false);
    const activo = watch("activo");

    const fetchData = async () => {
        if (id_celular) {
            try {
                setLoading(true);
                const response = await odooApi.get('/inventarioti/dispositivos/id_dispositivo/celular/' + id_celular);
                reset({
                    ...response.data,
                    fecha_compra: response.data.fecha_compra
                        ? dayjs(response.data.fecha_compra)
                        : null,
                });
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            } finally {
                setLoading(false);
            }
        } else {
            reset(initialForm);
        }
    };

    useEffect(() => {
        if (isOpen && id_celular) {
            fetchData();
        } else {
            reset(initialForm);
        }
    }, [id_celular, isOpen]);

    useEffect(() => {
        if (!isBajaModalOpen && id_celular) {
            fetchData();
        }
    }, [isBajaModalOpen]);

    const handleSave = async (data: Celular) => {
        try {

            const payload = {
                ...data,
                fecha_compra: data.fecha_compra?.format("YYYY-MM-DD"),
            };

            setLoading(true);
            if (id_celular) {
                const response = await odooApi.put(`/inventarioti/dispositivos/celular/${id_celular}`, payload);
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    onOpenChange();
                }
            } else {
                const response = await odooApi.post(`/inventarioti/dispositivos/celular`, payload);
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    onOpenChange();
                }
            }
        } catch (error: any) {
            toast.error("Error: " + error?.response?.data?.detail);
        } finally {
            setLoading(false);
        }
    };

    const [valueTab, setValueTab] = useState('1');

    const handleChangeTab = (
        _: React.SyntheticEvent,
        newValue: string
    ) => {
        setValueTab(newValue);
    };

    return (
        <>
            {id_celular && (
                <BajaCelular
                    isOpen={isBajaModalOpen}
                    onOpenChange={setBajaModalOpen}
                    id_celular={id_celular}
                />
            )}
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="4xl"
                scrollBehavior="outside"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Celular: {id_celular}</ModalHeader>
                            {isLoading && (
                                <Progress color="primary" isIndeterminate size="sm" />
                            )}
                            <ModalBody>
                                <Box sx={{ width: '100%' }}>
                                    <TabContext value={valueTab}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <TabList onChange={handleChangeTab}>
                                                <Tab label="Información" value="1" sx={{ fontFamily: 'Inter' }} />
                                                <Tab label="Historial" value="2" sx={{ fontFamily: 'Inter' }} />
                                            </TabList>
                                        </Box>
                                        <TabPanel value="1">
                                            <div className="grid grid-cols-2 gap-4">

                                                <AutocompleteInput
                                                    control={control}
                                                    label="Empresa"
                                                    name="id_empresa"
                                                    variant="bordered"
                                                    isDisabled={!activo}
                                                    items={
                                                        [
                                                            { key: "1", value: "Transportes Belchez" },
                                                            { key: "2", value: "Servicontainer" },
                                                            { key: "3", value: "Tankcontainer" }
                                                        ]
                                                    }
                                                    rules={{ required: 'Obligatorio' }}
                                                />

                                                <SelectInput
                                                    control={control}
                                                    label="Marca"
                                                    name="marca"
                                                    variant="bordered"
                                                    isDisabled={!activo}
                                                    items={
                                                        [
                                                            { key: "Samsung", value: "Samsung" },
                                                            { key: "Xiaomi", value: "Xiaomi" },
                                                            { key: "Redmi", value: "Redmi" },
                                                            { key: "Apple", value: "Apple" },
                                                            { key: "Huawei", value: "Huawei" },
                                                            { key: "Motorola", value: "Motorola" },
                                                            { key: "Alcatel", value: "Alcatel" },
                                                            { key: "Nokia", value: "Nokia" },
                                                            { key: "Sony", value: "Sony" },
                                                            { key: "Oppo", value: "Oppo" },
                                                            { key: "ZTE", value: "ZTE" },
                                                            { key: "HONOR", value: "HONOR" },
                                                        ]
                                                    }
                                                    rules={{ required: 'Obligatorio' }}
                                                ></SelectInput>

                                                <TextInput
                                                    control={control}
                                                    label="Modelo"
                                                    name="modelo"
                                                    variant="bordered"
                                                    rules={{ required: 'Obligatorio' }}
                                                    isDisabled={!activo}
                                                />

                                                <NumberInput
                                                    control={control}
                                                    label="IMEI"
                                                    name="imei"
                                                    variant="bordered"
                                                    rules={{ required: 'Obligatorio' }}
                                                    isDisabled={!activo}
                                                />

                                                <TextInput
                                                    control={control}
                                                    label="Correo electronico"
                                                    name="correo"
                                                    variant="bordered"
                                                    rules={{ required: 'Obligatorio' }}
                                                    isDisabled={!activo}
                                                />

                                                <TextInput
                                                    control={control}
                                                    label="Contraseña"
                                                    name="passwoord"
                                                    variant="bordered"
                                                    rules={{ required: 'Obligatorio' }}
                                                    isDisabled={!activo}
                                                />

                                                <Controller
                                                    control={control}
                                                    name="fecha_compra"
                                                    render={({ field, fieldState }) => {
                                                        const calendarValue =
                                                            field.value
                                                                ? parseDate(field.value.format("YYYY-MM-DD"))
                                                                : null;

                                                        return (
                                                            <DatePicker
                                                                label="Fecha de Incidencia"
                                                                variant="bordered"
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
                                                    variant="bordered"
                                                    name="comentarios"
                                                    label="Comentarios"
                                                    isDisabled={!activo}
                                                />

                                                <CheckboxInput
                                                    control={control}
                                                    label="Activo"
                                                    name="activo"
                                                />

                                                <SelectInput
                                                    control={control}
                                                    label="Estado"
                                                    name="estado"
                                                    variant="bordered"
                                                    items={[{ key: "disponible", value: "Disponible" }, { key: "baja", value: "Baja" }, { key: "asignado", value: "Asignado" }]}
                                                    isDisabled={!activo}
                                                />

                                            </div>
                                        </TabPanel>

                                        <TabPanel value="2">
                                            {id_celular && (
                                                <HistorialAsignaciones id_dispositivo={id_celular} />
                                            )}
                                        </TabPanel>
                                    </TabContext>
                                </Box>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>

                                {activo && id_celular && (
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

                                <Button
                                    color={id_celular ? "success" : "primary"}
                                    onPress={() => handleSubmit(handleSave)()}
                                    className="text-white"
                                    isDisabled={isLoading}
                                    radius="full"
                                >
                                    {id_celular ? "Actualizar" : "Registrar"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    );
}
