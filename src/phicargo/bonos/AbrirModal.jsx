
import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem } from "@heroui/react";
import axios from "axios";
import { toast } from 'react-toastify';
import odooApi from "../modules/core/api/odoo-api";

const meses = [
    { id: 1, nombre: "Enero" },
    { id: 2, nombre: "Febrero" },
    { id: 3, nombre: "Marzo" },
    { id: 4, nombre: "Abril" },
    { id: 5, nombre: "Mayo" },
    { id: 6, nombre: "Junio" },
    { id: 7, nombre: "Julio" },
    { id: 8, nombre: "Agosto" },
    { id: 9, nombre: "Septiembre" },
    { id: 10, nombre: "Octubre" },
    { id: 11, nombre: "Noviembre" },
    { id: 12, nombre: "Diciembre" },
];

const anios = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

export default function BonosModal({ isOpen, onClose }) {
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!month || !year) {
            alert("Selecciona un mes y un año.");
            return;
        }

        try {
            setLoading(true);
            const response = await odooApi.post(`/bonos_operadores/create_bonos/${month}/${year}`);
            console.log("Respuesta:", response.data);
            if (response.data.status == 'success') {
                toast.success(response.data.message);
                onClose();
            }
        } catch (error) {
            console.error("Error al crear bonos:", error);
            alert("Hubo un error al procesar la solicitud.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>Seleccionar Mes y Año</ModalHeader>
                <ModalBody>
                    <Select label="Mes" placeholder="Selecciona un mes" onChange={(e) => setMonth(e.target.value)}>
                        {meses.map((mes) => (
                            <SelectItem key={mes.id} value={mes.id}>
                                {mes.nombre}
                            </SelectItem>
                        ))}
                    </Select>

                    <Select label="Año" placeholder="Selecciona un año" onChange={(e) => setYear(Number(e.target.value))}>
                        <SelectItem key={2026} value={2026} textValue="2026">2026</SelectItem>
                        <SelectItem key={2025} value={2025} textValue="2025">2025</SelectItem>
                        <SelectItem key={2024} value={2024} textValue="2024">2024</SelectItem>
                        <SelectItem key={2023} value={2023} textValue="2023">2023</SelectItem>
                    </Select>
                </ModalBody>

                <ModalFooter>
                    <Button color="danger" variant="light" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button color="primary" onClick={handleSubmit} isLoading={loading}>
                        Crear Bonos
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
