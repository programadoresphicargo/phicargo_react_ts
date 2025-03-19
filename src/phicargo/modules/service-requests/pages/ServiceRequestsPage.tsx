import 'rsuite/dist/rsuite-no-reset.min.css';

import { IconButton, Tooltip } from '@mui/material';
import {
  MRT_GroupingState,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useState } from 'react';

import { DateRange } from 'rsuite/esm/DateRangePicker/types';
import { DateRangePicker } from 'rsuite';
import { FiltersMenu } from '../components/ui/FiltersMenu';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import type { Option } from '@/types';
import { Outlet } from 'react-router-dom';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Waybill } from '../models';
import dayjs from 'dayjs';
import { useGetServices } from '../hooks/queries';
import { useServiceColumns } from '../hooks/useServiceColumns';

const filterOptions: Option<string[]>[] = [
  {
    key: 'travel-plan',
    label: 'Plan de Viaje',
    value: ['state', 'branch.name', 'dateOrders'],
  },
  { key: 'empty', label: 'Sin filtro', value: [] },
];

const ServiceRequestsPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | null>([
    dayjs().startOf('month').toDate(),
    dayjs().endOf('month').toDate(),
  ]);

  const [selectedOption, setSelectedOption] = useState<Option<string[]> | null>(
    null,
  );
  const [columnGrouping, setColumnGrouping] = useState<MRT_GroupingState>(
    (selectedOption?.value as []) ?? [],
  );

  const columns = useServiceColumns();

  const { servicesQuery } = useGetServices(dateRange);

  useEffect(() => {
    if (selectedOption) {
      setColumnGrouping(selectedOption.value as []);
    }
  }, [selectedOption]);

  const table = useMaterialReactTable<Waybill>({
    // DATA
    columns,
    data: servicesQuery.data ?? [],
    localization: MRT_Localization_ES,
    enableStickyHeader: true,
    autoResetPageIndex: false,
    // PAGINATION, FILTERS, SORTING
    enableRowActions: false,
    enableSorting: false,
    enableGrouping: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    positionToolbarAlertBanner: 'bottom',
    columnFilterDisplayMode: 'subheader',

    onGroupingChange: setColumnGrouping,

    getRowId: (row) => String(row.id),
    // STATE
    initialState: {
      showColumnFilters: false,
      density: 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
      columnPinning: {
        right: ['mrt-row-actions'],
      },
    },
    state: {
      isLoading: servicesQuery.isLoading,
      grouping: columnGrouping,
    },
    // CUSTOMIZATIONS
    renderTopToolbarCustomActions: () => (
      <div className="flex items-center gap-4">
        <Tooltip arrow title="Refrescar">
          <IconButton onClick={() => servicesQuery.refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <DateRangePicker
          showOneCalendar
          placeholder="Rango"
          showWeekNumbers
          isoWeek
          ranges={[]}
          value={dateRange}
          onChange={setDateRange}
        />
        <FiltersMenu
          options={filterOptions}
          defaultSelectedKey="travel-plan"
          onOptionChange={setSelectedOption}
        />
      </div>
    ),
    muiTableContainerProps: {
      sx: {
        height: 'calc(100vh - 168px)',
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    defaultColumn: {
      muiTableBodyCellProps: {
        sx: {
          padding: '2px',
        },
      },
    },
  });

  return (
    <section className="px-4">
      <MaterialReactTable table={table} />
      <Outlet />
    </section>
  );
};

export default ServiceRequestsPage;

