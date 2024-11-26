import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import ModalityChip from '../components/ui/ModalityChip';
import StatusChip from '../components/ui/StatusChip';
import type { Driver, Job, Modality, Status } from '../models/driver-model';
import JobChip from '../components/ui/JobChip';

export const useDriversColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Driver>[]>(
    () => [
      { accessorKey: 'name', header: 'Operador' },
      {
        accessorKey: 'job',
        header: 'Tipo',
        Cell: ({ cell }) => <JobChip job={cell.getValue<Job>()} />,
      },
      { accessorKey: 'vehicleName', header: 'Unidad' },
      { accessorKey: 'driverLicenseId', header: 'Licencia' },
      { accessorKey: 'driverLicenseType', header: 'Tipo Licencia' },
      {
        accessorKey: 'modality',
        header: 'Modalidad',
        Cell: ({ cell }) => (
          <ModalityChip modality={cell.getValue<Modality>()} />
        ),
      },
      { accessorKey: 'isDangerous', header: 'Peligroso' },
      {
        accessorKey: 'status',
        header: 'Estado',
        Cell: ({ cell }) => <StatusChip status={cell.getValue<Status>()} />,
      },
      { accessorKey: 'viaje', header: 'Viaje' },
      { accessorKey: 'maniobra', header: 'Maniobra' },
      { accessorKey: 'company', header: 'Compañia' },
    ],
    [],
  );

  return {
    columns,
  };
};
