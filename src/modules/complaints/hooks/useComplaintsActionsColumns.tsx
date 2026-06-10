import { complaintActionStatus } from '../utilities';
import { Chip } from '@mui/material';
import type { ComplaintAction } from '../models';
import type { MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import { Dayjs } from 'dayjs';

export const useComplaintsActionsColumns = () => {
  const columns = useMemo<MRT_ColumnDef<ComplaintAction>[]>(() => {
    return [
      {
        accessorKey: 'id',
        header: 'ID',
        Cell: ({ cell }) => `${cell.getValue<string>()}`,
      },
      {
        accessorKey: 'complaintId',
        header: 'No conformidad',
        Cell: ({ cell }) => `NC-${cell.getValue<string>()}`,
      },
      {
        accessorKey: 'type',
        header: 'Tipo',
        Cell: ({ cell }) => <Chip color={cell.getValue<string>() == "plan de accion" ? "success" : "primary"} label={cell.getValue<string>().toUpperCase()} size="small"></Chip>,
      },
      {
        accessorKey: 'actionPlan',
        header: 'Descripción',
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha creación',
        Cell: ({ cell }) => cell.getValue<Dayjs>().format('DD/MM/YYYY'),
      },
      {
        accessorKey: 'responsible',
        header: 'Responsable',
      },
      {
        accessorKey: 'commitmentDate',
        header: 'Fecha compromiso',
        Cell: ({ cell }) => cell.getValue<Dayjs>().format('DD/MM/YYYY'),
      },
      {
        accessorKey: 'status',
        header: 'Estatus',
        Cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Chip
              label={complaintActionStatus.getLabel(status)}
              color={complaintActionStatus.getColor(status)}
              size="small"
            />
          );
        },
      },
    ];
  }, []);

  return columns;
};

