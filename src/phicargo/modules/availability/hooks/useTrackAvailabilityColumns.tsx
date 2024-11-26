import type { MRT_ColumnDef } from 'material-react-table';
import type { VehicleWithTravelRef } from '../models/vehicle-model';
import { useMemo } from 'react';

export const useTrackAvailabilityColumns = () => {
  const columns = useMemo<MRT_ColumnDef<VehicleWithTravelRef>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Vehículo',
      },
      {
        accessorKey: 'serialNumber',
        header: 'Número de serie',
      },
      {
        accessorKey: 'licensePlate',
        header: 'Placas',
      },
      {
        accessorKey: 'fleetType',
        header: 'Tipo de vehiculo',
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        Cell: ({ cell }) => {
          const estado = cell.getValue<string>() || 'desconocido';
          let badgeClass = 'badge rounded-pill ';

          if (estado === 'viaje') {
            badgeClass += 'bg-primary';
          } else if (estado === 'maniobra') {
            badgeClass += 'bg-danger';
          } else {
            badgeClass += 'bg-secondary';
          }

          return (
            <span className={badgeClass} style={{ width: '100px' }}>
              {estado} {/* Cambiado {{ estado }} a {estado} */}
            </span>
          );
        },
      },
      {
        accessorKey: 'travelReference',
        header: 'Viaje',
      },
      {
        accessorKey: 'maneuver',
        header: 'Maniobra',
      },
    ],
    [],
  );

  return {
    columns,
  };
};

