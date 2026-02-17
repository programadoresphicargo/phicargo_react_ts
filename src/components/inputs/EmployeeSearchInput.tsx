import { Control, FieldValues, Path } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { AutocompleteInput } from './AutocompleteInput';
import type { Employee } from '@/modules/drivers/models';
import { SelectItem } from '@/types';
import { useDebounce } from '@/hooks';
import { useDriverQueries } from '@/modules/drivers/hooks/queries';

const findEmployee = (driver: Employee[], term: string) => {
  return driver.filter((v) =>
    v.empleado.toLowerCase().includes(term.toLowerCase()),
  );
};

const transformData = (data: Employee[]): SelectItem[] => {
  return data.map((v) => ({ value: v.empleado, key: v.id_empleado }));
};

interface Props<T extends FieldValues> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  employeeId?: number | null;
  isDisabled?: boolean;
}

export const EmployeeSearchInput = <T extends FieldValues>(props: Props<T>) => {
  const { control, name, label, employeeId, required, isDisabled } = props;

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [data, setData] = useState<SelectItem[]>([]);

  const { employeesQuery } = useDriverQueries();

  const employee = useMemo(
    () => (employeeId ? employeesQuery.data?.find((v) => v.id_empleado === employeeId) : null),
    [employeeId, employeesQuery.data],
  );

  useEffect(() => {
    if (debouncedSearchTerm !== '') {
      const findedItems = findEmployee(
        employeesQuery.data || [],
        debouncedSearchTerm,
      );
      setData(transformData(findedItems));
    } else {
      setData(transformData(employeesQuery.data || []));
    }
  }, [employeesQuery.data, debouncedSearchTerm]);

  return (
    <AutocompleteInput
      control={control}
      name={name}
      label={label || 'Empleado en Odoo'}
      items={data}
      isLoading={employeesQuery.isFetching}
      searchInput={searchTerm ? searchTerm : employee?.empleado || ''}
      setSearchInput={setSearchTerm}
      rules={required ? { required: 'Empleado obligatorio' } : {}}
      isDisabled={isDisabled}
    />
  );
};

