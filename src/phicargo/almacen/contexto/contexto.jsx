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

    return (
        <AlmacenContext.Provider
            value={{
                modoEdicion, setModoEdicion,
                data, setData,
                lineasGlobales, setLineasGlobales,
                reservasGlobales, setReservasGlobales,
                isDisabled, setDisabled,
            }}>
            {children}
        </AlmacenContext.Provider>
    );
};

export const useAlmacen = () => useContext(AlmacenContext);
