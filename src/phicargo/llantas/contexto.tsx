import { ReactNode, createContext, useContext, useState } from 'react';

type SolicitudesLlantasContextType = {
    modoEdicion: boolean;
    setModoEdicion: React.Dispatch<React.SetStateAction<boolean>>;
    isDisabled: boolean;
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

const SolicitudesLlantasContext = createContext<SolicitudesLlantasContextType | undefined>(undefined);

type ProviderProps = {
    children: ReactNode;
};

export const SolicitudesLlantasProvider = ({ children }: ProviderProps) => {

    const [modoEdicion, setModoEdicion] = useState(false);
    const [isDisabled, setDisabled] = useState(false);

    return (
        <SolicitudesLlantasContext.Provider
            value={{
                modoEdicion,
                setModoEdicion,
                isDisabled,
                setDisabled,
            }}>
            {children}
        </SolicitudesLlantasContext.Provider>
    );
};

export const useSolicitudesLlantas = () => {
    const context = useContext(SolicitudesLlantasContext);

    if (!context) {
        throw new Error('useSolicitudesLlantas debe usarse dentro de SolicitudesLlantasProvider');
    }

    return context;
};
