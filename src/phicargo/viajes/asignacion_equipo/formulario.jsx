import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import SelectFlota from '@/phicargo/maniobras/maniobras/selects_flota';
import HistorialCambioEquipo from './historial';

const FormularioAsignacionEquipo = ({ id_cp, id_pre_asignacion, isOpen, onOpenChange }) => {

    const [isEditMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ id_cp });
    const isDisabled = id_pre_asignacion ? !isEditMode : false;
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setFormData({ id_cp });
        setEditMode(false);    // cuando cambia el registro, modo edición reset
        getData();
    }, [id_cp, id_pre_asignacion]);

    const handleSelectChange = (value, name) => {
        setFormData(prev => ({
            ...prev,
            [name]: value ?? null,
        }));
    };

    const guardar = async () => {
        try {
            setLoading(true);

            const res = await odooApi.post('/preasignacion_equipo/', formData);

            if (res.data.status === "success") toast.success(res.data.message);

            onOpenChange(false); // cerrar modal
        } catch (error) {
            toast.error("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const actualizar = async () => {
        try {
            setLoading(true);

            const res = await odooApi.patch(`/preasignacion_equipo/${id_pre_asignacion}`, formData);

            if (res.data.status === "success") toast.success(res.data.message);

            setEditMode(false);
        } catch (error) {
            toast.error("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const asignar_viaje = async () => {
        try {
            setLoading(true);
            const res = await odooApi.post(`/preasignacion_equipo/asignar_viaje/${id_pre_asignacion}`);
            if (res.data.status === "success") toast.success(res.data.message);
            onOpenChange(false);
        } catch (error) {
            toast.error("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const getData = async () => {
        if (!id_pre_asignacion) return;

        try {
            setLoading(true);
            const res = await odooApi.get(`/preasignacion_equipo/${id_pre_asignacion}`);
            setFormData(res.data);
        } catch (error) {
            toast.error("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setFormData({ id_cp }); // reset base
        getData();
    }, [id_cp, id_pre_asignacion]);

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='5xl'>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Asignación de equipo</ModalHeader>

                        <ModalBody>

                            <div style={{ display: "flex", gap: "20px" }}>
                                <div style={{ flex: 2 }}>
                                    <div className="flex flex-row gap-3">

                                        {id_pre_asignacion == null && (
                                            <Button
                                                color="success"
                                                className="text-white"
                                                radius="full"
                                                isLoading={isLoading}
                                                onPress={guardar}
                                            >
                                                Guardar asignación
                                            </Button>
                                        )}

                                        {id_pre_asignacion != null && !isEditMode && (
                                            <>
                                                <Button
                                                    color="primary"
                                                    className="text-white"
                                                    radius="full"
                                                    onPress={() => setEditMode(true)}
                                                >
                                                    Editar
                                                </Button>

                                                <Button
                                                    color="danger"
                                                    className="text-white"
                                                    radius="full"
                                                    isDisabled
                                                    isLoading={isLoading}
                                                    onPress={asignar_viaje}
                                                >
                                                    Asignar a viaje
                                                </Button>
                                            </>
                                        )}

                                        {id_pre_asignacion != null && isEditMode && (
                                            <Button
                                                color="warning"
                                                className="text-white"
                                                radius="full"
                                                isLoading={isLoading}
                                                onPress={actualizar}
                                            >
                                                Actualizar asignación
                                            </Button>
                                        )}
                                    </div>

                                    <div className="w-full flex flex-row flex-wrap gap-4 mt-3">

                                        <SelectFlota
                                            label="Remolque 1"
                                            name="trailer1_id"
                                            onChange={handleSelectChange}
                                            value={formData.trailer1_id}
                                            tipo="trailer"
                                            disabled={isDisabled}
                                        />

                                        <SelectFlota
                                            label="Remolque 2"
                                            name="trailer2_id"
                                            onChange={handleSelectChange}
                                            value={formData.trailer2_id}
                                            tipo="trailer"
                                            disabled={isDisabled}
                                        />

                                        <SelectFlota
                                            label="Dolly"
                                            name="dolly_id"
                                            onChange={handleSelectChange}
                                            value={formData.dolly_id}
                                            tipo="dolly"
                                            disabled={isDisabled}
                                        />

                                        <SelectFlota
                                            label="Motogenerador 1"
                                            name="motogenerador1_id"
                                            onChange={handleSelectChange}
                                            value={formData.motogenerador1_id}
                                            tipo="other"
                                            disabled={isDisabled}
                                        />

                                        <SelectFlota
                                            label="Motogenerador 2"
                                            name="motogenerador2_id"
                                            onChange={handleSelectChange}
                                            value={formData.motogenerador2_id}
                                            tipo="other"
                                            disabled={isDisabled}
                                        />

                                    </div>
                                </div>

                                <div style={{
                                    flex: 2,
                                    height: 400,
                                    overflowY: "auto",
                                    paddingRight: "5px"
                                }}>
                                    <HistorialCambioEquipo id_pre_asignacion={id_pre_asignacion}></HistorialCambioEquipo>
                                </div>
                            </div>

                        </ModalBody>

                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancelar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default FormularioAsignacionEquipo;
