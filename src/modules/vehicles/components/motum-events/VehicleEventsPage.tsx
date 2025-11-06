import { useBaseTable } from '@/hooks';
import { useMotumEventsQueries } from '@/modules/vehicles/hooks/queries';
import type { MotumEvent, MotumEventStatus } from '@/modules/vehicles/models';
import { MaterialReactTable } from 'material-react-table';
import { useVehicleEventsColumns } from './useVehicleEventsColumns';
import { useState, useMemo } from 'react';
import CustomNavbar from '@/pages/CustomNavbar';
import { Select, SelectItem } from "@heroui/react";
import { DateRangePicker } from 'rsuite';

const VehicleEventsPage = () => {
  const [tab, setTab] = useState<MotumEventStatus>('pending');

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [range, setRange] = useState<[Date, Date] | null>([firstDay, lastDay]);

  const conf = useMemo(() => {
    const format = (d: Date) => d.toISOString().slice(0, 10);

    return {
      status: tab,
      startDate: tab === 'attended'
        ? (range ? format(range[0]) : undefined)
        : format(firstDay),

      endDate: tab === 'attended'
        ? (range ? format(range[1]) : undefined)
        : format(lastDay),
    };
  }, [tab, range]);

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
        <DateRangePicker
          value={range}
          onChange={(value) => setRange(value)}
          placeholder="Selecciona un rango de fechas"
          format="yyyy-MM-dd"
        />
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

