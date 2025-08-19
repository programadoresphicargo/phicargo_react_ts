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
import BajaEquipoComputo from "./baja_form";

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
                const response = await odooApi.get('/inventarioti/dispositivos/id_dispositivo/computo/' + id_celular);
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
    }, [isOpen]);

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
                const response = await odooApi.put(`/inventarioti/dispositivos/${id_celular}`, data);
                if (response.data.status == "success") {
                    toast.success(response.data.message);
                }
                console.log("Celular actualizado");
            } else {
                // Crear
                const response = await odooApi.post(`/inventarioti/dispositivos/computo`, data);
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
            <BajaEquipoComputo
                isOpen={isBajaModalOpen}
                onOpenChange={setBajaModalOpen}
                id_celular={id_celular}>
            </BajaEquipoComputo>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Celular: {id_celular}</ModalHeader>
                            {isLoading && (
                                <Progress color="primary" isIndeterminate size="sm" />
                            )}
                            <ModalBody>
                                <div className="grid grid-cols-2 gap-4">
                                    <Select
                                        label="Empresa"
                                        isInvalid={!data?.id_empresa}
                                        errorMessage={!data?.id_empresa ? "La empresa es obligatoria" : ""}
                                        selectedKeys={data?.id_empresa ? [String(data.id_empresa)] : []}
                                        onSelectionChange={(keys) => handleChange("id_empresa", Number([...keys][0]))}
                                    >
                                        <SelectItem key={"1"}>Phi-cargo</SelectItem>
                                        <SelectItem key={"2"}>Servicontainer</SelectItem>
                                        <SelectItem key={"3"}>Tankcontainer</SelectItem>
                                    </Select>
                                    <Select
                                        label="Tipo"
                                        isInvalid={!data?.tipo}
                                        errorMessage={!data?.tipo ? "Tipo es obligatorio" : ""}
                                        selectedKeys={data?.tipo ? [String(data.tipo)] : []}
                                        onSelectionChange={(keys) => handleChange("tipo", [...keys][0])}
                                    >
                                        <SelectItem key={"All in One"}>All in One</SelectItem>
                                        <SelectItem key={"Laptop"}>Laptop</SelectItem>
                                        <SelectItem key={"PC"}>PC</SelectItem>
                                    </Select>
                                    <Select
                                        label="Sucursal"
                                        isInvalid={!data?.sucursal}
                                        errorMessage={!data?.sucursal ? "Sucursal es obligatorio" : ""}
                                        selectedKeys={data?.sucursal ? [String(data.sucursal)] : []}
                                        onSelectionChange={(keys) => handleChange("sucursal", [...keys][0])}
                                    >
                                        <SelectItem key={"Veracruz"}>Veracruz</SelectItem>
                                        <SelectItem key={"Manzanillo"}>Manzanillo</SelectItem>
                                        <SelectItem key={"México"}>México</SelectItem>
                                    </Select>

                                    <Input
                                        label="Nombre"
                                        value={data?.nombre}
                                        onChange={(e) => handleChange("nombre", e.target.value)}
                                        isInvalid={!data?.nombre}
                                        errorMessage={!data?.nombre ? "Nombre es obligatorio" : ""}>
                                    </Input>

                                    <Input label="SN"
                                        isInvalid={!data?.sn}
                                        errorMessage={!data?.sn ? "SN es obligatorio" : ""}
                                        value={data?.sn}
                                        onChange={(e) => handleChange("sn", e.target.value)}>
                                    </Input>

                                    <Select
                                        label="Marca"
                                        isInvalid={!data?.marca}
                                        errorMessage={!data?.marca ? "Marca es obligatorio" : ""}
                                        selectedKeys={data?.marca ? new Set([data.marca]) : new Set()}
                                        onSelectionChange={(keys) => handleChange("marca", [...keys][0])}
                                    >
                                        <SelectItem key="Acer">Acer</SelectItem>
                                        <SelectItem key="Apple">Apple</SelectItem>
                                        <SelectItem key="DELL">DELL</SelectItem>
                                        <SelectItem key="HP">HP</SelectItem>
                                    </Select>
                                    <Select
                                        label="Sistema Operativo"
                                        selectedKeys={data?.so ? new Set([data.so]) : new Set()}
                                        onSelectionChange={(keys) => handleChange("so", [...keys][0])}
                                        isInvalid={!data?.so}
                                        errorMessage={!data?.so ? "SO es obligatorio" : ""}
                                    >
                                        <SelectItem key="Windows 10 Home">Windows 10 Home</SelectItem>
                                        <SelectItem key="Windows 10 Pro">Windows 10 Pro</SelectItem>
                                        <SelectItem key="Windows 11 Home">Windows 11 Home</SelectItem>
                                        <SelectItem key="Windows 11 Pro">Windows 11 Pro</SelectItem>
                                    </Select>

                                    <Input
                                        label="Modelo"
                                        isInvalid={!data?.modelo}
                                        errorMessage={!data?.modelo ? "Modelo es obligatorio" : ""}
                                        value={data?.modelo}
                                        onChange={(e) => handleChange("modelo", e.target.value)}>
                                    </Input>

                                    <Select
                                        label="Tipo disco duro"
                                        selectedKeys={data?.tipodd ? new Set([data.tipodd]) : new Set()}
                                        onSelectionChange={(keys) => handleChange("tipodd", [...keys][0])}
                                        isInvalid={!data?.tipodd}
                                        errorMessage={!data?.tipodd ? "Modelo es obligatorio" : ""}
                                    >
                                        <SelectItem key="HDD">HDD</SelectItem>
                                        <SelectItem key="SSD">SSD</SelectItem>
                                    </Select>

                                    <Input
                                        label="RAM"
                                        value={data?.ram}
                                        isInvalid={!data?.ram}
                                        errorMessage={!data?.ram ? "Ram es obligatorio" : ""}
                                        onChange={(e) => handleChange("ram", e.target.value)}>
                                    </Input>

                                    <DatePicker
                                        label="Fecha de compra"
                                        value={
                                            data?.fecha_compra
                                                ? parseDate(data.fecha_compra)
                                                : undefined
                                        }
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

                                    <Textarea
                                        label="Comentarios"
                                        value={data?.comentarios}
                                        onChange={(e) => handleChange("comentarios", e.target.value)}>
                                    </Textarea>

                                </div>
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
            </Modal >
        </>
    );
}
