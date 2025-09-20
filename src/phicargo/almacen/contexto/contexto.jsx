import odooApi from '@/api/odoo-api';
import { createContext, useContext, useState } from 'react';

const AlmacenContext = createContext();

export const AlmacenProvider = ({ children }) => {

    const [data, setData] = useState({
        id: 0,
        x_waybill_id: 0,
    });
    const [modoEdicion, setModoEdicion] = useState(false);
    const [lineasGlobales, setLineasGlobales] = useState([]);
    const [isDisabled, setDisabled] = useState(false);
    const [reservasGlobales, setReservasGlobales] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async (id_solicitud) => {
        if (!id_solicitud) return;
        try {
            setLoading(true);
            const response = await odooApi.get(`/tms_travel/solicitudes_equipo/id_solicitud/${id_solicitud}`);
            setData(response.data);
            setLineasGlobales(response.data.lineas);
            setReservasGlobales(response.data.reservas);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlmacenContext.Provider
            value={{
                modoEdicion, setModoEdicion,
                data, setData,
                lineasGlobales, setLineasGlobales,
                reservasGlobales, setReservasGlobales,
                isDisabled, setDisabled,
                loading,
                fetchData, // 🔹 se expone la función aquí
            }}>
            {children}
        </AlmacenContext.Provider>
    );
};

export const useAlmacen = () => useContext(AlmacenContext);
