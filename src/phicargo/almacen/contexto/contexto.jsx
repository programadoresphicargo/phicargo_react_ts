import { createContext, useContext, useState } from 'react';

const AlmacenContext = createContext();

export const AlmacenProvider = ({ children }) => {

    const [data, setData] = useState({
        id_viaje: 0,
        observaciones: "",
    });
    const [modoEdicion, setModoEdicion] = useState(false);
    const [epp, setEPP] = useState([]);
    const [eppUpdated, setEPPUpdated] = useState([]);
    const [eppAdded, setEPPAdded] = useState([]);
    const [eppRemoved, setEPPRemoved] = useState([]);
    const [isDisabled, setDisabled] = useState(false);

    return (
        <AlmacenContext.Provider
            value={{
                modoEdicion, setModoEdicion,
                data, setData,
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
