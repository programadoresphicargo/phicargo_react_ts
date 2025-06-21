import 'rsuite/dist/rsuite-no-reset.min.css';

import { Box, IconButton, Tooltip } from '@mui/material';
import { useBaseTable, useSessionStorage } from '@/hooks';

import { DateRange } from 'rsuite/esm/DateRangePicker/types';
import EditIcon from '@mui/icons-material/Edit';
import { EditServiceRequestForm } from '../components/EditServiceRequestForm';
import { FiltersMenu } from '../components/ui/FiltersMenu';
import { MaterialReactTable } from 'material-react-table';
import { MuiTransition } from '@/components';
import type { Option } from '@/types';
import { Outlet } from 'react-router-dom';
import { Waybill } from '../models';
import dayjs from 'dayjs';
import { useGetServices } from '../hooks/queries';
import { useServiceColumns } from '../hooks/useServiceColumns';
import { useState } from 'react';
import DateRangePicker from 'rsuite/esm/DateRangePicker/DateRangePicker';

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

  const [selectedOption, setSelectedOption] = useSessionStorage<Option<
    string[]
  > | null>('service-requests-filter-group', null);

  const columns = useServiceColumns();

  const { servicesQuery } = useGetServices(dateRange);

  const table = useBaseTable<Waybill>({
    columns,
    data: servicesQuery.data || [],
    tableId: 'service-requests-table',
    isLoading: servicesQuery.isLoading,
    isFetching: servicesQuery.isFetching,
    error: servicesQuery.error?.message,
    refetchFn: () => servicesQuery.refetch(),
    showGlobalFilter: true,
    containerHeight: 'calc(100vh - 175px)',
    enableEditing: true,
    editDisplayMode: 'modal',
    muiEditRowDialogProps: () => ({
      fullScreen: true,
      slots: {
        transition: MuiTransition,
      },
      disableEnforceFocus: true,
      disableScrollLock: true,
      open: true,
    }),
    renderEditRowDialogContent: ({ table, row }) => (
      <EditServiceRequestForm
        onClose={() => table.setEditingRow(null)}
        serviceRequest={row.original}
      />
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Editar">
          <IconButton size='small' onClick={() => table.setEditingRow(row)}>
            <EditIcon color='primary' />
          </IconButton>
        </Tooltip>
      </Box>
    ),
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
        <FiltersMenu
          options={filterOptions}
          defaultSelectedKey="travel-plan"
          onOptionChange={setSelectedOption}
        />
      </div>
    ),

    externalGrouping: selectedOption?.value ?? [],
  });

  return (
    <section>
      <MaterialReactTable table={table} />
      <Outlet />
    </section>
  );
};

export default ServiceRequestsPage;

