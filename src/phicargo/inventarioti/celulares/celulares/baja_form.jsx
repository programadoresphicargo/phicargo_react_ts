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

export default function BajaCelular({ isOpen, onOpen, onOpenChange, id_celular }) {

    const [isLoading, setLoading] = useState(false);

    const [data, setData] = useState([]);

    const handleSave = async (onClose) => {
        try {
            setLoading(true);

            if (id_celular) {
                const response = await odooApi.put(`/inventarioti/dispositivos/baja/${id_celular}`,
                    {},
                    {
                        params: {
                            tipo: 'celular',
                            motivo_baja: data?.motivo_baja,
                            comentarios_baja: data?.comentarios_baja
                        }
                    });
                if (response.data.status == "success") {
                    toast.success(response.data.message);
                    setData([]);
                } else {
                    toast.error(response.data.message);
                }
            }

            onClose();
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
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Registro de baja {id_celular}</ModalHeader>
                            {isLoading && (
                                <Progress color="primary" isIndeterminate size="sm" />
                            )}
                            <ModalBody>
                                <div className="grid grid-cols-1 gap-4">
                                    <Select
                                        label="Motivo de baja"
                                        selectedKeys={data?.motivo_baja ? [String(data.motivo_baja)] : []}
                                        onSelectionChange={(keys) => handleChange("motivo_baja", [...keys][0])}
                                        isInvalid={!data?.motivo_baja}
                                        errorMessage={!data?.motivo_baja ? "Motivo de baja obligatorio" : ""}
                                    >
                                        <SelectItem key={"Perdida"}>Perdida</SelectItem>
                                        <SelectItem key={"Robo"}>Robo</SelectItem>
                                        <SelectItem key={"Otro"}>Otro</SelectItem>
                                    </Select>

                                    <Textarea
                                        label="Comentarios de baja"
                                        value={data?.comentarios_baja}
                                        isInvalid={!data?.comentarios_baja}
                                        errorMessage={!data?.comentarios_baja ? "Los comentarios son obligatorios" : ""}
                                        onChange={(e) => handleChange("comentarios_baja", e.target.value)}>
                                    </Textarea>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    color={id_celular ? "success" : "primary"}
                                    onPress={() => handleSave(onClose)}
                                    className="text-white"
                                    isDisabled={isLoading}
                                >
                                    Registrar baja
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
