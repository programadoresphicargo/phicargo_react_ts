import type { VehicleRealStatus, VehicleWithRealStatus } from '../models/vehicle-model';

import { Chip } from '@nextui-org/react';
import type { MRT_ColumnDef } from 'material-react-table';
import { ManeuverCell } from '../components/ui/ManeuverCell';
import { TravelCell } from '../components/ui/TravelCell';
import { availableStatus } from '../utilities';
import { getRealStatusConf } from '../utilities/get-real-status-conf';
import { useMemo } from 'react';

/**
 * Custom hook to get the columns for the vehicles summary table
 * @returns Columns for the summary table
 */
export const useSummaryColumns = () => {
  const columns = useMemo<MRT_ColumnDef<VehicleWithRealStatus>[]>(
    () => [
      { 
        accessorKey: 'name', 
        header: 'Unidad',
        Cell: ({ cell }) => (
          <span className='font-bold text-medium'>{cell.getValue<string>()}</span>
        ) 
      },
      { 
        accessorKey: 'company.name', 
        header: 'Empresa',
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
        Cell: ({ cell }) => (
          <span className='font-bold text-medium'>{cell.getValue<string>()}</span>
        ) 
      },
      {
        accessorKey: 'realStatus',
        header: 'Estatus Real',
        filterVariant: 'multi-select',
        filterSelectOptions: availableStatus.map((s) => ({
          value: s.key,
          label: s.label,
        })),
        Cell: ({ cell }) => {
          const status = cell.getValue<VehicleRealStatus>();
          const conf = getRealStatusConf(status);
          return (
            <Chip color={conf.color} size='sm'>
              {conf.label}
            </Chip>
          );
        }
      },
      { 
        accessorFn: (row) => row.travel ? row.travel.name : 'N/A', 
        header: 'Viaje',
        Cell: ({ cell, row }) => {
          const value = cell.getValue<string>();
          return value === 'N/A' 
            ? <span className='text-gray-400 text-sm'>{value}</span>
            : <TravelCell travel={row.original.travel} />
        }
      },
      { 
        accessorFn: (row) => row.maneuver ? row.maneuver.type : 'N/A', 
        header: 'Maniobra',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return value === 'N/A' 
            ? <span className='text-gray-400 text-sm'>{value}</span>
            : <ManeuverCell maneuver={cell.row.original.maneuver} />
        }
      },
      { 
        accessorFn: (row) => row.maintenanceRecord ? row.maintenanceRecord.orderService : 'N/A', 
        header: 'Orden de Servicio',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return value === 'N/A' 
            ? <span className='text-gray-400 text-sm'>{cell.getValue<string>()}</span>
            : <span className='font-bold text-blue-600 uppercase'>{cell.getValue<string>()}</span>
        }
      },
    ],
    [],
  );

  return {
    columns,
  };
};

