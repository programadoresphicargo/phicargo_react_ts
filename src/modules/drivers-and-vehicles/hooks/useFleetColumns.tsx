import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';

import { Chip } from '@heroui/react';
import { Fleet } from '@/modules/vehicles/models';
import { Dayjs } from 'dayjs';
import { SxProps, Theme } from '@mui/system';

const TravelSxConf: SxProps<Theme> = {
  backgroundColor: '#007ffb',
  fontFamily: 'Inter',
  fontSize: '12px',
  color: 'white',
};

const ManeuverSxConf: SxProps<Theme> = {
  backgroundColor: '#004cc4',
  fontFamily: 'Inter',
  fontSize: '12px',
  color: 'white',
};

export const useFleetColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Fleet>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Vehículo',
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
        accessorKey: 'tipoVehiculo',
        header: 'Categoria',
      },
      {
        accessorKey: 'driver',
        header: 'Operador (Tracto)',
      },
      {
        accessorKey: 'trailerDriver',
        header: 'Operador (Remolque)',
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        Cell: ({ cell }) => {
          const estado = cell.getValue<string | null>() ?? 'desconocido';
          let badgeClass: 'default' | 'primary' | 'danger' = 'default';

          if (estado === 'viaje') {
            badgeClass = 'primary';
          } else if (estado === 'maniobra') {
            badgeClass = 'danger';
          }

          return (
            <Chip color={badgeClass} size="sm" className="text-white uppercase">
              <strong>{estado}</strong>
            </Chip>
          );
        },
      },
      {
        accessorKey: 'ultimoUso',
        header: 'Último uso',
        Cell: ({ cell }) => {
          const estado = cell.getValue<string | null>();

          if (!estado) return null;

          let badgeClass: 'default' | 'primary' | 'danger' = 'default';

          if (estado === 'viaje') {
            badgeClass = 'primary';
          } else if (estado === 'maniobra') {
            badgeClass = 'danger';
          }

          return (
            <Chip color={badgeClass} size="sm">
              <strong>{estado.toUpperCase()}</strong>
            </Chip>
          );
        },
      },
      {
        accessorFn: (row) => row.ultimoUsoFecha,
        header: 'Último uso fecha',
        Cell: ({ cell }) =>
          cell.getValue<Dayjs | null>()?.format('DD/MM/YYYY HH:mm') ?? 'N/A',
      },
      {
        accessorKey: 'referenciaViaje',
        header: 'Último viaje',
        muiTableBodyCellProps: {
          sx: {
            backgroundColor: '#007ffb',
            fontFamily: 'Inter',
            fontSize: '12px',
            color: 'white',
          },
        },
      },
      {
        accessorKey: 'sucursalViaje',
        header: 'Sucursal',
        muiTableBodyCellProps: {
          sx: TravelSxConf,
        },
      },
      {
        accessorFn: (row) => row.lastTravelEndDate,
        header: 'Finalización',
        Cell: ({ cell }) =>
          cell.getValue<Dayjs | null>()?.format('DD/MM/YYYY HH:mm') ?? 'N/A',
        muiTableBodyCellProps: {
          sx: TravelSxConf,
        },
      },
      {
        accessorKey: 'operadorViaje',
        header: 'Operador',
        muiTableBodyCellProps: {
          sx: TravelSxConf,
        },
      },
      {
        accessorKey: 'lastManeuverId',
        header: 'ID Maniobra',
        muiTableBodyCellProps: {
          sx: ManeuverSxConf,
        },
      },
      {
        accessorFn: (row) => row.lastManeuverEndDate,
        header: 'Finalización',
        Cell: ({ cell }) =>
          cell.getValue<Dayjs | null>()?.format('DD/MM/YYYY HH:mm') ?? 'N/A',
        muiTableBodyCellProps: {
          sx: ManeuverSxConf,
        },
      },
      {
        accessorKey: 'operadorManeuver',
        header: 'Operador',
        muiTableBodyCellProps: {
          sx: ManeuverSxConf,
        },
      },
    ],
    [],
  );

  return columns;
};

