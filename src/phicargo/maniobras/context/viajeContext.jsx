import React, { useContext, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import odooApi from '@/api/odoo-api';

const ManiobraContext = React.createContext();

const ManiobraProvider = ({ children }) => {
    const [formDisabled, setFormDisabled] = useState(true);

    const [correos_ligados, setCorreosLigados] = useState([]);
    const [correos_desligados, setCorreosDesligados] = useState([]);

    const [cps_ligadas, setCpsLigadas] = useState([]);
    const [cps_desligadas, setCpsDesligadas] = useState([]);

    return (
        <ManiobraContext.Provider value={{
            formDisabled,
            setFormDisabled,
            correos_ligados, setCorreosLigados,
            correos_desligados, setCorreosDesligados,
            cps_ligadas, setCpsLigadas,
            cps_desligadas, setCpsDesligadas
        }}>
            {children}
        </ManiobraContext.Provider>
    );
};

export { ManiobraProvider, ManiobraContext };
