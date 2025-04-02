import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { DriverBonusLayout } from '../layouts/DriverBonusLayout';
import { useMemo } from 'react';
import type { DriverBonusMonth } from '../models';
import { useDriverBonusQueries } from '../hooks/queries';
import { Box } from '@mui/material';
import { Button } from '@heroui/react';
import { useBaseTable } from '@/hooks';

const obtenerNombreMes = (numeroMes: number) => {
  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  return meses[numeroMes - 1] || 'Mes inválido';
};

const DriverBonusPage = () => {
  const { driverBonusMonthsQuery } = useDriverBonusQueries();
  const columns = useMemo<MRT_ColumnDef<DriverBonusMonth>[]>(
    () => [
      {
        accessorKey: 'month',
        header: 'Mes',
        Cell: ({ cell }) => obtenerNombreMes(cell.getValue<number>()),
      },
      { accessorKey: 'year', header: 'Año' },
    ],
    [],
  );

  const table = useBaseTable<DriverBonusMonth>({
    columns,
    data: driverBonusMonthsQuery.data || [],
    isFetching: driverBonusMonthsQuery.isFetching,
    isLoading: driverBonusMonthsQuery.isLoading,
    error: driverBonusMonthsQuery.error?.message,
    density: 'spacious',
    refetchFn: driverBonusMonthsQuery.refetch,
    tableId: 'driver-bonus-months',
    containerHeight: 'calc(100vh - 180px)',
    toolbarActions: (
      <>
        <Button radius="full" onPress={() => {}} color="primary">
          Nuevo periodo
        </Button>
      </>
    )
  })

  const table2 = useMaterialReactTable({
    columns,
    data: driverBonusMonthsQuery.data || [],
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: driverBonusMonthsQuery.isLoading },
    initialState: {
      density: 'compact',
    },
    // muiTableBodyRowProps: ({ row }) => ({
    //   onClick: ({ event }) => {
    //     setMonth(row.original.mes);
    //     setYear(row.original.anio);
    //     handleClickOpen();
    //   },
    //   style: {
    //     cursor: 'pointer',
    //   },
    // }),
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 190px)',
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button radius="full" onPress={() => {}} color="primary">
          Nuevo periodo
        </Button>
      </Box>
    ),
  });

  return (
    <DriverBonusLayout>
      <MaterialReactTable table={table} />
    </DriverBonusLayout>
  );
};

export default DriverBonusPage;

