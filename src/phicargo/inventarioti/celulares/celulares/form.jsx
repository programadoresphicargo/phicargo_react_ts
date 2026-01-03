import odooApi from "@/api/odoo-api";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, NumberInput, Input, DatePicker, Textarea, Progress, Checkbox
} from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { parseDate } from "@internationalized/date";
import BajaCelular from "./baja_form";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import HistorialAsignaciones from "../asignacion/historial";

export default function FormCelulares({ isOpen, onOpenChange, id_celular }) {

    const [isBajaModalOpen, setBajaModalOpen] = useState(false);
    const openBajaModal = () => setBajaModalOpen(true);
    const closeBajaModal = () => setBajaModalOpen(false);

    const [isLoading, setLoading] = useState(false);

    // datos originales (del API)
    const [data, setData] = useState(null);

    // estado local para edición
    const [formData, setFormData] = useState(null);

    const fetchData = async () => {
        if (id_celular) {
            try {
                setLoading(true);
                const response = await odooApi.get('/inventarioti/dispositivos/id_dispositivo/celular/' + id_celular);
                setData(response.data);
                setFormData(response.data); // inicializa el formulario con la data
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setData(null);
            setFormData({
                activo: true,
                estado: "disponible",
                id_empresa: "",
                marca: "",
                modelo: "",
                imei: "",
                correo: "",
                passwoord: "",
                fecha_compra: "",
                comentarios: ""
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchData();
        } else {
            setData(null);
            setFormData(null);
        }
    }, [id_celular, isOpen]);

    useEffect(() => {
        if (!isBajaModalOpen && id_celular) {
            fetchData();
        }
    }, [isBajaModalOpen]);

    const handleSave = async (onClose) => {
        try {
            setLoading(true);
            if (id_celular) {
                const response = await odooApi.put(`/inventarioti/dispositivos/celular/${id_celular}`, formData);
                if (response.data.status == "success") {
                    toast.success(response.data.message);
                }
            } else {
                const response = await odooApi.post(`/inventarioti/dispositivos/celular`, formData);
                if (response.data.status == "success") {
                    toast.success(response.data.message);
                }
            }
            onClose();
        } catch (error) {
            toast.error("Error al guardar:" + error);
            toast.error("Error: " + error?.response?.data?.detail);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => {
            let newData = { ...prev, [field]: value };

            // si el campo es "activo" y lo activas en true → estado disponible
            if (field === "activo" && value === true) {
                newData.estado = "disponible";
            }

            // si el campo es "activo" y lo pones en false → podrías limpiar estado o dejarlo
            if (field === "activo" && value === false) {
                newData.estado = "baja"; // o "", depende de tu lógica
            }

            return newData;
        });
    };

    const [valueTab, setValueTab] = useState('1');
    const handleChangeTab = (event, newValue) => setValueTab(newValue);

    return (
        <>
            <BajaCelular
                isOpen={isBajaModalOpen}
                onOpenChange={setBajaModalOpen}
                dataCel={data}
            />

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="4xl"
                scrollBehavior="outside"
                isDismissable={false}
                isKeyboardDismissDisabled={true}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Celular: {id_celular}</ModalHeader>
                            {isLoading && (
                                <Progress color="primary" isIndeterminate size="sm" />
                            )}
                            <ModalBody>
                                {formData && (
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

                                                    <Select
                                                        label="Empresa"
                                                        isDisabled={!formData.activo}
                                                        selectedKeys={formData.id_empresa ? [String(formData.id_empresa)] : []}
                                                        onSelectionChange={(keys) => handleChange("id_empresa", Number([...keys][0]))}
                                                        isInvalid={!formData?.id_empresa}
                                                        errorMessage={!data?.id_empresa ? "Empresa obligatorio" : ""}
                                                    >
                                                        <SelectItem key={"1"}>Transportes Belchez</SelectItem>
                                                        <SelectItem key={"2"}>Servicontainer</SelectItem>
                                                        <SelectItem key={"3"}>Tankcontainer</SelectItem>
                                                    </Select>

                                                    <Select
                                                        label="Marca"
                                                        isDisabled={!formData.activo}
                                                        selectedKeys={formData.marca ? new Set([formData.marca]) : new Set()}
                                                        onSelectionChange={(keys) => handleChange("marca", [...keys][0])}
                                                        isInvalid={!formData?.marca}
                                                        errorMessage={!data?.marca ? "Marca obligatorio" : ""}
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
                                                        value={formData.modelo || ""}
                                                        isDisabled={!formData.activo}
                                                        onChange={(e) => handleChange("modelo", e.target.value)}
                                                        isInvalid={!formData?.modelo}
                                                        errorMessage={!data?.modelo ? "Modelo obligatorio" : ""}
                                                    />

                                                    <NumberInput
                                                        label="IMEI"
                                                        value={formData.imei || ""}
                                                        isDisabled={!formData.activo}
                                                        formatOptions={{ useGrouping: false }}
                                                        onValueChange={(e) => handleChange("imei", e)}
                                                        isInvalid={!formData?.imei}
                                                        errorMessage={!data?.imei ? "IMEI obligatorio" : ""}
                                                    />

                                                    <Input
                                                        label="Correo electronico"
                                                        value={formData.correo || ""}
                                                        isDisabled={!formData.activo}
                                                        onChange={(e) => handleChange("correo", e.target.value)}
                                                    />

                                                    <Input
                                                        label="Contraseña"
                                                        value={formData.passwoord || ""}
                                                        isDisabled={!formData.activo}
                                                        onChange={(e) => handleChange("passwoord", e.target.value)}
                                                    />

                                                    <DatePicker
                                                        label="Fecha de compra"
                                                        isDisabled={!formData.activo}
                                                        value={formData.fecha_compra ? parseDate(formData.fecha_compra) : undefined}
                                                        isInvalid={!formData?.fecha_compra}
                                                        errorMessage={!data?.fecha_compra ? "Fecha de compra obligatorio" : ""}
                                                        onChange={(date) => {
                                                            handleChange("fecha_compra", date ? new Date(date).toISOString().slice(0, 10) : null);
                                                        }}
                                                    />

                                                    <Textarea
                                                        label="Comentarios"
                                                        value={formData.comentarios || ""}
                                                        isDisabled={!formData.activo}
                                                        onChange={(e) => handleChange("comentarios", e.target.value)}
                                                    />

                                                    <Checkbox
                                                        isSelected={formData.activo}
                                                        onValueChange={(e) => handleChange("activo", e)}
                                                        isDisabled={!(data && !data.activo && id_celular)} // deshabilitado si no cumple la condición
                                                    >
                                                        Activo
                                                    </Checkbox>

                                                    <Select
                                                        label="Estado"
                                                        selectedKeys={[String(formData.estado && formData.estado.trim() !== "" ? formData.estado : "disponible")]}
                                                        onSelectionChange={(keys) => handleChange("estado", [...keys][0])}
                                                        isDisabled={!(data && !data.activo && id_celular)} // deshabilitado si no cumple la condición
                                                    >
                                                        <SelectItem key={"disponible"}>Disponible</SelectItem>
                                                        <SelectItem key={"baja"}>Baja</SelectItem>
                                                        <SelectItem key={"asignado"}>Asignado</SelectItem>
                                                    </Select>

                                                </div>
                                            </TabPanel>

                                            <TabPanel value="2">
                                                <HistorialAsignaciones id_dispositivo={id_celular} />
                                            </TabPanel>
                                        </TabContext>
                                    </Box>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>

                                {formData?.activo && id_celular && (
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
                                    onPress={() => handleSave(onClose)}
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
