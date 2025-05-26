import { createContext, useContext, useState } from 'react';

const AlmacenContext = createContext();

export const AlmacenProvider = ({ children }) => {
    const [epp, setEPP] = useState([]);
    const [eppUpdated, setEPPUpdated] = useState([]);
    const [eppAdded, setEPPAdded] = useState([]);
    const [eppRemoved, setEPPRemoved] = useState([]);

    return (
        <AlmacenContext.Provider
            value={{
                epp, setEPP,
                eppUpdated, setEPPUpdated,
                eppAdded, setEPPAdded,
                eppRemoved, setEPPRemoved
            }}>
            {children}
        </AlmacenContext.Provider>
    );
};

export const useAlmacen = () => useContext(AlmacenContext);
