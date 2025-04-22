import { Chip } from '@mui/material';
import type { Complaint } from '../models';
import type { Dayjs } from 'dayjs';
import type { MRT_ColumnDef } from 'material-react-table';
import { complaintStatus } from '../utilities';
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
        accessorKey: 'origin',
        header: 'Origen',
      },
      {
        accessorKey: 'status',
        header: 'Estatuss',
        Cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Chip
              label={complaintStatus.getLabel(status)}
              color={complaintStatus.getColor(status)}
              size="small"
            />
          );
        },
      },
    ];
  }, []);

  return columns;
};

