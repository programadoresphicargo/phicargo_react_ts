import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import ModalityChip from '../components/ui/ModalityChip';
import StatusChip from '../components/ui/StatusChip';
import type { Driver, Modality, Status } from '../models/driver-model';
import JobChip from '../components/ui/JobChip';

export const useDriversColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Driver>[]>(
    () => [
      { accessorKey: 'name', header: 'Operador' },
      {
        accessorFn: (row) => row.job ? row.job.name : 'N/A',
        header: 'Tipo',
        Cell: ({ row }) => <JobChip job={row.original.job.name} />,
      },
      { accessorKey: 'vehicle.name', header: 'Unidad' },
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
        header: 'Viaje' 
      },
      { 
        accessorFn: (row) => row.maneuverId, 
        header: 'Maniobra' 
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
