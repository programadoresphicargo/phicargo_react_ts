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

