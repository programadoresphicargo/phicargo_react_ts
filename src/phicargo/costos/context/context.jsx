import React, { useContext, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import axios from "axios";
import odooApi from '@/api/odoo-api';

const CostosExtrasContext = React.createContext();

const CostosExtrasProvider = ({ children }) => {

    const [formData, setFormData] = useState({
        id_folio: null,
        status: 'borrador',
        facturado: false,
        referencia_factura: null,
    });

    const [DisabledForm, setDisabledForm] = useState(false);

    const [id_folio, setIDFolio] = useState(null);
    const [CartasPorte, setCPS] = useState([]);
    const [CartasPorteEliminadas, setCPSEliminadas] = useState([]);

    const [CostosExtras, setCostosExtras] = useState([]);
    const [CostosExtrasEliminados, setCostosExtrasEliminados] = useState([]);

    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [agregarConcepto, setAC] = useState(false);
    const [horasEstadias, setHE] = useState(0);

    return (
        <CostosExtrasContext.Provider value={{
            isLoading,
            setLoading,
            DisabledForm,
            setDisabledForm,
            formData,
            setFormData,
            id_folio,
            setIDFolio,
            CartasPorte,
            setCPS,
            CartasPorteEliminadas,
            setCPSEliminadas,
            CostosExtras,
            setCostosExtras,
            CostosExtrasEliminados,
            setCostosExtrasEliminados,
            agregarConcepto,
            setAC,
            horasEstadias, 
            setHE
        }}>
            {children}
        </CostosExtrasContext.Provider>
    );
};

export { CostosExtrasProvider, CostosExtrasContext };
