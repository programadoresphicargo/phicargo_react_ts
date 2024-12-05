import { Chip } from '@nextui-org/react';
import type { DriverWithRealStatus } from '../models/driver-model';
import type { MRT_ColumnDef } from 'material-react-table';
import { getDriverRealStatusConf } from '../utilities/get-driver-real-status-conf';
import { getValidPermission } from '../utilities';
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
        header: 'Unidad',
        Cell: ({ cell }) => (
          <span className='font-bold text-medium'>{cell.getValue<string>()}</span>
        ) 
      },
      {
        accessorKey: 'realStatus',
        header: 'Estatus Real',
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();
          const conf = getDriverRealStatusConf(status);
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
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return value === 'N/A' 
            ? <span className='text-gray-400 text-sm'>{cell.getValue<string>()}</span>
            : <span className='font-bold'>{cell.getValue<string>()}</span>
        }
      },
      { 
        accessorFn: (row) => row.maneuver ? row.maneuver.type : 'N/A', 
        header: 'Maniobra',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return value === 'N/A' 
            ? <span className='text-gray-400 text-sm'>{cell.getValue<string>()}</span>
            : <span className='font-bold uppercase'>{cell.getValue<string>()}</span>
        }
      },
      { 
        header: 'Permiso Activo',
        Cell: ({ row }) => {
          const validPermission = getValidPermission(row.original);
          return !validPermission 
            ? <span className='text-gray-400 text-sm'>{'N/A'}</span>
            : <span className='font-bold uppercase'>{validPermission.reasonType}</span>
        }
      },
    ],
    [],
  );

  return {
    columns,
  };
};

