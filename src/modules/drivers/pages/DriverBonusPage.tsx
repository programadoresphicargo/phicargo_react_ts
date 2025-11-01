import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { DriverBonusLayout } from '../layouts/DriverBonusLayout';
import { useMemo, useState } from 'react';
import type { DriverBonusMonth } from '../models';
import { useGetDriverBonusMonthsQuery } from '../hooks/queries';
import { Button, Chip } from '@heroui/react';
import { useBaseTable } from '@/hooks';
import { NewPeriodModal } from '../components/bonus/NewPeriodModal';
import { PeriodBonusView } from '../components/bonus/PeriodBonusView';
import { getMonthName } from '@/utilities';


const DriverBonusPage = () => {
  const [newPeriodModalOpen, setNewPeriodModalOpen] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] = useState<DriverBonusMonth | null>(null);

  const { driverBonusMonthsQuery } = useGetDriverBonusMonthsQuery();
  const columns = useMemo<MRT_ColumnDef<DriverBonusMonth>[]>(
    () => [
      { accessorKey: 'id', header: 'Periodo' },
      {
        accessorKey: 'month',
        header: 'Mes',
        Cell: ({ cell }) => getMonthName(cell.getValue<number>()),
      },
      { accessorKey: 'year', header: 'Año' },
      { accessorKey: 'fecha_creacion', header: 'Fecha creación' },
      {
        accessorKey: 'estado',
        header: 'Estado',
        Cell: ({ cell }) => {
          const estado = cell.getValue<string>();

          const color =
            estado === 'borrador' ? 'primary' :
              estado === 'cerrado' ? 'warning' :
                'success'; // valor por defecto si es "pagado" u otro

          return (
            <Chip color={color} size='sm' className='text-white'>
              {estado}
            </Chip>
          );
        },
      },
      { accessorKey: 'fecha_cierre', header: 'Cierre' },
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
      setSelectedPeriodo(row.original);
    },
    toolbarActions: (
      <>
        <Button
          onPress={() => setNewPeriodModalOpen(true)}
          color="primary"
          radius='full'
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
        onClose={() => {
          setNewPeriodModalOpen(false);
          driverBonusMonthsQuery.refetch();
        }}
      />
      {selectedPeriodo && (
        <PeriodBonusView
          open={!!selectedPeriodo}
          onClose={() => {
            setSelectedPeriodo(null);
            driverBonusMonthsQuery.refetch();
          }}
          periodo={selectedPeriodo} // 👈 le pasas todo el objeto
        />
      )}
    </DriverBonusLayout>
  );
};

export default DriverBonusPage;

