import { createContext, useContext, useState } from "react";

const defaultData = {
    fecha_inicio: null,
    llegada_planta: null,
    salida_planta: null,
    fecha_finalizado: null
};

const TiemposViajeContext = createContext();

export const TiemposViajeProvider = ({ children }) => {
    const [data, setData] = useState(defaultData);

    return (
        <TiemposViajeContext.Provider value={{ data, setData }}>
            {children}
        </TiemposViajeContext.Provider>
    );
};

export const useTiemposViaje = () => {
    return useContext(TiemposViajeContext);
};
