import { createContext, useContext, useState } from 'react';

const AlmacenContext = createContext();

export const AlmacenProvider = ({ children }) => {
    const [eepAñadido, setEPPAñadido] = useState([]);
    const [eepRemovido, setEPPRemovdo] = useState([]);

    return (
        <AlmacenContext.Provider
            value={{
                eepAñadido,
                setEPPAñadido,
                eepRemovido,
                setEPPRemovdo
            }}>
            {children}
        </AlmacenContext.Provider>
    );
};

export const useAlmacen = () => useContext(AlmacenContext);
