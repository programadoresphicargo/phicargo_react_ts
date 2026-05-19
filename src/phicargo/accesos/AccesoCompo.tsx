import { ReactNode, useState } from "react";
import { toast } from "react-toastify";

import odooApi from "@/api/odoo-api";

import { AccesoContext } from "./context";

import {
    Empleado,
    Vehiculo,
    Visitante
} from "./types";

interface Props {
    children: ReactNode;
}

const AccesoProvider = ({
    children
}: Props) => {

    // =========================
    // UI
    // =========================

    const [disabledForm, setDisabledForm] =
        useState(false);

    const [fileList, setFileList] =
        useState<any[]>([]);

    // =========================
    // CATÁLOGOS
    // =========================

    const [
        visitantesDisponibles,
        setVisitantesDisponibles
    ] = useState<Visitante[]>([]);

    const [
        empleadosDisponibles,
        setEmpleadosDisponibles
    ] = useState<Empleado[]>([]);

    // =========================
    // VISITANTES
    // =========================

    const [
        visitantesOriginales,
        setVisitantesOriginales
    ] = useState<Visitante[]>([]);

    const [
        visitantesActuales,
        setVisitantesActuales
    ] = useState<Visitante[]>([]);

    const AñadirVisitanteAcceso = (
        id_visitante: number
    ) => {

        if (!id_visitante) {

            toast.error(
                "No se seleccionó ningún visitante."
            );

            return;
        }

        const visitanteSeleccionado =
            visitantesDisponibles.find(
                visitante =>
                    visitante.id_visitante ===
                    id_visitante
            );

        if (!visitanteSeleccionado) {

            toast.error(
                "No se encontró el visitante."
            );

            return;
        }

        setVisitantesActuales((prev) => {

            const existe = prev.some(
                visitante =>
                    visitante.id_visitante ===
                    visitanteSeleccionado.id_visitante
            );

            if (existe) {

                toast.warning(
                    "El visitante ya está agregado."
                );

                return prev;
            }

            toast.success(
                "Visitante añadido."
            );

            return [
                ...prev,
                visitanteSeleccionado
            ];
        });
    };

    const EliminarVisitanteAcceso = (
        id_visitante: number
    ) => {

        setVisitantesActuales((prev) => {

            const visitante = prev.find(
                visitante =>
                    visitante.id_visitante ===
                    id_visitante
            );

            if (!visitante) {

                toast.error(
                    "No se encontró el visitante."
                );

                return prev;
            }

            toast.success(
                "Visitante eliminado."
            );

            return prev.filter(
                visitante =>
                    visitante.id_visitante !==
                    id_visitante
            );
        });
    };

    // =========================
    // VEHÍCULOS
    // =========================

    const [
        vehiculosOriginales,
        setVehiculosOriginales
    ] = useState<Vehiculo[]>([]);

    const [
        vehiculosActuales,
        setVehiculosActuales
    ] = useState<Vehiculo[]>([]);

    const AñadirVehiculo = async (
        id_vehiculo: number
    ) => {

        try {

            const response =
                await odooApi.get(
                    "/vehiculos_visitantes/" +
                    id_vehiculo
                );

            const data = response.data;

            const nuevoVehiculo: Vehiculo = {
                id_vehiculo: data.id_vehiculo,
                marca: data.marca,
                modelo: data.modelo,
                placas: data.placas,
                tipo_vehiculo:
                    data.tipo_vehiculo,
                color: data.color,
                contenedor1:
                    data.contenedor1,
                contenedor2:
                    data.contenedor2,
                utilitario:
                    data.utilitario,
            };

            setVehiculosActuales((prev) => {

                const existe = prev.some(
                    vehiculo =>
                        vehiculo.id_vehiculo ===
                        nuevoVehiculo.id_vehiculo
                );

                if (existe) {

                    toast.warning(
                        "El vehículo ya está agregado."
                    );

                    return prev;
                }

                toast.success(
                    `Vehículo añadido: ${nuevoVehiculo.marca} ${nuevoVehiculo.modelo}`
                );

                return [
                    ...prev,
                    nuevoVehiculo
                ];
            });

        } catch (err) {

            console.error(err);

            toast.error(
                "Error al obtener el vehículo."
            );
        }
    };

    const EliminarVehiculo = (
        id_vehiculo: number
    ) => {

        setVehiculosActuales((prev) => {

            const vehiculo = prev.find(
                vehiculo =>
                    vehiculo.id_vehiculo ===
                    id_vehiculo
            );

            if (!vehiculo) {

                toast.error(
                    "No se encontró el vehículo."
                );

                return prev;
            }

            toast.success(
                `Vehículo eliminado: ${vehiculo.marca} ${vehiculo.modelo}`
            );

            return prev.filter(
                vehiculo =>
                    vehiculo.id_vehiculo !==
                    id_vehiculo
            );
        });
    };

    // =========================
    // EMPLEADOS
    // =========================

    const [
        empleadosOriginales,
        setEmpleadosOriginales
    ] = useState<Empleado[]>([]);

    const [
        empleadosActuales,
        setEmpleadosActuales
    ] = useState<Empleado[]>([]);

    const AñadirEmpleadoAcceso = (
        id_empleado: number
    ) => {

        if (!id_empleado) {

            toast.error(
                "No se seleccionó ningún empleado."
            );

            return;
        }

        const empleadoSeleccionado =
            empleadosDisponibles.find(
                empleado =>
                    empleado.id_empleado ===
                    id_empleado
            );

        if (!empleadoSeleccionado) {

            toast.error(
                "No se encontró el empleado."
            );

            return;
        }

        setEmpleadosActuales((prev) => {

            const existe = prev.some(
                empleado =>
                    empleado.id_empleado ===
                    empleadoSeleccionado.id_empleado
            );

            if (existe) {

                toast.warning(
                    "El empleado ya está agregado."
                );

                return prev;
            }

            toast.success(
                "Empleado añadido."
            );

            return [
                ...prev,
                empleadoSeleccionado
            ];
        });
    };

    const EliminarEmpleadoAcceso = (
        id_empleado: number
    ) => {

        setEmpleadosActuales((prev) => {

            const empleado = prev.find(
                empleado =>
                    empleado.id_empleado ===
                    id_empleado
            );

            if (!empleado) {

                toast.error(
                    "No se encontró el empleado."
                );

                return prev;
            }

            toast.success(
                "Empleado eliminado."
            );

            return prev.filter(
                empleado =>
                    empleado.id_empleado !==
                    id_empleado
            );
        });
    };

    // =========================
    // PROVIDER
    // =========================

    return (
        <AccesoContext.Provider
            value={{

                // UI
                disabledForm,
                setDisabledForm,

                fileList,
                setFileList,

                // Catálogos
                visitantesDisponibles,
                setVisitantesDisponibles,

                empleadosDisponibles,
                setEmpleadosDisponibles,

                // Visitantes
                visitantesOriginales,
                setVisitantesOriginales,

                visitantesActuales,
                setVisitantesActuales,

                AñadirVisitanteAcceso,
                EliminarVisitanteAcceso,

                // Vehículos
                vehiculosOriginales,
                setVehiculosOriginales,

                vehiculosActuales,
                setVehiculosActuales,

                AñadirVehiculo,
                EliminarVehiculo,

                // Empleados
                empleadosOriginales,
                setEmpleadosOriginales,

                empleadosActuales,
                setEmpleadosActuales,

                AñadirEmpleadoAcceso,
                EliminarEmpleadoAcceso,
            }}
        >
            {children}
        </AccesoContext.Provider>
    );
};

export default AccesoProvider;