import { useBaseTable } from '@/hooks';
import { useMotumEventsQueries } from '@/modules/vehicles/hooks/queries';
import type { MotumEvent, MotumEventStatus } from '@/modules/vehicles/models';
import { MaterialReactTable } from 'material-react-table';
import { useVehicleEventsColumns } from './useVehicleEventsColumns';
import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import CustomNavbar from '@/pages/CustomNavbar';
import { Select, SelectItem } from "@heroui/react";

const VehicleEventsPage = () => {
  const [tab, setTab] = useState<MotumEventStatus>('pending');
  const [dateRagen, setDateRange] = useState<[string, string] | null>(null);

  const conf = useMemo(() => {
    const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');

    return {
      status: tab,
      startDate: tab === 'attended' ? dateRagen?.[0] : startOfMonth,
      endDate: tab === 'attended' ? dateRagen?.[1] : endOfMonth,
    };
  }, [tab, dateRagen]);

  const { getMotumEventsQuery } = useMotumEventsQueries(conf);

  const columns = useVehicleEventsColumns();

  const table = useBaseTable<MotumEvent>({
    columns,
    data: getMotumEventsQuery.data || [],
    tableId: 'vehicle-events-table',
    isLoading: getMotumEventsQuery.isLoading,
    isFetching: getMotumEventsQuery.isFetching,
    error: getMotumEventsQuery.error?.message,
    refetchFn: () => getMotumEventsQuery.refetch(),
    showColumnFilters: true,
    showGlobalFilter: true,
    containerHeight: 'calc(100vh - 200px)',
    toolbarActions: (
      <div className="flex items-center gap-4">
        <h1>Eventos GPS</h1>
        <Select
          label="Tipo"
          fullWidth
          variant='bordered'
          selectedKeys={[tab]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as MotumEventStatus;
            setTab(value);
          }}
        >
          <SelectItem key="pending">Pendientes</SelectItem>
          <SelectItem key="attended">Atendidos</SelectItem>
        </Select>
      </div>
    ),
  });

  return (
    <>
      <CustomNavbar></CustomNavbar>
      <MaterialReactTable table={table} />
    </>
  );
};

export default VehicleEventsPage;

