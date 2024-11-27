import type { MRT_ColumnDef } from 'material-react-table';
import type { Vehicle } from '../models/vehicle-model';
import { useMemo } from 'react';

export const useTrackAvailabilityColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Vehicle>[]>(
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
        accessorFn: (row) => row.travel ? row.travel.name : 'N/A',
        header: 'Viaje',
      },
      {
        accessorFn: (row) => row.maneuver ? row.maneuver.type : 'N/A',
        header: 'Maniobra',
      },
    ],
    [],
  );

  return {
    columns,
  };
};

