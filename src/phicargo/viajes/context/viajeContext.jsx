import React, { useContext, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import axios from "axios";
import odooApi from '@/api/odoo-api';

const ViajeContext = React.createContext();

const ViajeProvider = ({ children }) => {

    const [id_viaje, setIDViaje] = useState(0);

    const [correosLigados, setCorreosLigados] = useState(false);

    const ActualizarCorreosLigados = (estado) => {
        setCorreosLigados(estado);
    }

    const comprobacion_correos = async () => {
        odooApi.get('/tms_travel/correos/id_viaje/' + id_viaje)
            .then(response => {
                if (response.data.length > 0) {
                    toast.success('Correos ligados.' + id_viaje);
                    ActualizarCorreosLigados(false);
                } else {
                    toast.error('No hay correos electronicos ligados.' + id_viaje);
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
            const response = await odooApi.get(`/tms_travel/${id_viaje}`);
            setViaje(response.data);
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

    const [id_reportes_agrupados, setEstatusAgrupados] = useState([]);
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const handleDrawerOpen = () => setDrawerOpen(true);
    const handleDrawerClose = () => setDrawerOpen(false);

    return (
        <ViajeContext.Provider value={{
            id_viaje,
            viaje,
            getViaje,
            setIDViaje,
            comprobacion_correos,
            correosLigados,
            isLoading,
            drawerOpen, setDrawerOpen,
            id_reportes_agrupados, setEstatusAgrupados,
        }}>
            {children}
        </ViajeContext.Provider>
    );
};

export { ViajeProvider, ViajeContext };
