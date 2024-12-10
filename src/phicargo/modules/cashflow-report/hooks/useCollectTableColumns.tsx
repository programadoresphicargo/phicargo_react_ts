import { type MRT_ColumnDef } from 'material-react-table';

import { useMemo } from 'react';
import { CollectRegister } from '../models';
import TotalFooterItem from '../components/TotalFooterItem';
import CurrencyCell from '../components/tables/CurrencyCell';
import { getTotalPerDay } from '../utils/get-total-per-day';
import { getProjection } from '../utils/get-projection';

/**
 * Custom hook para obtener las columnas de la tabla de cobros
 * @param data Array de registros de cobro
 * @returns Columnas para la tabla de cobros
 */
export const useCollectTableColumns = (data: CollectRegister[]) => {
  const columns = useMemo<MRT_ColumnDef<CollectRegister>[]>(() => {
    return [
      {
        header: 'Cliente',
        accessorFn: (originalRow) => originalRow?.clientName,
        id: 'client',
        enableEditing: false,
        Cell: ({ cell, row }) => (
          <span
            style={{
              color: row.original?.migratedFromWeekId ? '#ba5662' : 'black',
              fontWeight: row.original?.migratedFromWeekId ? 'bold' : 'normal',
            }}
          >
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        header: 'Proyección',
        filterFn: 'between',
        enableEditing: false,
        maxSize: 150,
        Footer: () => (
          <TotalFooterItem
            total={data.reduce((acc, curr) => acc + getProjection(curr), 0)}
          />
        ),
        Cell: ({ row }) => <CurrencyCell value={getProjection(row.original)} />,
      },
      {
        accessorFn: (originalRow) => originalRow.totalConfirmed,
        id: 'totalConfirmed',
        filterFn: 'between',
        header: 'Total Confirmado',
        enableEditing: false,
        maxSize: 150,
        Footer: () => (
          <TotalFooterItem
            total={data.reduce((acc, curr) => acc + curr.totalConfirmed, 0)}
          />
        ),
        Cell: ({ cell, row }) => (
          <CurrencyCell
            value={cell.getValue<number>() || 0}
            customColor={
              cell.getValue<number>() === getProjection(row.original)
                ? '#d4edda'
                : '#fff3cd'
            }
          />
        ),
      },
      {
        accessorFn: (originalRow) => originalRow.monday.amount,
        filterFn: 'between',
        id: 'monday',
        header: 'Lunes',
        maxSize: 150,
        muiEditTextFieldProps: {
          type: 'number',
          helperText: 'Cobrado el lunes',
        },
        Footer: () => (
          <TotalFooterItem total={getTotalPerDay(data, 'monday')} />
        ),
        Cell: ({ cell, row }) => (
          <CurrencyCell
            value={cell.getValue<number>() || 0}
            confirmationRequired={cell.getValue<number>() > 0}
            type="collect"
            item={row.original}
            dayOfWeek="monday"
            customColor={row.original.monday.confirmed ? '#d4edda' : '#ffcccb'}
          />
        ),
      },
      {
        accessorFn: (originalRow) => originalRow.tuesday.amount,
        id: 'tuesday',
        filterFn: 'between',
        header: 'Martes',
        maxSize: 150,
        muiEditTextFieldProps: {
          type: 'number',
          helperText: 'Cobrado el martes',
        },
        Footer: () => (
          <TotalFooterItem total={getTotalPerDay(data, 'tuesday')} />
        ),
        Cell: ({ cell, row }) => (
          <CurrencyCell
            value={cell.getValue<number>() || 0}
            confirmationRequired={
              cell.getValue<number>() > 0 && !row.original.tuesday.confirmed
            }
            type="collect"
            item={row.original}
            dayOfWeek="tuesday"
            customColor={row.original.tuesday.confirmed ? '#d4edda' : '#ffcccb'}
          />
        ),
      },
      {
        accessorFn: (originalRow) => originalRow.wednesday.amount,
        id: 'wednesday',
        filterFn: 'between',
        header: 'Miercoles',
        maxSize: 150,
        muiEditTextFieldProps: {
          type: 'number',
          helperText: 'Cobrado el miercoles',
        },
        Footer: () => (
          <TotalFooterItem total={getTotalPerDay(data, 'wednesday')} />
        ),
        Cell: ({ cell, row }) => (
          <CurrencyCell
            value={cell.getValue<number>() || 0}
            confirmationRequired={
              cell.getValue<number>() > 0 && !row.original.wednesday.confirmed
            }
            type="collect"
            item={row.original}
            dayOfWeek="wednesday"
            customColor={
              row.original.wednesday.confirmed ? '#d4edda' : '#ffcccb'
            }
          />
        ),
      },
      {
        accessorFn: (originalRow) => originalRow.thursday.amount,
        id: 'thursday',
        filterFn: 'between',
        header: 'Jueves',
        maxSize: 150,
        muiEditTextFieldProps: {
          type: 'number',
          helperText: 'Cobrado el jueves',
        },
        Footer: () => (
          <TotalFooterItem total={getTotalPerDay(data, 'thursday')} />
        ),
        Cell: ({ cell, row }) => (
          <CurrencyCell
            value={cell.getValue<number>() || 0}
            confirmationRequired={
              cell.getValue<number>() > 0 && !row.original.thursday.confirmed
            }
            type="collect"
            item={row.original}
            dayOfWeek="thursday"
            customColor={
              row.original.thursday.confirmed ? '#d4edda' : '#ffcccb'
            }
          />
        ),
      },
      {
        accessorFn: (originalRow) => originalRow.friday.amount,
        id: 'friday',
        filterFn: 'between',
        header: 'Viernes',
        maxSize: 150,
        muiEditTextFieldProps: {
          type: 'number',
          helperText: 'Cobrado el viernes',
        },
        Footer: () => (
          <TotalFooterItem total={getTotalPerDay(data, 'friday')} />
        ),
        Cell: ({ cell, row }) => (
          <CurrencyCell
            value={cell.getValue<number>() || 0}
            confirmationRequired={
              cell.getValue<number>() > 0 && !row.original.friday.confirmed
            }
            type="collect"
            item={row.original}
            dayOfWeek="friday"
            customColor={row.original.friday.confirmed ? '#d4edda' : '#ffcccb'}
          />
        ),
      },
      {
        accessorFn: (originalRow) => originalRow.saturday.amount,
        id: 'saturday',
        filterFn: 'between',
        header: 'Sabado',
        maxSize: 150,
        muiEditTextFieldProps: {
          type: 'number',
          helperText: 'Cobrado el sabado',
        },
        Footer: () => (
          <TotalFooterItem total={getTotalPerDay(data, 'saturday')} />
        ),
        Cell: ({ cell, row }) => (
          <CurrencyCell
            value={cell.getValue<number>() || 0}
            confirmationRequired={
              cell.getValue<number>() > 0 && !row.original.saturday.confirmed
            }
            type="collect"
            item={row.original}
            dayOfWeek="saturday"
            customColor={
              row.original.saturday.confirmed ? '#d4edda' : '#ffcccb'
            }
          />
        ),
      },
      {
        accessorKey: 'observations',
        header: 'Observaciones',
        filterVariant: 'text',
      },
    ];
  }, [data]);

  return columns;
};
