import odooApi from "@/api/odoo-api";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    NumberInput,
    Input,
    DatePicker,
    Textarea,
    Progress,
} from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { parseDate, parseDateTime, getLocalTimeZone } from "@internationalized/date";
import { today } from "@internationalized/date";
import BajaCelular from "./baja_form";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

export default function FormCelulares({ isOpen, onOpen, onOpenChange, id_celular }) {

    const [isBajaModalOpen, setBajaModalOpen] = useState(false);

    const openBajaModal = () => setBajaModalOpen(true);
    const closeBajaModal = () => setBajaModalOpen(false);

    const [isLoading, setLoading] = useState(false);

    const [data, setData] = useState([]);

    const fetchData = async () => {
        if (id_celular) {
            try {
                setLoading(true);
                const response = await odooApi.get('/inventarioti/dispositivos/id_dispositivo/celular/' + id_celular);
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
                setLoading(false);
            }
        } else {
            setData([]);
        }
    };

    useEffect(() => {
        if (!id_celular) {
            setData([]);
            return; // Evita que llame a fetchData si no hay id
        }
        fetchData();
    }, [id_celular]);

    useEffect(() => {
        if (!isOpen) {
            setData([]);
        }
    }, [isOpen, id_celular]);

    useEffect(() => {
        if (isBajaModalOpen == false && id_celular) {
            fetchData();
        }
    }, [isBajaModalOpen]);

    const handleSave = async (onClose) => {
        try {
            setLoading(true);

            if (id_celular) {
                // Actualizar
                const response = await odooApi.put(`/inventarioti/dispositivos/celular/${id_celular}`, data);
                if (response.data.status == "success") {
                    toast.success(response.data.message);
                }
                console.log("Celular actualizado");
            } else {
                // Crear
                const response = await odooApi.post(`/inventarioti/dispositivos/celular`, data);
                console.log("Celular registrado");
            }

            onClose(); // Cierra el modal
        } catch (error) {
            console.error("Error al guardar:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const [valueTab, setValueTab] = React.useState('1');

    const handleChangeTab = (event, newValue) => {
        setValueTab(newValue);
    };

    return (
        <>
            <BajaCelular
                isOpen={isBajaModalOpen}
                onOpenChange={setBajaModalOpen}
                id_celular={id_celular}>
            </BajaCelular>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
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
                                            <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                                                <Tab label="Información" value="1" sx={{ fontFamily: 'Inter' }} />
                                                <Tab label="Historial" value="2" sx={{ fontFamily: 'Inter' }} />
                                            </TabList>
                                        </Box>
                                        <TabPanel value="1">
                                            <div className="grid grid-cols-2 gap-4">
                                                <Select
                                                    label="Empresa"
                                                    isInvalid={!data?.id_empresa}
                                                    errorMessage={!data?.id_empresa ? "La empresa es obligatoria" : ""}
                                                    selectedKeys={data?.id_empresa ? [String(data.id_empresa)] : []}
                                                    onSelectionChange={(keys) => handleChange("id_empresa", Number(keys))}
                                                >
                                                    <SelectItem key={"1"}>Phi-cargo</SelectItem>
                                                    <SelectItem key={"2"}>Servicontainer</SelectItem>
                                                    <SelectItem key={"3"}>Tankcontainer</SelectItem>
                                                </Select>
                                                <Select
                                                    label="Marca"
                                                    isInvalid={!data?.marca}
                                                    errorMessage={!data?.marca ? "La marca es obligatoria" : ""}
                                                    selectedKeys={data?.marca ? new Set([data.marca]) : new Set()}
                                                    onSelectionChange={(keys) => handleChange("marca", [...keys][0])}
                                                >
                                                    <SelectItem key="Samsung">Samsung</SelectItem>
                                                    <SelectItem key="Xiaomi">Xiaomi</SelectItem>
                                                    <SelectItem key="Redmi">Redmi</SelectItem>
                                                    <SelectItem key="Apple">Apple</SelectItem>
                                                    <SelectItem key="Huawei">Huawei</SelectItem>
                                                    <SelectItem key="Motorola">Motorola</SelectItem>
                                                    <SelectItem key="Alcatel">Alcatel</SelectItem>
                                                    <SelectItem key="Nokia">Nokia</SelectItem>
                                                    <SelectItem key="Sony">Sony</SelectItem>
                                                    <SelectItem key="Oppo">Oppo</SelectItem>
                                                    <SelectItem key="ZTE">ZTE</SelectItem>
                                                    <SelectItem key="HONOR">HONOR</SelectItem>
                                                </Select>

                                                <Input
                                                    label="Modelo"
                                                    value={data?.modelo}
                                                    onChange={(e) => handleChange("modelo", e.target.value)}
                                                    isInvalid={!data?.modelo}
                                                    errorMessage={!data?.modelo ? "El modelo es obligatorio" : ""}>
                                                </Input>

                                                <NumberInput
                                                    label="IMEI"
                                                    value={data?.imei}
                                                    onValueChange={(e) => handleChange("imei", e)}
                                                    step={1}
                                                    isInvalid={!data?.imei}
                                                    errorMessage={!data?.imei ? "El IMEI es obligatorio" : ""}>
                                                </NumberInput>

                                                <Input label="Correo electronico"
                                                    value={data?.correo}
                                                    onChange={(e) => handleChange("correo", e.target.value)}
                                                    isInvalid={!data?.correo}
                                                    errorMessage={!data?.correo ? "El Número celular es obligatorio" : ""}>
                                                </Input>

                                                <Input label="Contraseña"
                                                    value={data?.passwoord}
                                                    onChange={(e) => handleChange("passwoord", e.target.value)}
                                                    isInvalid={!data?.passwoord}
                                                    errorMessage={!data?.passwoord ? "El Número celular es obligatorio" : ""}>
                                                </Input>

                                                <DatePicker
                                                    label="Fecha de compra"
                                                    value={
                                                        data?.fecha_compra
                                                            ? parseDate(data.fecha_compra)
                                                            : undefined
                                                    }
                                                    onChange={(date) => {
                                                        if (!date) {
                                                            handleChange("fecha_compra", null);
                                                            return;
                                                        }
                                                        const d = new Date(date);
                                                        const formattedDate = d.toISOString().slice(0, 10);
                                                        handleChange("fecha_compra", formattedDate);
                                                    }}
                                                />

                                                <Textarea label="Comentarios" value={data?.comentarios} onChange={(e) => handleChange("comentarios", e.target.value)}></Textarea>
                                            </div>
                                        </TabPanel>
                                        <TabPanel value="2">Item Two</TabPanel>
                                    </TabContext>
                                </Box>

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>

                                {data?.activo == true && id_celular && (
                                    <Button
                                        color="danger"
                                        onPress={openBajaModal}
                                        className="text-white"
                                        isDisabled={isLoading}
                                    >
                                        Baja
                                    </Button>
                                )}

                                {(
                                    // Mostrar si es nuevo registro
                                    !id_celular ||
                                    // O si es edición y está activo
                                    (id_celular && data?.activo == true)
                                ) && (
                                        <Button
                                            color={id_celular ? "success" : "primary"}
                                            onPress={() => handleSave(onClose)}
                                            className="text-white"
                                            isDisabled={isLoading}
                                        >
                                            {id_celular ? "Actualizar" : "Registrar"}
                                        </Button>
                                    )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
