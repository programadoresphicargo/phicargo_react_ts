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
import { Tabs, Tab, Card, CardBody } from "@heroui/react";

export default function FormCelulares({ isOpen, onOpen, onOpenChange, id_celular }) {

    const [isLoading, setLoading] = useState(false);

    const [data, setData] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);

    const fetchData = async () => {
        if (id_celular) {
            try {
                setLoading(true);
                const response = await odooApi.get('/inventarioti/empleados/id_empleado/' + id_celular);
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

    const fetchDepartamentos = async () => {
        try {
            const response = await odooApi.get('/inventarioti/empleados/departamentos');
            setDepartamentos(response.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
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
        fetchDepartamentos();
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setData([]);
        }
    }, [isOpen]);

    const handleSave = async (onClose) => {

        if (!data?.id_departamento) {
            toast.error("El campo Departamento es obligatorio");
            return;
        }
        if (!data?.nombre_empleado || data.nombre_empleado.trim() === "") {
            toast.error("El campo Nombre del empleado es obligatorio");
            return;
        }
        if (!data?.puesto || data.puesto.trim() === "") {
            toast.error("El campo Puesto es obligatorio");
            return;
        }

        try {
            setLoading(true);

            if (id_celular) {
                const response = await odooApi.put(`/inventarioti/empleados/${id_celular}`, data);
                if (response.data.status == "success") {
                    toast.success(response.data.message);
                }
            } else {
                // Crear
                const response = await odooApi.post(`/inventarioti/empleados/`, data);
            }

            setData([]);
            onClose();
        } catch (error) {
            toast.error("Error al guardar:" + error);
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
                            <ModalHeader className="flex flex-col gap-1">Empleado: {id_celular}</ModalHeader>
                            {isLoading && (
                                <Progress color="primary" isIndeterminate size="sm" />
                            )}
                            <ModalBody>
                                <Select
                                    label="Departamento"
                                    selectedKeys={data?.id_departamento ? [String(data.id_departamento)] : []}
                                    onSelectionChange={(keys) => handleChange("id_departamento", Number([...keys][0]))}
                                    isInvalid={!data?.id_departamento}
                                    errorMessage={!data?.id_departamento ? "Departamento es obligatorio" : ""}
                                >
                                    {departamentos.map((departamento) => (
                                        <SelectItem key={departamento.id_departamento}>{departamento.departamento}</SelectItem>
                                    ))}
                                </Select>

                                <Input label="Nombre del empleado"
                                    value={data?.nombre_empleado}
                                    onChange={(e) => handleChange("nombre_empleado", e.target.value)}
                                    isInvalid={!data?.nombre_empleado}
                                    errorMessage={!data?.nombre_empleado ? "Nombre del empleado es obligatorio" : ""}
                                >
                                </Input>

                                <Input
                                    label="Puesto"
                                    value={data?.puesto}
                                    onChange={(e) => handleChange("puesto", e.target.value)}
                                    isInvalid={!data?.puesto}
                                    errorMessage={!data?.puesto ? "Puesto es obligatorio" : ""}
                                >
                                </Input>

                                <Input label="Unidad" value={data?.eco} onChange={(e) => handleChange("eco", e.target.value)}></Input>

                                {id_celular && (
                                    <Checkbox isSelected={data?.active} onValueChange={(e) => handleChange("active", e)}>Activo</Checkbox>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    color={id_celular ? "success" : "primary"}
                                    onPress={() => handleSave(onClose)}
                                    className="text-white"
                                    isLoading={isLoading}
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
