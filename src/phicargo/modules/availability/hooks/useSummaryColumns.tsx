import type { VehicleRealStatus, VehicleWithRealStatus } from '../models/vehicle-model';

import { Chip } from '@nextui-org/react';
import type { MRT_ColumnDef } from 'material-react-table';
import { getRealStatusConf } from '../utilities/get-real-status-conf';
import { useMemo } from 'react';

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
        accessorKey: 'realStatus',
        header: 'Estatus Real',
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
        accessorFn: (row) => row.maintenanceRecord ? row.maintenanceRecord.orderService : 'N/A', 
        header: 'Orden de Servicio',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return value === 'N/A' 
            ? <span className='text-gray-400 text-sm'>{cell.getValue<string>()}</span>
            : <span className='font-bold uppercase'>{cell.getValue<string>()}</span>
        }
      },
    ],
    [],
  );

  return {
    columns,
  };
};

