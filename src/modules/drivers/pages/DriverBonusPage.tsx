import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { DriverBonusLayout } from '../layouts/DriverBonusLayout';
import { useMemo, useState } from 'react';
import type { DriverBonusMonth } from '../models';
import { useGetDriverBonusMonthsQuery } from '../hooks/queries';
import { Button } from '@heroui/react';
import { useBaseTable } from '@/hooks';
import { NewPeriodModal } from '../components/bonus/NewPeriodModal';
import { PeriodBonusView } from '../components/bonus/PeriodBonusView';
import { getMonthName } from '@/utilities';


const DriverBonusPage = () => {
  const [newPeriodModalOpen, setNewPeriodModalOpen] = useState(false);
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);

  const { driverBonusMonthsQuery } = useGetDriverBonusMonthsQuery();
  const columns = useMemo<MRT_ColumnDef<DriverBonusMonth>[]>(
    () => [
      {
        accessorKey: 'month',
        header: 'Mes',
        Cell: ({ cell }) => getMonthName(cell.getValue<number>()),
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
    onDoubleClickFn: (row) => {
      setMonth(row.month);
      setYear(row.year);
    },
    toolbarActions: (
      <>
        <Button
          radius="full"
          onPress={() => setNewPeriodModalOpen(true)}
          color="primary"
          size="sm"
        >
          Nuevo periodo
        </Button>
      </>
    ),
  });

  // const table2 = useMaterialReactTable({
  //   columns,
  //   data: driverBonusMonthsQuery.data || [],
  //   enableGrouping: true,
  //   enableGlobalFilter: true,
  //   enableFilters: true,
  //   state: { showProgressBars: driverBonusMonthsQuery.isLoading },
  //   initialState: {
  //     density: 'compact',
  //   },
  //   muiTableBodyRowProps: ({ row }) => ({
  //     onClick: ({ event }) => {
  //       setMonth(row.original.mes);
  //       setYear(row.original.anio);
  //       handleClickOpen();
  //     },
  //     style: {
  //       cursor: 'pointer',
  //     },
  //   }),
  //   muiTableHeadCellProps: {
  //     sx: {
  //       fontFamily: 'Inter',
  //       fontWeight: 'Bold',
  //       fontSize: '14px',
  //     },
  //   },
  //   muiTableBodyCellProps: {
  //     sx: {
  //       fontFamily: 'Inter',
  //       fontWeight: 'normal',
  //       fontSize: '14px',
  //     },
  //   },
  //   muiTableContainerProps: {
  //     sx: {
  //       maxHeight: 'calc(100vh - 190px)',
  //     },
  //   },
  //   muiTablePaperProps: {
  //     elevation: 0,
  //     sx: {
  //       borderRadius: '0',
  //     },
  //   },
  //   renderTopToolbarCustomActions: () => (
  //     <Box
  //       sx={{
  //         display: 'flex',
  //         gap: '16px',
  //         padding: '8px',
  //         flexWrap: 'wrap',
  //       }}
  //     >
  //       <Button radius="full" onPress={() => {}} color="primary">
  //         Nuevo periodo
  //       </Button>
  //     </Box>
  //   ),
  // });

  return (
    <DriverBonusLayout>
      <MaterialReactTable table={table} />
      <NewPeriodModal
        open={newPeriodModalOpen}
        onClose={() => setNewPeriodModalOpen(false)}
      />
      {month && year && (
        <PeriodBonusView
          open={!!month && !!year}
          onClose={() => {
            setMonth(null);
            setYear(null);
          }}
          month={month}
          year={year}
        />
      )}
    </DriverBonusLayout>
  );
};

export default DriverBonusPage;

