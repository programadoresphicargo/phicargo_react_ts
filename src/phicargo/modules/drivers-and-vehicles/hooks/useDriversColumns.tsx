import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import type {
  Driver,
  Modality,
  DriverStatus,
} from '@/phicargo/modules/drivers/models';
import { ManeuverCell } from '../components/ui/ManeuverCell';
import { TravelCell } from '../components/ui/TravelCell';
import { DriverStatusChip } from '../../drivers/components/ui/DriverStatusChip';
import { JobChip } from '../../drivers/components/ui/JobChip';
import { ModalityChip } from '../../drivers/components/ui/ModalityChip';

export const useDriversColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Driver>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Operador',
        Cell: ({ cell }) => (
          <span className="font-bold text-xs">{cell.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'company.name',
        header: 'Compañia',
        filterVariant: 'select',
        filterSelectOptions: [
          {
            value: 'TRANSPORTES BELCHEZ',
            label: 'TRANSPORTES BELCHEZ',
          },
          {
            value: 'PHI-CARGO',
            label: 'PHI-CARGO',
          },
        ],
      },
      {
        accessorFn: (row) => (row.job ? row.job.name : 'SIN ASIGNAR'),
        header: 'Tipo',
        filterVariant: 'select',
        filterSelectOptions: [
          {
            value: 'OPERADOR',
            label: 'OPERADOR',
          },
          {
            value: 'OPERADOR POSTURERO',
            label: 'OPERADOR POSTURERO',
          },
          {
            value: 'MOVEDOR',
            label: 'MOVEDOR',
          },
        ],
        Cell: ({ row }) => <JobChip job={row.original.job.name} />,
      },
      {
        accessorFn: (row) => (row.vehicle ? row.vehicle.name : 'SIN ASIGNAR'),
        header: 'Unidad',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return value === 'SIN ASIGNAR' ? (
            <span className="text-gray-400">{cell.getValue<string>()}</span>
          ) : (
            <span className="font-bold">{cell.getValue<string>()}</span>
          );
        },
      },
      { accessorKey: 'licenseId', header: 'Licencia' },
      { accessorKey: 'licenseType', header: 'Tipo Licencia' },
      {
        accessorFn: (row) => row.modality,
        header: 'Modalidad',
        filterVariant: 'select',
        filterSelectOptions: [
          {
            value: 'full',
            label: 'FULL',
          },
          {
            value: 'single',
            label: 'SENCILLO',
          },
        ],
        Cell: ({ cell }) => (
          <ModalityChip modality={cell.getValue<Modality>()} />
        ),
      },
      {
        accessorFn: (row) => row.isDangerous,
        header: 'Peligroso',
        filterVariant: 'select',
        filterSelectOptions: [
          {
            value: 'SI',
            label: 'SI',
          },
          {
            value: 'NO',
            label: 'NO',
          },
        ],
      },
      {
        accessorFn: (row) => row.status,
        header: 'Estado',
        Cell: ({ cell }) => (
          <DriverStatusChip status={cell.getValue<DriverStatus>()} />
        ),
      },
      {
        accessorFn: (row) => (row.travel ? row.travel.name : null),
        header: 'Viaje',
        Cell: ({ cell, row }) => {
          const value = cell.getValue<number | null>();
          return !value ? (
            <span className="text-gray-400">{'SIN ASIGNAR'}</span>
          ) : (
            <TravelCell travel={row.original.travel} />
          );
        },
      },
      {
        accessorFn: (row) => row.maneuverId || null,
        header: 'Maniobra',
        Cell: ({ cell, row }) => {
          const value = cell.getValue<number | null>();
          return !value ? (
            <span className="text-gray-400">{'SIN ASIGNAR'}</span>
          ) : (
            <ManeuverCell maneuver={row.original.maneuver} />
          );
        },
      },
    ],
    [],
  );

  return {
    columns,
  };
};
