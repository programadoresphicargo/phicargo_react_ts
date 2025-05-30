import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import type { Driver } from '@/modules/drivers/models';
import { DriverAccountForm } from '../components/DriverAccountForm';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Outlet } from 'react-router-dom';
import { RefreshButton } from '@/components/ui';
import { useDriverAccountsColumns } from '../hooks/useDriverAccountsColumns';
import { useDriverQueries } from '../../drivers/hooks/queries';

const DriversAccountsPage = () => {
  const columns = useDriverAccountsColumns();

  const { driversQuery } = useDriverQueries();

  const table = useMaterialReactTable<Driver>({
    // DATA
    columns,
    data: driversQuery.data || [],
    localization: MRT_Localization_ES,
    enableStickyHeader: true,
    // PAGINATION, FILTERS, SORTING
    enableEditing: true,
    editDisplayMode: 'modal',
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnPinning: true,
    columnResizeMode: 'onEnd',
    // STATE
    state: {
      isLoading: driversQuery.isLoading,
      showProgressBars: driversQuery.isFetching,
    },
    initialState: {
      density: 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
      showGlobalFilter: true,
      showColumnFilters: true,
    },
    renderTopToolbarCustomActions: () => (
      <div className="flex flex-row gap-2">
        <RefreshButton
          onRefresh={() => driversQuery.refetch()}
          isLoading={driversQuery.isFetching}
        />
      </div>
    ),
    renderEditRowDialogContent: ({ table, row }) => (
      <DriverAccountForm
        onClose={() => table.setEditingRow(null)}
        driver={row.original}
      />
    ),
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
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

        padding: '3px 10px',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 173px)',
      },
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <Outlet />
    </>
  );
};

export default DriversAccountsPage;

