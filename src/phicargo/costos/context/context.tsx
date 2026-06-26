import {
    createContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
    useContext,
} from 'react';

export interface CartaPorte {
    id: number;
}

interface CostosExtrasContextType {
    isLoading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;

    DisabledForm: boolean;
    setDisabledForm: Dispatch<SetStateAction<boolean>>;

    CartasPorte: CartaPorte[];
    setCPS: Dispatch<SetStateAction<CartaPorte[]>>;

    CartasPorteEliminadas: CartaPorte[];
    setCPSEliminadas: Dispatch<SetStateAction<CartaPorte[]>>;
}

interface CostosExtrasProviderProps {
    children: ReactNode;
}

export const CostosExtrasContext = createContext<CostosExtrasContextType | undefined>(
    undefined
);

export const CostosExtrasProvider = ({
    children,
}: CostosExtrasProviderProps) => {
    const [DisabledForm, setDisabledForm] = useState<boolean>(false);

    const [CartasPorte, setCPS] = useState<any[]>([]);
    const [CartasPorteEliminadas, setCPSEliminadas] = useState<any[]>([]);

    const [isLoading, setLoading] = useState<boolean>(false);

    return (
        <CostosExtrasContext.Provider
            value={{
                isLoading,
                setLoading,
                DisabledForm,
                setDisabledForm,
                CartasPorte,
                setCPS,
                CartasPorteEliminadas,
                setCPSEliminadas,
            }}
        >
            {children}
        </CostosExtrasContext.Provider>
    );
};

export const useCostosExtras = () => {
    const context = useContext(CostosExtrasContext);

    if (!context) {
        throw new Error(
            'useCostosExtras debe usarse dentro de CostosExtrasProvider'
        );
    }

    return context;
};