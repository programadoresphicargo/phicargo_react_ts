// import 'rsuite/dist/rsuite-no-reset.min.css';

import { DateRange } from 'rsuite/esm/DateRangePicker';
// import { DateRangePicker } from 'rsuite';
import { MaterialReactTable } from 'material-react-table';
import { Outlet } from 'react-router-dom';
import { WaybillService } from '../models';
import dayjs from 'dayjs';
import { useBaseTable } from '@/hooks';
import { useGetWaybillServicesQuery } from '../hooks/queries';
import { useState } from 'react';
import { useWaybillServicesColumns } from '../hooks/useWaybillServicesColumns';
import { DateRangePicker } from '@/components/inputs';

const ServicesPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | null>([
    dayjs().startOf('month').toDate(),
    dayjs().endOf('month').toDate(),
  ]);

  const columns = useWaybillServicesColumns();

  const { servicesQuery } = useGetWaybillServicesQuery(dateRange);

  const table = useBaseTable<WaybillService>({
    columns,
    data: servicesQuery.data || [],
    tableId: 'waybill-service-table',
    isLoading: servicesQuery.isLoading,
    isFetching: servicesQuery.isFetching,
    error: servicesQuery.error?.message,
    refetchFn: () => servicesQuery.refetch(),
    showGlobalFilter: true,
    containerHeight: 'calc(100vh - 175px)',
    toolbarActions: (
      <div className="flex items-center gap-4">
        <DateRangePicker
          showOneCalendar
          placeholder="Rango"
          showWeekNumbers
          isoWeek
          ranges={[]}
          value={dateRange}
          onChange={setDateRange}
        />
      </div>
    ),
  });

  return (
    <section>
      <MaterialReactTable table={table} />
      <Outlet />
    </section>
  );
};

export default ServicesPage;

