import React, {
    createContext,
    ReactNode,
    useState,
} from 'react';

type CP = {
    id: number;
    dangerous_cargo: boolean;
};

type ManiobraContextType = {
    formDisabled: boolean;
    setFormDisabled: React.Dispatch<React.SetStateAction<boolean>>;

    correos_ligados: string[];
    setCorreosLigados: React.Dispatch<React.SetStateAction<string[]>>;

    correos_desligados: string[];
    setCorreosDesligados: React.Dispatch<React.SetStateAction<string[]>>;

    cps_ligadas: CP[];
    setCpsLigadas: React.Dispatch<React.SetStateAction<CP[]>>;

    cps_desligadas: CP[];
    setCpsDesligadas: React.Dispatch<React.SetStateAction<CP[]>>;
};

type ManiobraProviderProps = {
    children: ReactNode;
};

const ManiobraContext = createContext<ManiobraContextType>(
    {} as ManiobraContextType
);

const ManiobraProvider = ({ children }: ManiobraProviderProps) => {
    const [formDisabled, setFormDisabled] = useState<boolean>(true);

    const [correos_ligados, setCorreosLigados] = useState<string[]>([]);
    const [correos_desligados, setCorreosDesligados] = useState<string[]>([]);

    const [cps_ligadas, setCpsLigadas] = useState<CP[]>([]);
    const [cps_desligadas, setCpsDesligadas] = useState<CP[]>([]);

    return (
        <ManiobraContext.Provider
            value={{
                formDisabled,
                setFormDisabled,

                correos_ligados,
                setCorreosLigados,

                correos_desligados,
                setCorreosDesligados,

                cps_ligadas,
                setCpsLigadas,

                cps_desligadas,
                setCpsDesligadas,
            }}
        >
            {children}
        </ManiobraContext.Provider>
    );
};

export { ManiobraProvider, ManiobraContext };