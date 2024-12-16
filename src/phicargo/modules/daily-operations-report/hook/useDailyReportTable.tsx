import type { Record } from '../models/record-model';
import { type MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';

export const useDailyReportColumns = () => {
  const columns = useMemo<MRT_ColumnDef<Record>[]>(
    () => [
      {
        accessorFn: (row) => row?.date?.format('YYYY-MM-DD') || null,
        header: 'Fecha',
        size: 100,
        filterVariant: 'date-range',
        enableEditing: false,
        enableSorting: true,
        Cell: ({ row }) =>
          row.original?.date?.format('DD/MM/YYYY') || 'Sin Fecha',
      },
      {
        accessorFn: (row) => row.fullLoad,
        id: 'fullLoad',
        header: 'Full',
        size: 50,
        enableSorting: false,
        enableColumnFilter: false,
        muiEditTextFieldProps: {
          type: 'number',
        },
      },
      {
        accessorFn: (row) => row.simpleLoad,
        id: 'simpleLoad',
        header: 'Sencillo',
        size: 50,
        enableSorting: false,
        enableColumnFilter: false,
        muiEditTextFieldProps: {
          type: 'number',
        },
      },
      {
        accessorFn: (row) => row.total,
        header: 'Total',
        size: 50,
        enableSorting: false,
        enableEditing: false,
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => row.meta,
        header: 'Meta',
        size: 50,
        enableSorting: false,
        enableEditing: false,
        enableColumnFilter: false,
        muiEditTextFieldProps: {
          type: 'number',
        },
        Cell: ({ row }) => {
          const meta = row.original.meta;
          return (
            <span
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: '1.2em',
              }}
            >
              {meta}
            </span>
          );
        },
      },
      {
        accessorFn: (row) => row.difference,
        header: 'Diferencia',
        size: 50,
        enableSorting: false,
        enableEditing: false,
        enableColumnFilter: false,
        muiEditTextFieldProps: {
          type: 'number',
        },
      },
      {
        accessorFn: (row) => row.accumulatedDifference,
        header: 'Acumulada',
        size: 50,
        enableSorting: false,
        enableEditing: false,
        enableColumnFilter: false,
        muiEditTextFieldProps: {
          type: 'number',
        },
        Cell: ({ row }) => {
          const accumulatedDifference = row.original.accumulatedDifference;
          return (
            <span
              style={{
                color: '#aa0707',
                fontWeight: 'bold',
                fontSize: '1.2em',
              }}
            >
              {accumulatedDifference}
            </span>
          );
        },
      },
      {
        accessorFn: (row) => row.availableUnits,
        header: 'Disponible',
        size: 50,
        enableEditing: false,
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => row.unloadingUnits,
        id: 'unloadingUnits',
        header: 'Descargando',
        size: 50,
        enableSorting: false,
        enableColumnFilter: false,
        muiEditTextFieldProps: {
          type: 'number',
        },
      },
      {
        accessorFn: (row) => row.longTripUnits,
        id: 'longTripUnits',
        header: 'Largos',
        size: 50,
        enableSorting: false,
        enableColumnFilter: false,
        muiEditTextFieldProps: {
          type: 'number',
        },
      },
      {
        accessorFn: (row) => row.unitsInMaintenance,
        header: 'Taller',
        size: 50,
        enableEditing: false,
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => row.unitsNoOperator,
        header: 'Sin Operador',
        size: 50,
        enableEditing: false,
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => row.totalUnits,
        header: 'Total Unidades',
        size: 50,
        enableEditing: false,
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    [],
  );

  return { columns };
};
