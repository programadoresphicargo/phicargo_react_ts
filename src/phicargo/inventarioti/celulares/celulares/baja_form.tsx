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
import { useState } from 'react';
import toast from 'react-hot-toast';
import SelectEmpleadosTI from "../empleados/select_empleados";
import { useForm } from "react-hook-form";
import { AutocompleteInput, TextareaInput } from "@/components/inputs";
import { BajaCelularData } from "./schema";

const initialForm: BajaCelularData = {
    tipo: "celular",
    motivo_baja: "",
    comentarios_baja: "",
    empleado_baja: null
}

export default function BajaCelular({ isOpen, onOpenChange, id_celular }: { isOpen: boolean, onOpenChange: React.Dispatch<React.SetStateAction<boolean>>, id_celular: number }) {

    const { control, handleSubmit } = useForm<BajaCelularData>({
        defaultValues: initialForm,
    });
    const [isLoading, setLoading] = useState(false);

    const handleSave = async (data: BajaCelularData) => {
        try {

            setLoading(true);

            if (id_celular) {
                const response = await odooApi.put(`/inventarioti/dispositivos/baja/${id_celular}`,
                    {},
                    {
                        params: data
                    });
                if (response.data.status == "success") {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            }
        } catch (error) {
            console.error("Error al guardar:", error);
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
                            <ModalHeader className="flex flex-col gap-1">Registro de baja Celular: {id_celular}</ModalHeader>
                            {isLoading && (
                                <Progress color="primary" isIndeterminate size="sm" />
                            )}
                            <ModalBody>
                                <div className="grid grid-cols-1 gap-4">
                                    <SelectEmpleadosTI
                                        control={control}
                                        name="empleado_baja"
                                        label="Empleado baja"
                                    />
                                    <AutocompleteInput
                                        control={control}
                                        name="motivo_baja"
                                        label="Motivo de baja"
                                        variant="bordered"
                                        items={
                                            [
                                                { key: "perdida", value: "Perdida" },
                                                { key: "robo", value: "Robo" },
                                                { key: "otro", value: "Otro" }
                                            ]
                                        }
                                        rules={{ required: 'Obligatorio' }}
                                    />
                                    <TextareaInput
                                        control={control}
                                        variant="bordered"
                                        name="comentarios_baja"
                                        label="Comentarios de baja"
                                        rules={{ required: 'Obligatorio' }}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    color={"success"}
                                    onPress={() => handleSubmit(handleSave)()}
                                    className="text-white"
                                    isDisabled={isLoading}
                                    radius="full"
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
