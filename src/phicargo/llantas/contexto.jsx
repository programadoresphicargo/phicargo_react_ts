import odooApi from '@/api/odoo-api';
import { createContext, useContext, useState } from 'react';

const SolicitudesLlantasContext = createContext();

export const SolicitudesLlantasProvider = ({ children }) => {

    const [data, setData] = useState({
        id: 0,
        x_waybill_id: 0,
    });
    const [modoEdicion, setModoEdicion] = useState(false);
    const [lineasGlobales, setLineasGlobales] = useState([]);
    const [isDisabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchData = async (id_solicitud) => {
        if (!id_solicitud) return;
        try {
            setLoading(true);
            const response = await odooApi.get(`/solicitudes_llantas/${id_solicitud}`);
            setData(response.data);
            setLineasGlobales(response.data.lineas || []);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SolicitudesLlantasContext.Provider
            value={{
                modoEdicion, setModoEdicion,
                data, setData,
                lineasGlobales, setLineasGlobales,
                isDisabled, setDisabled,
                loading,
                fetchData, // 🔹 se expone la función aquí
            }}>
            {children}
        </SolicitudesLlantasContext.Provider>
    );
};

export const useSolicitudesLlantas = () => useContext(SolicitudesLlantasContext);
