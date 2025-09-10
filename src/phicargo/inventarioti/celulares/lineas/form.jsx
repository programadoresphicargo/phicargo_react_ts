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
                const response = await odooApi.get('/inventarioti/lineas/id_linea/' + id_celular);
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
                const response = await odooApi.put(`/inventarioti/lineas/${id_celular}`, data);
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
            <BajaCelular
                isOpen={isBajaModalOpen}
                onOpenChange={setBajaModalOpen}
                id_celular={id_celular}>
            </BajaCelular>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Linea: {id_celular}</ModalHeader>
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
