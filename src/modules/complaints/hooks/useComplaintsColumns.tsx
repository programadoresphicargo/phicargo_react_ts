import { complaintPriority, complaintStatus } from '../utilities';

import { Chip } from '@mui/material';
import type { Complaint } from '../models';
import type { Dayjs } from 'dayjs';
import type { MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';

export const useComplaintsColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Complaint>[]>(() => {
    return [
      {
        accessorKey: 'id',
        header: 'Folio',
        Cell: ({ cell }) => `#${cell.getValue<string>()}`,
      },
      {
        accessorKey: 'complaintDate',
        header: 'Fecha',
        Cell: ({ cell }) => cell.getValue<Dayjs>().format('DD/MM/YYYY'),
      },
      {
        accessorFn: (row) => row.customer?.name,
        header: 'Cliente',
        Cell: ({ cell }) => cell.getValue<string>() ?? 'No especificado',
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
        header: 'Estatus',
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
      {
        accessorKey: 'priority',
        header: 'Prioridad',
        Cell: ({ row }) => {
          const value = row.original.priority;
          return (
            <Chip
              label={complaintPriority.getLabel(value)}
              color={complaintPriority.getColor(value)}
              size="small"
            />
          );
        },
      },
    ];
  }, []);

  return columns;
};

