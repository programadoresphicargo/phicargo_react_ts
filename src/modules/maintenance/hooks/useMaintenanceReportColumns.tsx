import { Dayjs } from 'dayjs';
import { type MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import { useWorkshop } from './useWorkshop';
import type { MaintenanceRecord } from '../models';
import { daysUtil, daysUtilNow } from '../utilities/datetime';
import { Chip } from '@mui/material';
import { maintenanceStatus } from '../utilities';

export const useMaintenanceReportColumns = (data: MaintenanceRecord[]) => {
  const {
    workshopQuery: { data: workshops },
  } = useWorkshop();

  const columns = useMemo<MRT_ColumnDef<MaintenanceRecord>[]>(() => {
    return [
      {
        accessorFn: (originalRow) =>
          originalRow?.vehicle?.name || 'Sin Asignar',
        id: 'name',
        header: 'Unidad',
        size: 4,
        enableEditing: false,
        Cell: ({ cell }) => {
          return (
            <Chip
              label={cell.getValue<string>()}
              size="small"
              color="primary"
            />
          );
        },
      },
      {
        accessorFn: (row) => row.lastCommentDate,
        header: 'Última Actualización',
        id: 'lastCommentDate',
        enableEditing: false,
        Cell: ({ cell }) =>
          cell.getValue<Dayjs>()?.format('DD/MM/YYYY hh:mm A') || 'Sin Fecha',
      },
      {
        header: 'Días en Taller',
        filterVariant: 'range-slider',
        enableEditing: false,
        size: 4,
        Cell: ({ row }) => {
          if (row.original.status === 'pending') {
            return daysUtilNow(row.original.checkIn);
          } else if (row.original.checkOut) {
            return daysUtil(row.original.checkIn, row.original.checkOut);
          } else {
            return 'N/A';
          }
        },
      },
      {
        accessorFn: (originalRow) =>
          originalRow.deliveryDate?.format('YYYY-MM-DD'),
        id: 'deliveryDate',
        header: 'Entrega tentativa',
        size: 4,
        Cell: ({ row }) =>
          row.original.deliveryDate?.format('DD/MM/YYYY') || 'N/A',
      },
      {
        header: 'Tipo',
        accessorFn: (originalRow) =>
          originalRow?.vehicle?.vehicleType || 'Sin Asignar',
        id: 'type',
        enableEditing: false,
        size: 4,
        Cell: ({ cell }) =>
          cell.getValue<string>()?.toUpperCase() || 'Sin Asignar',
      },
      {
        accessorFn: (originalRow) => originalRow.checkIn,
        id: 'checkIn',
        header: 'Entrada',
        Cell: ({ row }) => row.original.checkIn.format('DD/MM/YYYY'),
      },
      {
        accessorFn: (originalRow) => originalRow.status,
        id: 'status',
        filterVariant: 'select',
        enableEditing: false,
        filterSelectOptions: [
          { label: 'Pendiente', value: 'pending' },
          { label: 'Completado', value: 'completed' },
          { label: 'Cancelado', value: 'caceled' },
          { label: 'Programado', value: 'programmed' },
        ],
        header: 'Estatus',
        Cell: ({ cell }) => {
          const status = cell.getValue<MaintenanceRecord['status']>();
          return (
            <Chip
              label={maintenanceStatus.getLabel(status)}
              color={maintenanceStatus.getColor(status)}
              size="small"
            />
          );
        },
      },
      {
        accessorFn: (originalRow) => originalRow?.workshop?.id || 'Sin Asignar',
        id: 'workshop',
        header: 'Taller',
        filterVariant: 'select',
        filterSelectOptions: (workshops || []).map((workshop) => ({
          label: workshop.name,
          value: workshop.id,
        })),
        Cell: ({ row }) => {
          return row.original?.workshop?.name || 'Sin Asignar';
        },
      },
      {
        accessorFn: (originalRow) => originalRow.failType,
        id: 'failType',
        filterVariant: 'select',
        filterSelectOptions: [
          { label: 'MC', value: 'MC' },
          { label: 'EL', value: 'EL' },
          { label: 'PV', value: 'PV' },
        ],
        header: 'Tipo de falla',
      },
      {
        accessorFn: (originalRow) =>
          originalRow?.vehicle?.branch?.name || 'Sin Asignar',
        id: 'branch',
        header: 'Sucursal',
        enableEditing: false,
      },
      {
        accessorFn: (originalRow) => originalRow.order,
        id: 'order',
        header: 'Orden de Servicio',
        enableEditing: false,
        enableClickToCopy: true,
      },
      {
        accessorFn: (originalRow) => originalRow.checkOut,
        id: 'checkOut',
        header: 'Salida',
        enableEditing: false,
        Cell: ({ cell }) =>
          cell.getValue<Dayjs>()?.format('DD/MM/YYYY') || 'N/A',
      },

      {
        accessorFn: (originalRow) => originalRow.supervisor,
        id: 'supervisor',
        header: 'Supervisor',
        filterVariant: 'select',
        filterSelectOptions: [
          {
            value: 'CONTRERAS HERNANDEZ ANDRES',
            label: 'CONTRERAS HERNANDEZ ANDRES',
          },
          {
            value: 'DE LA PARRA TRUJILLO SERGIO',
            label: 'DE LA PARRA TRUJILLO SERGIO',
          },
          {
            value: 'ORTIZ DIAZ CARLOS EDUARDO',
            label: 'ORTIZ DIAZ CARLOS EDUARDO',
          },
        ],
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return columns;
};

