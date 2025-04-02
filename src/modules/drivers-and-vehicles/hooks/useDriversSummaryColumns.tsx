import { ActivePermissionCell } from '../components/ui/ActivePermissionCell';
import { Chip } from '@heroui/react';
import type { DriverWithRealStatus } from '@/modules/drivers/models';
import { JobChip } from '../../drivers/components/ui/JobChip';
import type { MRT_ColumnDef } from 'material-react-table';
import { ManeuverCell } from '../components/ui/ManeuverCell';
import { TravelCell } from '../components/ui/TravelCell';
import { getDriverRealStatusConf } from '../utilities/get-driver-real-status-conf';
import { useMemo } from 'react';

/**
 * Custom hook to get the columns for the drivers summary table
 * @returns Columns for the drivers summary table
 */
export const useDriversSummaryColumns = () => {
  const columns = useMemo<MRT_ColumnDef<DriverWithRealStatus>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Operador',
        Cell: ({ cell }) => (
          <span className="font-bold">{cell.getValue<string>()}</span>
        ),
      },
      {
        accessorFn: (row) => (row.job ? row.job.name : 'N/A'),
        header: 'Tipo',
        Cell: ({ row }) => <JobChip job={row.original.job.name} />,
      },
      {
        accessorKey: 'realStatus',
        header: 'Estatus Real',
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();
          const conf = getDriverRealStatusConf(status);
          return (
            <Chip color={conf.color} size="sm">
              {conf.label}
            </Chip>
          );
        },
      },
      {
        accessorFn: (row) => (row.travel ? row.travel.name : 'N/A'),
        header: 'Viaje',
        Cell: ({ cell, row }) => {
          const value = cell.getValue<string>();
          return value === 'N/A' ? (
            <span className="text-gray-400">{cell.getValue<string>()}</span>
          ) : (
            <TravelCell travel={row.original?.travel} />
          );
        },
      },
      {
        accessorFn: (row) => (row.maneuver ? row.maneuver.type : 'N/A'),
        header: 'Maniobra',
        Cell: ({ cell, row }) => {
          const value = cell.getValue<string>();
          return value === 'N/A' ? (
            <span className="text-gray-400">{cell.getValue<string>()}</span>
          ) : (
            <ManeuverCell maneuver={row.original?.maneuver} />
          );
        },
      },
      {
        header: 'Permiso Activo',
        Cell: ({ row }) => <ActivePermissionCell driver={row.original} />,
      },
      {
        header: 'Última Maniobra',
        Cell: ({ row }) => {
          const value = row.original.lastManeuver?.id;
          return value ? (
            <span className="font-bold">{value}</span>
          ) : (
            <span className="text-gray-400">{'N/A'}</span>
          );
        },
      },
      {
        header: 'Tipo U. Maniobra',
        Cell: ({ row }) => {
          const value = row.original.lastManeuver?.type;
          return value ? (
            <span className="font-bold uppercase">{value}</span>
          ) : (
            <span className="text-gray-400">{'N/A'}</span>
          );
        },
      },
      {
        header: 'Fecha U. Maniobra',
        Cell: ({ row }) => {
          const value = row.original?.lastManeuver?.finishedDate;
          return value ? (
            <span className="font-bold uppercase">
              {value.format('DD/MM/YYYY hh:mm A')}
            </span>
          ) : (
            <span className="text-gray-400">{'N/A'}</span>
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

