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
                    toast.error('No hay correos electronicos ligados.');
                    ActualizarCorreosLigados(true);
                }
            })
            .catch(error => {
                toast.error('Error: ' + error);
                ActualizarCorreosLigados(true);
            });
    };

    const [viaje, setViaje] = useState({});

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
            const data = response.data[0];
            console.log(data);
            setViaje(data);
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
