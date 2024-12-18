import { Dayjs } from 'dayjs';
import { type MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import { useWorkshop } from './useWorkshop';
import type { MaintenanceRecord } from '../models';
import { daysUtil, daysUtilNow } from '../utilities/datetime';
import { useNavigate } from 'react-router-dom';

export const useMaintenanceReportColumns = (data: MaintenanceRecord[]) => {
  const navigate = useNavigate();

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
        enableEditing: false,
        Cell: ({ cell, row }) => {
          return (
            <>
              <span
                className='bg-blue-500 text-white font-bold px-2 py-1 rounded-md cursor-pointer hover:bg-blue-600'
                onDoubleClick={() =>
                  navigate(
                    `/reportes/mantenimiento/detalles/${row.original.id}`,
                  )
                }
              >
                {cell.getValue<string>()}
              </span>
            </>
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
        header: 'Tipo',
        accessorFn: (originalRow) =>
          originalRow?.vehicle?.vehicleType || 'Sin Asignar',
        id: 'type',
        enableEditing: false,
        Cell: ({ cell }) =>
          cell.getValue<string>()?.toUpperCase() || 'Sin Asignar',
      },
      {
        accessorFn: (originalRow) => originalRow.checkIn.format('YYYY-MM-DD'),
        id: 'checkIn',
        filterFn: 'between',
        header: 'Entrada',
        Cell: ({ row }) => row.original.checkIn.format('DD/MM/YYYY'),
        editVariant: 'text',
        muiEditTextFieldProps: () => ({
          fullWidth: true,
          variant: 'outlined',
          size: 'small',
          type: 'date',
        }),
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
        ],
        header: 'Estatus',
        Cell: ({ cell }) => {
          const status = cell.getValue<MaintenanceRecord['status']>();
          return status === 'pending'
            ? 'Pendiente'
            : status === 'cancelled'
            ? 'Cancelado'
            : 'Completado';
        },
      },
      {
        accessorFn: (originalRow) =>
          originalRow?.workshop?.id || 'Sin Asignar',
        id: 'workshop',
        header: 'Taller',
        filterVariant: 'select',
        filterSelectOptions: (workshops || []).map((workshop) => ({
          label: workshop.name,
          value: workshop.id,
        })),
        editVariant: 'select',
        editSelectOptions: (workshops || []).map((workshop) => ({
          label: workshop.name,
          value: workshop.id,
        })),
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          defaultValue: row.original.workshop.id,
        }),
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
        ],
        header: 'Tipo de falla',
        editVariant: 'select',
        editSelectOptions: [
          { label: 'MC', value: 'MC' },
          { label: 'EL', value: 'EL' },
        ],
        muiEditTextFieldProps: {
          select: true,
        },
      },
      {
        accessorFn: (originalRow) =>
          originalRow?.vehicle?.branch?.name || 'Sin Asignar',
        id: 'branch',
        header: 'Sucursal',
        enableEditing: false,
      },
      {
        accessorFn: (originalRow) =>
          originalRow.deliveryDate?.format('YYYY-MM-DD'),
        id: 'deliveryDate',
        filterVariant: 'date',
        filterFn: 'between',
        header: 'Entrega tentativa',
        Cell: ({ row }) =>
          row.original.deliveryDate?.format('DD/MM/YYYY') || 'N/A',
        muiEditTextFieldProps: () => ({
          fullWidth: true,
          variant: 'outlined',
          size: 'small',
          type: 'date',
        }),
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
        filterVariant: 'date',
        filterFn: 'between',
        header: 'Salida',
        enableEditing: false,
        Cell: ({ cell }) =>
          cell.getValue<Dayjs>()?.format('DD/MM/YYYY') || 'N/A',
        muiEditTextFieldProps: {
          fullWidth: true,
          variant: 'outlined',
          size: 'small',
          type: 'date',
        },
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
        editVariant: 'select',
        editSelectOptions: [
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
        muiEditTextFieldProps: {
          select: true,
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return columns;
};
