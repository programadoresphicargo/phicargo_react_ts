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
    Checkbox,
} from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { parseDate, parseDateTime, getLocalTimeZone } from "@internationalized/date";
import { today } from "@internationalized/date";
import BajaLinea from "./baja_form";

export default function FormLineas({ isOpen, onOpen, onOpenChange, id_linea }) {

    const [isBajaModalOpen, setBajaModalOpen] = useState(false);

    const openBajaModal = () => setBajaModalOpen(true);
    const closeBajaModal = () => setBajaModalOpen(false);

    const [isLoading, setLoading] = useState(false);

    const [data, setData] = useState([]);

    const fetchData = async () => {
        if (id_linea) {
            try {
                setLoading(true);
                const response = await odooApi.get('/inventarioti/lineas/id_linea/' + id_linea);
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
        if (!id_linea) {
            setData([]);
            return; // Evita que llame a fetchData si no hay id
        }
        fetchData();
    }, [id_linea]);

    useEffect(() => {
        if (!isOpen) {
            setData([]);
        }
    }, [isOpen, id_linea]);

    useEffect(() => {
        if (isBajaModalOpen == false && id_linea) {
            fetchData();
        }
    }, [isBajaModalOpen]);

    const handleSave = async (onClose) => {
        try {
            setLoading(true);

            if (id_linea) {
                // Actualizar
                const response = await odooApi.put(`/inventarioti/lineas/${id_linea}`, data);
                if (response.data.status == "success") {
                    toast.success(response.data.message);
                }
                console.log("Celular actualizado");
            } else {
                // Crear
                const response = await odooApi.post(`/inventarioti/lineas/`, data);
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
            <BajaLinea
                isOpen={isBajaModalOpen}
                onOpenChange={setBajaModalOpen}
                id_linea={id_linea}>
            </BajaLinea>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Linea: {id_linea}</ModalHeader>
                            {isLoading && (
                                <Progress color="primary" isIndeterminate size="sm" />
                            )}
                            <ModalBody>

                                <Select
                                    label="Empresa"
                                    isInvalid={!data.activo}
                                    errorMessage={!data?.compañia ? "La compañia es obligatoria" : ""}
                                    selectedKeys={data.id_empresa ? [String(data.id_empresa)] : []}
                                    onSelectionChange={(keys) => handleChange("id_empresa", Number([...keys][0]))}
                                >
                                    <SelectItem key={"1"}>Transportes Belchez</SelectItem>
                                    <SelectItem key={"2"}>Servicontainer</SelectItem>
                                    <SelectItem key={"3"}>Tankcontainer</SelectItem>
                                    <SelectItem key={"5"}>Phi-Cargo</SelectItem>
                                </Select>

                                <Select
                                    label="Compañia"
                                    isInvalid={!data?.compañia}
                                    errorMessage={!data?.compañia ? "La compañia es obligatoria" : ""}
                                    selectedKeys={data?.compañia ? new Set([data.compañia]) : new Set()}
                                    onSelectionChange={(keys) => handleChange("compañia", [...keys][0])}
                                >
                                    <SelectItem key="telcel">Telcel</SelectItem>
                                    <SelectItem key="AT&T">AT&T</SelectItem>
                                </Select>

                                <Input
                                    label="Nùmero"
                                    value={data?.numero}
                                    onChange={(e) => handleChange("numero", e.target.value)}
                                    isInvalid={!data?.numero}
                                    errorMessage={!data?.numero ? "El numero es obligatorio" : ""}>
                                </Input>

                                <Input label="Plan"
                                    value={data?.plan}
                                    onChange={(e) => handleChange("plan", e.target.value)}
                                    isInvalid={!data?.plan}
                                    errorMessage={!data?.plan ? "Plan es obligatorio" : ""}>
                                </Input>

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>

                                {data?.activo == true && id_linea && (
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
                                    // Mostrar si es nuevo registro
                                    !id_linea ||
                                    // O si es edición y está activo
                                    (id_linea && data?.activo == true)
                                ) && (
                                        <Button
                                            color={id_linea ? "success" : "primary"}
                                            onPress={() => handleSave(onClose)}
                                            className="text-white"
                                            isDisabled={isLoading}
                                            radius="full"
                                        >
                                            {id_linea ? "Actualizar" : "Registrar"}
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
