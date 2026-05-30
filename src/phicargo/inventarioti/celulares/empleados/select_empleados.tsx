import { Autocomplete, AutocompleteItem, } from '@heroui/react';
import { useEffect, useState } from 'react';
import odooApi from '@/api/odoo-api';
import { Controller, FieldValues } from 'react-hook-form';
import { CustomInputProps, SelectItem } from '@/types';

interface SelectInputProps<T extends FieldValues> extends CustomInputProps<T> {
    isLoading?: boolean;
    disabledKeys?: string[];
    searchInput?: string;
    isVirtualized?: boolean;
}

type Empleado = {
    id_empleado: number;
    nombre_empleado: string;
}

export const SelectEmpleadosTI = <T extends FieldValues>(
    props: SelectInputProps<T>,
) => {

    const {
        control,
        name,
        rules,
        label,
        variant,
        isVirtualized,
        size
    } = props;

    const [empleados, setEmpleados] = useState<SelectItem[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const filteredEmpleados = empleados.filter(item =>
        item.value.toLowerCase().includes((searchInput || '').toLowerCase())
    );

    const fetchData = () => {
        odooApi.get<Empleado[]>('/inventarioti/empleados/')
            .then(response => {
                setLoading(true);
                const data = response.data.map(item => ({
                    key: item.id_empleado,
                    value: item.nombre_empleado,
                }));
                setEmpleados(data);
            })
            .catch(err => {
                console.error('Error al obtener la flota:', err);
            }).finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSelectChange = (value: string) => {
        if (!value) {
            return null;
        }
        const toNumber = Number(value);
        if (isNaN(toNumber)) {
            return value;
        } else {
            return toNumber;
        }
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { name, value, onChange }, fieldState }) => (
                <Autocomplete
                    name={name}
                    value={value}
                    size={size || 'sm'}
                    isVirtualized={isVirtualized}
                    items={filteredEmpleados}
                    label={label}
                    isLoading={isLoading}
                    selectedKey={value ? String(value) : null}
                    onSelectionChange={(key) => onChange(handleSelectChange(key as string))}
                    isInvalid={fieldState.invalid}
                    errorMessage={fieldState.error ? fieldState.error.message : null}
                    onInputChange={setSearchInput}
                    variant={variant || 'flat'}
                    inputValue={searchInput}
                >
                    {(item) => (
                        <AutocompleteItem key={item.key} className="capitalize">
                            {item.value}
                        </AutocompleteItem>
                    )}
                </Autocomplete>
            )}
        />
    );
};

export default SelectEmpleadosTI;

