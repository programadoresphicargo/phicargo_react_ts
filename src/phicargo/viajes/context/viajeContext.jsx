import React, { useContext, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import axios from "axios";
import odooApi from '@/api/odoo-api';

const ViajeContext = React.createContext();

const ViajeProvider = ({ children }) => {
    const [id_viaje, setIDViaje] = useState(0);

    const ActualizarIDViaje = (id_viaje) => {
        setIDViaje(id_viaje);
    }

    const [correosLigados, setCorreosLigados] = useState(false);

    const ActualizarCorreosLigados = (estado) => {
        setCorreosLigados(estado);
    }

    const comprobacion_correos = async () => {
        odooApi.get('/tms_travel/correos/id_viaje/' + id_viaje)
            .then(response => {
                if (response.data.length > 0) {
                    toast.success('Correos ligados.');
                    ActualizarCorreosLigados(false);
                } else {
                    toast.error('No hay correos electronicos ligados a este viaje.');
                    ActualizarCorreosLigados(true);
                }
            })
            .catch(error => {
                toast.error('Error: ' + error);
                ActualizarCorreosLigados(true);
            });
    };

    const [viaje, setViaje] = useState({
        id: null,
        name: '0',
        store_id: 1,
        x_codigo_postal: 0,
        estado: 'disponible',
        id_cliente: '0',
        cliente: ' ',
        modo: ' ',
        armado: ' ',
        ejecutivo: ' ',
        vehicle_id: ' ',
        vehiculo: '0',
        id_operador: '0',
        operador: '0',
        contenedores: '0'
    });

    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getViaje = async (id_viaje) => {

        if (id_viaje == 0) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            setLoading(true);
            const response = await odooApi.get('/tms_travel/get_by_id/' + id_viaje);
            const data = response.data;
            console.log(data);
            setViaje({
                id: data[0].id,
                name: data[0].name,
                store_id: data[0].store_id,
                x_codigo_postal: data[0].x_codigo_postal,
                id_cliente: data[0].partner.id,
                cliente: data[0].partner.name,
                estado: data[0].x_status_viaje,
                id_operador: data[0].employee.id,
                operador: data[0].employee.name,
                vehicle_id: data[0].vehicle.id,
                vehiculo: data[0].vehicle.name,
                modo: data[0].x_modo_bel,
                tipo_armado: data[0].x_tipo_bel,
                ejecutivo: data[0].x_ejecutivo_viaje_bel,
                contenedores: data[0].x_references,
            });
            comprobacion_correos();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ViajeContext.Provider value={{
            id_viaje,
            viaje,
            getViaje,
            ActualizarIDViaje,
            comprobacion_correos,
            correosLigados,
            isLoading,
        }}>
            {children}
        </ViajeContext.Provider>
    );
};

export { ViajeProvider, ViajeContext };
