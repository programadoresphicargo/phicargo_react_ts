import { Dayjs } from 'dayjs';
import { type MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import { useWorkshop } from './useWorkshop';
import type { MaintenanceRecord } from '../models';
import { Chip } from '@heroui/react';
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
              size="sm"
              color="primary"
            >
              {cell.getValue<string>()}
            </Chip>
          );
        },
      },
      {
        accessorFn: (row) => row.lastCommentDate,
        id: 'lastCommentDate',
        header: 'Última Actualización',
        enableEditing: false,
        Cell: ({ cell }) =>
          cell.getValue<Dayjs>()?.format('DD/MM/YYYY hh:mm A') || 'Sin Fecha',
      },
      {
        accessorFn: (row) => row.daysInWorkshop,
        id: 'daysInWorkshop',
        header: 'Días transcurridos',
        enableEditing: false,
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
        accessorFn: (originalRow) => originalRow.checkOut,
        id: 'checkOut',
        header: 'Salida',
        Cell: ({ cell }) =>
          cell.getValue<Dayjs>()?.format('DD/MM/YYYY') || 'N/A',
      },
      {
        accessorFn: (originalRow) => originalRow.status,
        id: 'status',
        filterVariant: 'select',
        enableEditing: false,
        filterSelectOptions: [
          { label: 'Pendiente', value: 'pending' },
          { label: 'Completado', value: 'completed' },
          { label: 'Cancelado', value: 'canceled' },
          { label: 'Programado', value: 'programmed' },
        ],
        header: 'Estatus',
        Cell: ({ cell }) => {
          const status = cell.getValue<MaintenanceRecord['status']>();
          return (
            <Chip
              className="text-white"
              color={
                status === 'pending' ? 'warning' :
                  status === 'completed' ? 'success' :
                    status === 'cancelled' ? 'danger' :
                      status === 'programmed' ? 'primary' :
                        'default'
              }
            >{maintenanceStatus.getLabel(status)}
            </Chip>
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
        header: 'Tipo de reporte',
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

