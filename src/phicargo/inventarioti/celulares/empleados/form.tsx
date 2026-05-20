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
import { AutocompleteInput, CheckboxInput, NumberInput, TextInput, } from "@/components/inputs";
import { useForm } from "react-hook-form";

export type Departamento = {
    id_departamento: number;
    departamento: string;
}

export type DepartamentoResponse = {
    key: number;
    value: string;
}

type Empleado = {
    id_departamento: number | null;
    nombre_empleado: string | null;
    puesto: string | null;
    activo: boolean;
    id_odoo: number | null;
    eco: string | null;
}

const initialForm: Empleado = {
    id_departamento: null,
    nombre_empleado: null,
    activo: true,
    puesto: null,
    id_odoo: null,
    eco: null,
}

export default function FormEmpleado({ isOpen, onOpenChange, id_empleado }: { isOpen: boolean, onOpenChange: (open: boolean) => void, id_empleado: number | null }) {

    const { control, handleSubmit, reset } = useForm<Empleado>({
        defaultValues: initialForm,
    });

    const [isLoading, setLoading] = useState(false);
    const [departamentos, setDepartamentos] = useState<DepartamentoResponse[]>([]);

    const fetchData = async () => {
        if (id_empleado !== null) {
            try {
                setLoading(true);
                const response = await odooApi.get('/inventarioti/empleados/id_empleado/' + id_empleado);
                reset(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    const fetchDepartamentos = () => {
        const baseUrl = '/inventarioti/empleados/departamentos';
        odooApi.get<Departamento[]>(baseUrl)
            .then(response => {
                const data = response.data.map(item => ({
                    key: item.id_departamento,
                    value: item.departamento,
                }));
                setDepartamentos(data);
            })
            .catch(err => {
                console.error('Error al obtener la flota:', err);
            });
    };

    useEffect(() => {
        if (id_empleado === null) {
            reset(initialForm);
            return;
        }
        fetchData();
    }, [id_empleado, reset, isOpen]);

    useEffect(() => {
        fetchDepartamentos();
    }, []);

    useEffect(() => {
        if (!isOpen) {
            reset(initialForm);
        }
    }, [isOpen, reset]);

    const handleSave = async (data: Empleado) => {
        try {
            setLoading(true);
            if (id_empleado !== null) {
                const response = await odooApi.put(
                    `/inventarioti/empleados/${id_empleado}`,
                    data
                );
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                }
            } else {
                const response = await odooApi.post(
                    `/inventarioti/empleados/`,
                    data
                );
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Error al guardar");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Empleado: {id_empleado}</ModalHeader>
                            {isLoading && (
                                <Progress color="primary" isIndeterminate size="sm" />
                            )}
                            <ModalBody>

                                <AutocompleteInput
                                    control={control}
                                    name="id_departamento"
                                    label="Departamento"
                                    items={departamentos}
                                    rules={{ required: 'Obligatorio' }}
                                    variant="bordered"
                                />

                                <TextInput
                                    control={control}
                                    label="Nombre del empleado"
                                    name="nombre_empleado"
                                    rules={{ required: 'Obligatorio' }}
                                    variant="bordered"
                                />

                                <TextInput
                                    control={control}
                                    label="Puesto"
                                    name="puesto"
                                    rules={{ required: 'Obligatorio' }}
                                    variant="bordered"
                                />

                                <TextInput
                                    control={control}
                                    label="Unidad"
                                    name="eco"
                                    rules={{ required: 'Obligatorio' }}
                                    variant="bordered"
                                />

                                <NumberInput
                                    control={control}
                                    label="ID ODOO"
                                    name="id_odoo"
                                    rules={{ required: 'Obligatorio' }}
                                    variant="bordered"
                                />

                                {id_empleado !== null && (
                                    <CheckboxInput
                                        control={control}
                                        label="Activo"
                                        name="activo"
                                    />
                                )}

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose} radius="full">
                                    Cancelar
                                </Button>
                                <Button
                                    radius="full"
                                    color={id_empleado !== null ? "success" : "primary"}
                                    onPress={() => handleSubmit(handleSave)()}
                                    className="text-white"
                                    isLoading={isLoading}
                                    isDisabled={isLoading}
                                >
                                    {id_empleado !== null ? "Actualizar" : "Registrar"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
