import React, { useEffect, useState } from "react";

import { AccesoContext } from "./context";
import axios from 'axios';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { useAuthContext } from "@/modules/auth/hooks";

const AccesoCompo = ({ children }) => {
    const { session } = useAuthContext();
    const [id_acceso, setAcceso] = useState(null);
    const [disabledFom, setFormOptions] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [empresas, setEmpresas] = useState([]);

    const obtenerFechaLocal = () => {
        const fecha = new Date();
        const pad = n => n.toString().padStart(2, '0');

        const anio = fecha.getFullYear();
        const mes = pad(fecha.getMonth() + 1);
        const dia = pad(fecha.getDate());
        const hora = pad(fecha.getHours());
        const minutos = pad(fecha.getMinutes());
        const segundos = pad(fecha.getSeconds());

        return `${anio}-${mes}-${dia}T${hora}:${minutos}:${segundos}`;
    };

    const fechaFormateada = obtenerFechaLocal();

    const [formData, setFormData] = useState({
        id_acceso: id_acceso,
        id_usuario: session.user.id,
        estado_acceso: '',
        id_empresa: '',
        nombre_empresa: '',
        fecha_entrada: fechaFormateada,
        fecha_salida: fechaFormateada,
        motivo: '',
        notas: '',
        tipo_identificacion: '',
        tipo_movimiento: '',
        areas: '',
        usuario_creacion: '',
        usuario_valido: '',
        usuario_archivo: '',
        fecha_creacion: '',
        fecha_validacion: '',
        fecha_archivado: '',
        personal_visita: session.user.name
    });

    const [visitantes, setVisitantes] = useState([]);
    const [selectedVisitantes, setSelectedVisitantes] = useState([]);
    const [addedVisitors, setAddedVisitors] = useState([]);
    const [removedVisitors, setRemovedVisitors] = useState([]);

    const [selectVehiculos, setVehiculoSeleccionado] = useState([]);
    const [vehiculosAñadidos, setVehiculosAñadidos] = useState([]);
    const [vehiculosEliminados, setVehiculosEliminados] = useState([]);

    const ActualizarIDAacceso = (id_acceso) => {
        setAcceso(id_acceso);
    }

    const AñadirVisitanteAcceso = (value) => {
        if (!value) {
            toast.error("No se seleccionó ningún visitante.");
            return;
        }

        const selectedVisitor = visitantes.find(option => option.id_visitante === value);

        if (selectedVisitor) {
            setSelectedVisitantes((prevVisitantes) => {
                const isSelected = prevVisitantes.some(v => v.id_visitante === selectedVisitor.id_visitante);

                if (!isSelected) {
                    setAddedVisitors((prevAdded) => {
                        if (!prevAdded.some(v => v.id_visitante === selectedVisitor.id_visitante)) {
                            toast.success(`Visitante añadido a la lista.`);
                            return [...prevAdded, selectedVisitor];
                        }
                        toast.info(`El visitante "${selectedVisitor.id_visitante}" ya estaba en la lista de añadidos.`);
                        return prevAdded;
                    });

                    return [...prevVisitantes, selectedVisitor];
                }

                toast.warning(`El visitante "${selectedVisitor.id_visitante}" ya estaba seleccionado.`);
                return prevVisitantes;
            });
        } else {
            toast.error("No se encontró el visitante seleccionado.");
        }
    };

    const AñadirVehiculo = (id_vehiculo) => {
        odooApi.get("/vehiculos_visitantes/" + id_vehiculo)
            .then(response => {
                const data = response.data;
                const nuevoVehiculo = {
                    id_vehiculo: data.id_vehiculo,
                    marca: data.marca,
                    modelo: data.modelo,
                    placas: data.placas,
                    color: data.color,
                    contenedor1: data.contenedor1,
                    contenedor2: data.contenedor2,
                };

                const existe = selectVehiculos.some(vehiculo => vehiculo.id_vehiculo === nuevoVehiculo.id_vehiculo);

                if (!existe) {
                    setVehiculoSeleccionado((prev) => {
                        const updatedList = [...prev, nuevoVehiculo];
                        setVehiculosAñadidos((prevAñadidos) => [...prevAñadidos, nuevoVehiculo]);
                        toast.success(`Vehículo añadido: ${nuevoVehiculo.marca} ${nuevoVehiculo.modelo}`);
                        return updatedList;
                    });
                } else {
                    toast.error("El vehículo ya está en la lista.");
                }
            })
            .catch(err => {
                console.error('Error al obtener la flota:', err);
            });
    };

    useEffect(() => {
        if (!id_acceso) return;
        getVehiculos(id_acceso);
    }, [id_acceso])

    const getVehiculos = (id_acceso) => {

        odooApi.get("/accesos/get_vehiculos/" + id_acceso)
            .then(response => {
                const nuevosVehiculos = response.data.map(data => ({
                    id_vehiculo: data.id_vehiculo,
                    marca: data.marca,
                    modelo: data.modelo,
                    placas: data.placas,
                    color: data.color,
                    contenedor1: data.contenedor1,
                    contenedor2: data.contenedor2,
                }));

                setVehiculoSeleccionado((prev) => [...prev, ...nuevosVehiculos]);
            })
            .catch(err => {
                console.error('Error al obtener la flota:', err);
            });
    };

    const EliminarVehiculo = (id_vehiculo) => {
        setVehiculoSeleccionado((prev) => {
            const updatedList = prev.filter(vehiculo => vehiculo.id_vehiculo !== id_vehiculo);
            const vehiculoEliminado = prev.find(vehiculo => vehiculo.id_vehiculo === id_vehiculo);
            if (vehiculoEliminado) {
                setVehiculosEliminados((prevEliminados) => [...prevEliminados, vehiculoEliminado]);
                toast.success(`Vehículo eliminado: ${vehiculoEliminado.marca} ${vehiculoEliminado.modelo}`);
            }
            return updatedList;
        });
    };

    return (
        <AccesoContext.Provider value={{
            id_acceso, formData,
            disabledFom, setFormOptions,
            visitantes, setVisitantes,
            AñadirVisitanteAcceso,
            selectedVisitantes, setSelectedVisitantes,
            addedVisitors, setAddedVisitors,
            removedVisitors, setRemovedVisitors,
            setFormData, empresas, setEmpresas, ActualizarIDAacceso, selectVehiculos, AñadirVehiculo, EliminarVehiculo, vehiculosAñadidos, vehiculosEliminados,
            fileList, setFileList
        }}>
            {children}
        </AccesoContext.Provider>
    );
};

export default AccesoCompo;
