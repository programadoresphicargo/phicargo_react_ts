import odooApi from "@/api/odoo-api";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Progress,
} from "@heroui/react";
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import BajaLinea from "./baja_form";
import { useForm } from "react-hook-form";
import { AutocompleteInput, NumberInput, TextInput } from "@/components/inputs";

type Linea = {
    id_empresa: number | null;
    activo: boolean;
    compañia: string | null;
    plan: string;
    numero: number | null;
}

const initialForm: Linea = {
    id_empresa: null,
    compañia: null,
    activo: true,
    plan: "",
    numero: null,
}

export default function FormLineas({ isOpen, onOpenChange, id_linea }: { isOpen: boolean; onOpenChange: () => void, id_linea: number | null }) {

    const { control, handleSubmit, reset, watch } = useForm<Linea>({
        defaultValues: initialForm,
    });

    const [isBajaModalOpen, setBajaModalOpen] = useState(false);
    const openBajaModal = () => setBajaModalOpen(true);
    const [isLoading, setLoading] = useState(false);

    const fetchData = async () => {
        if (id_linea) {
            try {
                setLoading(true);
                const response = await odooApi.get('/inventarioti/lineas/id_linea/' + id_linea);
                reset(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
                setLoading(false);
            }
        } else {
            reset(initialForm);
        }
    };

    useEffect(() => {
        if (!id_linea) {
            reset(initialForm);
            return;
        }
        fetchData();
    }, [id_linea]);

    useEffect(() => {
        if (!isOpen) {
            reset(initialForm);
        }
    }, [isOpen, id_linea]);

    useEffect(() => {
        if (isBajaModalOpen == false && id_linea) {
            fetchData();
        }
    }, [isBajaModalOpen]);

    const handleSave = async (data: Linea) => {
        try {
            setLoading(true);
            if (id_linea) {
                const response = await odooApi.put(`/inventarioti/lineas/${id_linea}`, data);
                if (response.data.status == "success") {
                    toast.success(response.data.message);
                    onOpenChange();
                }
            } else {
                const response = await odooApi.post(`/inventarioti/lineas/`, data);
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

    const activo = watch("activo");

    return (
        <>
            <BajaLinea
                isOpen={isBajaModalOpen}
                onOpenChange={setBajaModalOpen}
                id_linea={id_linea}
            />

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Linea: {id_linea}</ModalHeader>
                            {isLoading && (
                                <Progress color="primary" isIndeterminate size="sm" />
                            )}
                            <ModalBody>

                                <AutocompleteInput
                                    control={control}
                                    name="id_empresa"
                                    label="Empresa"
                                    rules={{ required: "Campo obligatorio" }}
                                    items={[
                                        { key: "1", value: "Transportes Belchez" },
                                        { key: "2", value: "Servicontainer" },
                                        { key: "3", value: "Tankcontainer" },
                                        { key: "5", value: "Phi-Cargo" },
                                    ]}
                                />

                                <AutocompleteInput
                                    control={control}
                                    name="compañia"
                                    label="Compañia"
                                    rules={{ required: "Campo obligatorio" }}
                                    items={[
                                        { key: "telcel", value: "Telcel" },
                                        { key: "AT&T", value: "AT&T" },
                                    ]}
                                />

                                <NumberInput
                                    control={control}
                                    name="numero"
                                    label="Nùmero"
                                    rules={{ required: "Campo obligatorio" }}
                                />

                                <TextInput
                                    control={control}
                                    name="plan"
                                    label="Plan"
                                    variant="flat"
                                    rules={{ required: "Campo obligatorio" }}
                                />

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>

                                {activo == true && id_linea && (
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
                                    !id_linea ||
                                    (id_linea && activo == true)
                                ) && (
                                        <Button
                                            color={id_linea ? "success" : "primary"}
                                            onPress={() => handleSubmit(handleSave)()}
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
