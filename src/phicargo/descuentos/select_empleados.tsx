import { useEffect, useState } from 'react';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
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
  empleado: string;
}

export const SelectEmpleado = <T extends FieldValues>(
  props: SelectInputProps<T>,
) => {

  const {
    control,
    name,
    rules,
    label,
    variant,
    isVirtualized,
    size,
    isDisabled
  } = props;

  const [data, setData] = useState<SelectItem[]>([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get<Empleado[]>('/drivers/employees/');
      const data = response.data.map(item => ({
        key: String(item.id_empleado),
        value: item.empleado,
      }));
      setData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error al obtener los datos:', error);
    }
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
          fullWidth
          variant={variant || 'flat'}
          label={label}
          isLoading={isLoading}
          selectedKey={value ? String(value) : null}
          onSelectionChange={(key) => onChange(handleSelectChange(key as string))}
          isInvalid={fieldState.invalid}
          errorMessage={fieldState.error ? fieldState.error.message : null}
          isDisabled={isDisabled}
        >
          {data.map((user) => (
            <AutocompleteItem key={user.key}>
              {user.value}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      )}
    />
  );
};