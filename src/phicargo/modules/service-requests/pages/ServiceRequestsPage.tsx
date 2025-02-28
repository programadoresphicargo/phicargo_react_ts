import 'rsuite/dist/rsuite-no-reset.min.css';

import { IconButton, Tooltip } from '@mui/material';

import { DateRange } from 'rsuite/esm/DateRangePicker/types';
import { DateRangePicker } from 'rsuite';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import MaterialTableBase from '../../core/components/tables/MaterialTableBase';
import { Outlet } from 'react-router-dom';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Waybill } from '../models';
import { useGetServices } from '../hooks/queries';
import { useMaterialReactTable } from 'material-react-table';
import { useServiceColumns } from '../hooks/useServiceColumns';
import { useState } from 'react';

const ServiceRequestsPage = () => {
  const [value, setValue] = useState<DateRange | null>(null);

  const columns = useServiceColumns();

  const { servicesQuery } = useGetServices(value);

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
    columnFilterDisplayMode: 'subheader',
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
          value={value}
          onChange={setValue}
        />
      </div>
    ),
    muiTableContainerProps: {
      sx: {
        height: 'calc(100vh - 168px)',
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
    <>
      <MaterialTableBase table={table} />
      <Outlet />
    </>
  );
};

export default ServiceRequestsPage;

