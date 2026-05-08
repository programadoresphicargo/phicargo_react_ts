import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useState } from 'react';

type OptionFlota = {
    key: number;
    label: string;
    x_tipo_carga: string;
    x_modalidad: string;
};

type Props = {
    options: OptionFlota[];
    label: string;
    id: string;
    name: string;
    value?: number;
    disabled?: boolean;
    isLoading?: boolean;
    error_operador?: string;
    onChange: (val: number | null) => void;
    filtroActivo?: boolean;
    modalidad?: string;
    tipoCarga?: string;
};

const SelectFlota: React.FC<Props> = ({
    label,
    id,
    name,
    onChange,
    value,
    disabled = false,
    isLoading = false,
    options = [],
    filtroActivo = false,
    modalidad = null,
    tipoCarga = null
}) => {

    const [filteredOptions, setFilteredOptions] = useState<OptionFlota[]>([]);

    useEffect(() => {
        if (!filtroActivo) {
            setFilteredOptions(options);
            return;
        }

        if (!modalidad || !tipoCarga) {
            setFilteredOptions(options);
            return;
        }

        const filtrados = options.filter((item) => {
            const tipoOk = item.x_tipo_carga === tipoCarga;
            const modalidadOk = item.x_modalidad === modalidad;
            return tipoOk && modalidadOk;
        });

        setFilteredOptions(filtrados);
    }, [filtroActivo, options, modalidad, tipoCarga]);

    return (
        <Autocomplete
            label={label}
            isLoading={isLoading}
            id={id}
            name={name}
            isReadOnly={disabled}
            defaultItems={filteredOptions}
            variant={disabled ? 'flat' : 'bordered'}
            selectedKey={String(value)}
            onSelectionChange={(key) =>
                onChange(key ? Number(key) : null)
            }
        >
            {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
        </Autocomplete>
    );
};

export default SelectFlota;
