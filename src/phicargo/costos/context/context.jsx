import React, { useState, useEffect, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import odooApi from '@/phicargo/modules/core/api/odoo-api';

const CostosExtrasContext = React.createContext();

const CostosExtrasProvider = ({ children }) => {

    const [formData, setFormData] = useState({
        id_folio: null,
        status: 'borrador',
        facturado: false,
        ref_factura: null,
    });

    const [DisabledForm, setDisabledForm] = useState(false);

    const [id_folio, setIDFolio] = useState(null);
    const [CartasPorte, setCPS] = useState([]);
    const [CartasPorteEliminadas, setCPSEliminadas] = useState([]);

    const [CostosExtras, setCostosExtras] = useState([]);
    const [CostosExtrasEliminados, setCostosExtrasEliminados] = useState([]);

    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    return (
        <CostosExtrasContext.Provider value={{
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
            setCostosExtrasEliminados
        }}>
            {children}
        </CostosExtrasContext.Provider>
    );
};

export { CostosExtrasProvider, CostosExtrasContext };
