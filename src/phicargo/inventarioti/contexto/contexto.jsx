import { createContext, useContext, useState } from 'react';

// Valor inicial del contexto
const InventarioTIContext = createContext({
    celulares_asignados: [],
    setCelularesAsignados: () => { }
});

export const InventarioProvider = ({ children }) => {
    const [celulares_asignados, setCelularesAsignados] = useState([]);

    return (
        <InventarioTIContext.Provider value={{ celulares_asignados, setCelularesAsignados }}>
            {children}
        </InventarioTIContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useInventarioTI = () => useContext(InventarioTIContext);
