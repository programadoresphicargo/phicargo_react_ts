import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import ModalityChip from '../components/ui/ModalityChip';
import StatusChip from '../components/ui/StatusChip';
import type { Driver, Modality, Status } from '../models/driver-model';
import JobChip from '../components/ui/JobChip';

export const useDriversColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Driver>[]>(
    () => [
      { 
        accessorKey: 'name', 
        header: 'Operador',
        Cell: ({ cell }) => (
          <span className='font-bold text-medium'>{cell.getValue<string>()}</span>
        )
      },
      { 
        accessorKey: 'company.name', 
        header: 'Compañia',
      },
      {
        accessorFn: (row) => row.job ? row.job.name : 'N/A',
        header: 'Tipo',
        Cell: ({ row }) => <JobChip job={row.original.job.name} />,
      },
      { 
        accessorFn: (row) => row.vehicle ? row.vehicle.name : 'SIN ASIGNAR', 
        header: 'Unidad',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return value === 'SIN ASIGNAR' 
            ? <span className='text-gray-400 text-sm'>{cell.getValue<string>()}</span>
            : <span className='font-bold'>{cell.getValue<string>()}</span>
        } 
      },
      { accessorKey: 'licenseId', header: 'Licencia' },
      { accessorKey: 'licenseType', header: 'Tipo Licencia' },
      {
        accessorFn: (row) => row.modality,
        header: 'Modalidad',
        Cell: ({ cell }) => (
          <ModalityChip modality={cell.getValue<Modality>()} />
        ),
      },
      { 
        accessorFn: (row) => row.isDangerous, 
        header: 'Peligroso' 
      },
      {
        accessorFn: (row) => row.status,
        header: 'Estado',
        Cell: ({ cell }) => <StatusChip status={cell.getValue<Status>()} />,
      },
      { 
        accessorFn: (row) => row.travelId, 
        header: 'Viaje',
        Cell: ({ cell }) => {
          const value = cell.getValue<number | null>();
          return !value 
            ? <span className='text-gray-400 text-sm'>{'SIN ASIGNAR'}</span>
            : <span className='font-bold'>{cell.getValue<string>()}</span>
        } 
      },
      { 
        accessorFn: (row) => row.maneuverId, 
        header: 'Maniobra',
        Cell: ({ cell }) => {
          const value = cell.getValue<number | null>();
          return !value 
            ? <span className='text-gray-400 text-sm'>{'SIN ASIGNAR'}</span>
            : <span className='font-bold'>{cell.getValue<string>()}</span>
        } 
      },
      { 
        accessorFn: (row) => row.company ? row.company.name : 'N/A', 
        header: 'Compañia' 
      },
    ],
    [],
  );

  return {
    columns,
  };
};
