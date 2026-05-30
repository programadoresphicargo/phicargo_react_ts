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
import SelectEmpleadosTI from "../empleados/select_empleados";

type BajaEquipo = {
    tipo: string;
    motivo_baja: string;
    comentarios_baja: string;
    empleado_baja: number | null,
}

const initialForm: BajaEquipo = {
    tipo: "computo",
    motivo_baja: "",
    comentarios_baja: "",
    empleado_baja: null,
}

export default function BajaEquipoComputo({ isOpen, onOpenChange, id_equipo }: { isOpen: boolean, onOpenChange: (open: boolean) => void, id_equipo: number }) {

    const { control, handleSubmit, setValue } = useForm<BajaEquipo>({
        defaultValues: initialForm,
    });

    const [isLoading, setLoading] = useState(false);

    const handleSave = async (data: BajaEquipo) => {
        try {
            setLoading(true);

            if (id_equipo) {
                const response = await odooApi.put(`/inventarioti/dispositivos/baja/${id_equipo}`,
                    {},
                    {
                        params: data
                    });
                if (response.data.status == "success") {
                    toast.success(response.data.message);
                    onOpenChange(false);
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
                            <ModalHeader className="flex flex-col gap-1">Registro de baja computo {id_equipo}</ModalHeader>
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
                                        label="Motivo de baja"
                                        name="motivo_baja"
                                        rules={{ required: "Obligatorio" }}
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
                                        rules={{ required: "Obligatorio" }}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    color={id_equipo ? "success" : "primary"}
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
