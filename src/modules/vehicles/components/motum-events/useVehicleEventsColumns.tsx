// import { ModalityChip } from '@/modules/drivers/components/ui/ModalityChip';
// import type { Modality } from '@/modules/drivers/models';
// import { VehicleTypeChip } from '@/modules/vehicles/components/ui/VehicleTypeChip';
import type {
  MotumEvent,
} from '@/modules/vehicles/models';
import { Chip } from '@heroui/react';
import { Dayjs } from 'dayjs';
import type { MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';

export const useVehicleEventsColumns = () => {
  const columns = useMemo<MRT_ColumnDef<MotumEvent>[]>(
    () => [
      {
        accessorKey: 'vehicleName',
        header: 'Unidad',
        Cell: ({ cell }) => (
          <Chip color='primary'>{cell.getValue<string>()}</Chip>
        ),
      },
      {
        accessorKey: 'eventTypeName',
        header: 'Tipo de evento',
        Cell: ({ cell }) => (
          <span className="font-bold uppercase">{cell.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'event',
        header: 'Evento',
        Cell: ({ cell }) => (
          <span className="font-bold uppercase">{cell.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'eventDescription',
        header: 'Descripcion',
        Cell: ({ cell }) => (
          <span>{cell.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha de creación',
        Cell: ({ cell }) => {
          const value = cell.getValue<Dayjs | null>();
          return value ? (
            <span>{value.format('DD/MM/YYYY')}</span>
          ) : (
            <span className="text-gray-400">-</span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Estatus',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          const color = value === 'attended' ? 'success' : 'warning';

          return (
            <Chip color={color} className="text-white">
              {value}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'attendedBy',
        header: 'Atendida por',
        Cell: ({ cell }) => (
          <span>{cell.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'comment',
        header: 'Comentarios',
        Cell: ({ cell }) => (
          <span>{cell.getValue<string>()}</span>
        ),
      },
    ],
    [],
  );

  return columns;
};

