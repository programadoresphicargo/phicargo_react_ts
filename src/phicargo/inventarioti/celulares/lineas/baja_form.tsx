import odooApi from "@/api/odoo-api";
import { AutocompleteInput, TextareaInput } from "@/components/inputs";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Progress,
} from "@heroui/react";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';

type BajaLinea = {
    motivo_baja: string | null;
    comentarios_baja: string | null;
}

const initialForm: BajaLinea = {
    motivo_baja: "",
    comentarios_baja: ""
}

export default function BajaLinea({ isOpen, onOpenChange, id_linea }: { isOpen: boolean, onOpenChange: React.Dispatch<React.SetStateAction<boolean>>, id_linea: number | null }) {

    const { control, handleSubmit, reset } = useForm<BajaLinea>({
        defaultValues: initialForm,
    });

    const [isLoading, setLoading] = useState(false);

    const handleSave = async (data: BajaLinea) => {
        try {
            setLoading(true);
            if (id_linea) {
                const response = await odooApi.put(`/inventarioti/lineas/baja/${id_linea}`, data);
                if (response.data.status == "success") {
                    toast.success(response.data.message);
                    reset(initialForm);
                    onOpenChange(true);
                }
            }
        } catch (error: any) {
            toast.error("Error al guardar:" + error);
            if (error.response && error.response.data) {
                toast.error("Detalle:" + error.response.data.detail);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Registro de baja de linea {id_linea}</ModalHeader>
                            {isLoading && (
                                <Progress color="primary" isIndeterminate size="sm" />
                            )}
                            <ModalBody>
                                <div className="grid grid-cols-1 gap-4">
                                    <AutocompleteInput
                                        control={control}
                                        name="motivo_baja"
                                        label="Motivo de baja"
                                        rules={{ required: "Campo obligatorio" }}
                                        items={
                                            [
                                                { key: "Perdida", value: "Perdida" },
                                                { key: "Robo", value: "Robo" },
                                                { key: "Otro", value: "Otro" }
                                            ]
                                        }
                                    />

                                    <TextareaInput
                                        control={control}
                                        name="comentarios_baja"
                                        label="Comentarios de baja"
                                        rules={{ required: "Campo obligatorio" }}
                                    />

                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    radius="full"
                                    color={id_linea ? "success" : "primary"}
                                    onPress={() => handleSubmit(handleSave)()}
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
