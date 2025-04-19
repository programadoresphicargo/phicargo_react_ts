import type { Complaint } from '../models';
import { Dayjs } from 'dayjs';
import type { MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';

export const useComplaintsColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Complaint>[]>(() => {
    return [
      {
        accessorKey: 'complaintDate',
        header: 'Fecha',
        Cell: ({ cell }) => cell.getValue<Dayjs>().format('DD/MM/YYYY'),
      },
      {
        accessorKey: 'phicargoCompany',
        header: 'Empresa',
      },
      {
        accessorKey: 'responsible',
        header: 'Encargado',
      },
      {
        accessorKey: 'area',
        header: 'Área',
      },
      {
        accessorKey: 'complaintType',
        header: 'Tipo de Queja',
      },
      {
        accessorKey: 'complaintDescription',
        header: 'Descripción',
      },
      {
        accessorKey: 'status',
        header: 'Estatuss',
      },
    ];
  }, []);

  return columns;
};

