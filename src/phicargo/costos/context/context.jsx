import React, { useState, useEffect, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import odooApi from '@/phicargo/modules/core/api/odoo-api';

const CostosExtrasContext = React.createContext();

const CostosExtrasProvider = ({ children }) => {
    const [id_folio, setIDFolio] = useState(null);
    const [CartasPorte, setCPS] = useState([]);
    const [CartasPorteEliminadas, setCPSEliminadas] = useState([]);

    const [ServiciosAplicados, setServiciosAplicados] = useState([]);
    const [CostosExtrasEliminados, setCostosExtrasEliminados] = useState([]);

    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    return (
        <CostosExtrasContext.Provider value={{
            id_folio,
            setIDFolio,
            CartasPorte,
            setCPS,
            CartasPorteEliminadas,
            setCPSEliminadas,
            ServiciosAplicados,
            setServiciosAplicados,
            CostosExtrasEliminados, 
            setCostosExtrasEliminados
        }}>
            {children}
        </CostosExtrasContext.Provider>
    );
};

export { CostosExtrasProvider, CostosExtrasContext };
