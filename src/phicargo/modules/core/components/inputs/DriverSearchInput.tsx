import { Control, FieldValues, Path } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';

import { AutocompleteInput } from '@/phicargo/modules/core/components/inputs/AutocompleteInput';
import { Driver } from '@/phicargo/modules/availability/models/driver-model';
import { SelectItem } from '@/phicargo/modules/core/types/global-types';
import { useDebounce } from '@/phicargo/modules/core/hooks';
import { useDriverQueries } from '@/phicargo/modules/availability/hooks/useDriverQueries';

const findDriver = (driver: Driver[], term: string) => {
  return driver.filter((v) =>
    v.name.toLowerCase().includes(term.toLowerCase()),
  );
};

const transformData = (data: Driver[]): SelectItem[] => {
  return data.map((v) => ({ value: v.name, key: v.id }));
};

interface Props<T extends FieldValues> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  driverId?: number | null;
}

export const DriverSearchInput = <T extends FieldValues>(props: Props<T>) => {
  const { control, name, label, driverId, required } = props;

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [data, setData] = useState<SelectItem[]>([]);

  const { driversQuery } = useDriverQueries();

  const driver = useMemo(
    () => (driverId ? driversQuery.data?.find((v) => v.id === driverId) : null),
    [driverId, driversQuery.data],
  );

  useEffect(() => {
    if (debouncedSearchTerm !== '') {
      const findedItems = findDriver(
        driversQuery.data || [],
        debouncedSearchTerm,
      );
      setData(transformData(findedItems));
    } else {
      setData(transformData(driversQuery.data || []));
    }
  }, [driversQuery.data, debouncedSearchTerm]);

  return (
    <AutocompleteInput
      control={control}
      name={name}
      label={label || 'Operador'}
      items={data}
      isLoading={driversQuery.isFetching}
      searchInput={searchTerm ? searchTerm : driver?.name || ''}
      setSearchInput={setSearchTerm}
      rules={ required ? { required: 'Operador obligatorio' } : {} }
    />
  );
};

