import odooApi from '@/api/odoo-api';
import { createContext, useContext, useState } from 'react';

const SolicitudesLlantasContext = createContext();

export const SolicitudesLlantasProvider = ({ children }) => {

    const [modoEdicion, setModoEdicion] = useState(false);
    const [isDisabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <SolicitudesLlantasContext.Provider
            value={{
                modoEdicion,
                setModoEdicion,
                isDisabled,
                setDisabled,
                loading,
            }}>
            {children}
        </SolicitudesLlantasContext.Provider>
    );
};

export const useSolicitudesLlantas = () => useContext(SolicitudesLlantasContext);
