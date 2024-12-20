import { Control, FieldValues, Path } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { AutocompleteInput } from '@/phicargo/modules/core/components/inputs/AutocompleteInput';
import { SelectItem } from '@/phicargo/modules/core/types/global-types';
import { Vehicle } from '@/phicargo/modules/availability/models/vehicle-model';
import { useDebounce } from '@/phicargo/modules/core/hooks';
import { useVehicleQueries } from '@/phicargo/modules/availability/hooks/useVehicleQueries';

const findVehicle = (vehicles: Vehicle[], term: string) => {
  return vehicles.filter((v) =>
    v.name.toLowerCase().includes(term.toLowerCase()),
  );
};

const transformData = (data: Vehicle[]): SelectItem[] => {
  return data.map((v) => ({ value: v.name, key: v.id }));
};

interface Props<T extends FieldValues> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any>;
  name: Path<T>;
  label?: string;
}

export const VehicleSearchInput = <T extends FieldValues>(props: Props<T>) => {
  const { control, name, label } = props;

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [data, setData] = useState<SelectItem[]>([]);

  const { vehicleQuery } = useVehicleQueries();

  useEffect(() => {
    if (debouncedSearchTerm !== '') {
      const findedItems = findVehicle(vehicleQuery.data || [], debouncedSearchTerm);
      setData(transformData(findedItems));
    } else {
      setData(transformData(vehicleQuery.data || []));
    }
  }, [vehicleQuery.data, debouncedSearchTerm]);

  return (
    <AutocompleteInput
      control={control}
      name={name}
      label={label || 'Unidad'}
      items={data}
      isLoading={vehicleQuery.isFetching}
      searchInput={searchTerm}
      setSearchInput={setSearchTerm}
      rules={{ required: 'Vehiculo obligatorio' }}
    />
  );
};

