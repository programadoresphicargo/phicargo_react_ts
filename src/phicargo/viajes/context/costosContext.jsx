import React, { useState, useEffect, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import odooApi from '@/phicargo/modules/core/api/odoo-api';

const CostosExtrasContext = React.createContext();

const CostosExtrasProvider = ({ children }) => {
    const [ServiciosAplicados, setServiciosAplicados] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    return (
        <CostosExtrasContext.Provider value={{
            ServiciosAplicados,
            setServiciosAplicados
        }}>
            {children}
        </CostosExtrasContext.Provider>
    );
};

export { CostosExtrasProvider, CostosExtrasContext };
