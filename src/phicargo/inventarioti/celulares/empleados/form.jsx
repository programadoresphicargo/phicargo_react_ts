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

export default function FormCelulares({ isOpen, onOpen, onOpenChange, id_celular }) {

    const [isLoading, setLoading] = useState(false);

    const [data, setData] = useState([]);

    const fetchData = async () => {
        if (id_celular) {
            try {
                setLoading(true);
                const response = await odooApi.get('/inventarioti/celulares/id_celular/' + id_celular);
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
        fetchData();
    }, [isOpen, id_celular]);

    const handleSave = async (onClose) => {
        try {
            setLoading(true);

            if (id_celular) {
                // Actualizar
                const response = await odooApi.put(`/inventarioti/celulares/${id_celular}`, data);
                if (response.data.status == "success") {
                    toast.success(response.data.message);
                }
                console.log("Celular actualizado");
            } else {
                // Crear
                const response = await odooApi.post(`/inventarioti/celulares/`, data);
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

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Celular: {id_celular}</ModalHeader>
                            {isLoading && (
                                <Progress color="primary" isIndeterminate size="sm" />
                            )}
                            <ModalBody>
                                <Select
                                    label="Empresa"
                                    selectedKeys={data?.id_empresa ? [String(data.id_empresa)] : []}
                                    onSelectionChange={(keys) => handleChange("id_empresa", Number([...keys][0]))}
                                >
                                    <SelectItem key={"1"}>Phi-cargo</SelectItem>
                                    <SelectItem key={"2"}>Servicontainer</SelectItem>
                                    <SelectItem key={"3"}>Tankcontainer</SelectItem>
                                </Select>
                                <Select
                                    label="Marca"
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
                                <Input label="Modelo" value={data?.modelo} onChange={(e) => handleChange("modelo", e.target.value)}></Input>
                                <NumberInput label="IMEI" value={data?.imei} onValueChange={(e) => handleChange("imei", e)} step={1}></NumberInput>
                                <NumberInput label="Número celular" value={data?.numero_celular} onValueChange={(e) => handleChange("numero_celular", e)}></NumberInput>
                                <Input label="Correo electronico" value={data?.correo} onChange={(e) => handleChange("correo", e.target.value)}></Input>
                                <Input label="Contraseña" value={data?.passwoord} onChange={(e) => handleChange("passwoord", e.target.value)}></Input>
                                <DatePicker
                                    label="Fecha de compra"
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
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    color={"danger"}
                                    onPress={() => handleSave(onClose)}
                                    className="text-white"
                                    isDisabled={isLoading}
                                >
                                    Baja
                                </Button>
                                <Button
                                    color={id_celular ? "success" : "primary"}
                                    onPress={() => handleSave(onClose)}
                                    className="text-white"
                                    isDisabled={isLoading}
                                >
                                    {id_celular ? "Actualizar" : "Registrar"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
