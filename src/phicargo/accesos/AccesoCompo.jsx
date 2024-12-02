import React, { useState, useEffect } from "react";
import { AccesoContext } from "./context";
import axios from 'axios';
import { toast } from "react-toastify";
const { VITE_PHIDES_API_URL } = import.meta.env;

const AccesoCompo = ({ children }) => {
    const [id_acceso, setAcceso] = useState([]);
    const [selectVehiculos, setVehiculoSeleccionado] = useState([]);
    const [vehiculosAñadidos, setVehiculosAñadidos] = useState([]);
    const [vehiculosEliminados, setVehiculosEliminados] = useState([]);

    const ActualizarIDAacceso = (id_acceso) => {
        setAcceso(id_acceso);
    }

    const AñadirVehiculo = (id_vehiculo) => {
        const vehiculoData = { id_vehiculo };

        axios.post(VITE_PHIDES_API_URL + "/accesos/vehiculos/getVehiculo.php", vehiculoData)
            .then(response => {
                const data = response.data[0];
                const nuevoVehiculo = {
                    value: data.id_vehiculo,
                    marca: data.marca,
                    modelo: data.modelo,
                    placas: data.placas,
                    color: data.color,
                    contenedor1: data.contenedor1,
                    contenedor2: data.contenedor2,
                };

                const existe = selectVehiculos.some(vehiculo => vehiculo.value === nuevoVehiculo.value);

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
        getVehiculos(id_acceso);
    }, [id_acceso])

    const getVehiculos = (id_acceso) => {

        axios.post(VITE_PHIDES_API_URL + "/accesos/accesos/getVehiculos.php?id_acceso=" + id_acceso)
            .then(response => {
                const nuevosVehiculos = response.data.map(data => ({
                    value: data.id_vehiculo,
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
            const updatedList = prev.filter(vehiculo => vehiculo.value !== id_vehiculo);
            const vehiculoEliminado = prev.find(vehiculo => vehiculo.value === id_vehiculo);
            if (vehiculoEliminado) {
                setVehiculosEliminados((prevEliminados) => [...prevEliminados, vehiculoEliminado]);
                toast.success(`Vehículo eliminado: ${vehiculoEliminado.marca} ${vehiculoEliminado.modelo}`);
            }
            return updatedList;
        });
    };

    return (
        <AccesoContext.Provider value={{ id_acceso, ActualizarIDAacceso, selectVehiculos, AñadirVehiculo, EliminarVehiculo, vehiculosAñadidos, vehiculosEliminados }}>
            {children}
        </AccesoContext.Provider>
    );
};

export default AccesoCompo;
