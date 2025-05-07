import React, { useContext, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import axios from "axios";
import odooApi from '@/api/odoo-api';

const ManiobraContext = React.createContext();

const ManiobraProvider = ({ children }) => {
    const [id_maniobra, setIDManiobra] = useState(0);
    const [id_cliente, setIDCliente] = useState(0);
    const [formDisabled, setFormDisabled] = useState(true);

    function getLocalISOString() {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const localDate = new Date(now.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 19);
    }

    const [formData, setFormData] = useState({
        id_maniobra: 0,
        id_usuario: 0,
        id_cp: 0,
        id_cliente: 0,
        id_terminal: '',
        tipo_maniobra: '',
        operador_id: '',
        vehicle_id: '',
        trailer1_id: '',
        trailer2_id: '',
        dolly_id: '',
        inicio_programado: getLocalISOString(),
        usuario_registro: '',
        usuario_activo: '',
        usuario_finalizo: '',
        estado_maniobra: '',
        correos_ligados: [],
        correos_desligados: [],
        cps_ligadas: [],
        cps_desligadas: [],
        comentarios: ''
    });

    return (
        <ManiobraContext.Provider value={{
            id_maniobra,
            setIDManiobra,
            id_cliente,
            setIDCliente,
            formData,
            setFormData,
            formDisabled,
            setFormDisabled
        }}>
            {children}
        </ManiobraContext.Provider>
    );
};

export { ManiobraProvider, ManiobraContext };
