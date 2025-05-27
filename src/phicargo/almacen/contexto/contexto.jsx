import { createContext, useContext, useState } from 'react';

const AlmacenContext = createContext();

export const AlmacenProvider = ({ children }) => {
    const [epp, setEPP] = useState([]);
    const [eppUpdated, setEPPUpdated] = useState([]);
    const [eppAdded, setEPPAdded] = useState([]);
    const [eppRemoved, setEPPRemoved] = useState([]);
    const [isDisabled, setDisabled] = useState(false);

    return (
        <AlmacenContext.Provider
            value={{
                epp, setEPP,
                eppUpdated, setEPPUpdated,
                eppAdded, setEPPAdded,
                eppRemoved, setEPPRemoved,
                isDisabled, setDisabled
            }}>
            {children}
        </AlmacenContext.Provider>
    );
};

export const useAlmacen = () => useContext(AlmacenContext);
