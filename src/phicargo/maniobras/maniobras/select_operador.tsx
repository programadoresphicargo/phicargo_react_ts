import { Autocomplete, AutocompleteItem } from "@heroui/react";

type OptionDriver = {
    key: number;
    label: string;
};

type Props = {
    options: OptionDriver[];
    label: string;
    id: string;
    name: string;
    value?: number;
    disabled?: boolean;
    isLoading?: boolean;
    error_operador?: string;
    onChange: (val: number | null) => void;
};

const SelectOperador: React.FC<Props> = ({
    label,
    id,
    name,
    onChange,
    value,
    disabled,
    error_operador,
    options,
    isLoading
}) => {

    return (
        <Autocomplete
            variant={disabled ? 'flat' : 'bordered'}
            id={id}
            label={label}
            isLoading={isLoading}
            name={name}
            isReadOnly={disabled}
            defaultItems={options}
            selectedKey={value ? String(value) : null}
            isInvalid={!!error_operador}
            errorMessage={error_operador}
            onSelectionChange={(key) =>
                onChange(key ? Number(key) : null)
            }
        >
            {(item) => (
                <AutocompleteItem key={item.key}>
                    {item.label}
                </AutocompleteItem>
            )}
        </Autocomplete>
    );
};

export default SelectOperador;