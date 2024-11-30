import React, { useState, useEffect, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
const { VITE_PHIDES_API_URL } = import.meta.env;

const CostosExtrasContext = React.createContext();

const CostosExtrasProvider = ({ children }) => {
    const [costosExtras, setCE] = useState([]);

    const actualizarCE = (costos) => {
        setCE(costos);
    }

    const [informacion, setViaje] = useState({
        carta_Po: null,
        name: '0',
        estado: 'disponible',
        id_cliente: '0',
        cliente: ' ',
        modo: ' ',
        armado: ' ',
        ejecutivo: ' ',
        vehiculo: '0',
        id_operador: '0',
        operador: '0',
        contenedores: '0'
    });

    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getViaje = async (id_viaje) => {
        setLoading(true);
        setError(null);

        try {
            setLoading(true);
            const response = await fetch(VITE_PHIDES_API_URL + '/viajes/viaje/getViaje.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    id_viaje: id_viaje,
                }),
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();
            setViaje({
                id: data[0].id,
                name: data[0].name,
                id_cliente: data[0].id_cliente,
                cliente: data[0].cliente,
                estado: data[0].x_status_viaje,
                id_operador: data[0].id_operador,
                operador: data[0].operador,
                vehiculo: data[0].vehiculo,
                modo: data[0].modo,
                tipo_armado: data[0].tipo_armado,
                contenedores: data[0].contenedores,
                ejecutivo: data[0].x_ejecutivo_viaje_bel,
            });
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
        <CostosExtrasContext.Provider value={{
            costosExtras,
            actualizarCE
        }}>
            {children}
        </CostosExtrasContext.Provider>
    );
};

export { CostosExtrasProvider, CostosExtrasContext };
