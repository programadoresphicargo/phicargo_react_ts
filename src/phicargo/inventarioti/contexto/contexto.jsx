import { createContext, useContext, useState } from 'react';

// Valor inicial del contexto
const InventarioTIContext = createContext({});

export const InventarioProvider = ({ children }) => {
    const [form_data, setFormData] = useState({ data: [], celulares: [], equipo_computo: [] });

    return (
        <InventarioTIContext.Provider value={{ form_data, setFormData }}>
            {children}
        </InventarioTIContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useInventarioTI = () => useContext(InventarioTIContext);
