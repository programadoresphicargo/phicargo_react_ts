import {
  MRT_DensityState,
  MRT_GroupingState,
  MRT_Row,
  MRT_RowData,
  MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table';

import { Box } from '@mui/material';
import ExportExcelButton from '@/components/ui/buttons/ExportExcelButton';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { RefreshButton } from '@/components/ui';
import { useTableState } from './useTableState';

interface BaseRowData {
  id: string | number;
}

interface Config<T extends MRT_RowData & BaseRowData>
  extends MRT_TableOptions<T> {
  tableId: string;
  isLoading: boolean;
  isFetching: boolean;
  error?: string | null;
  density?: MRT_DensityState;
  containerHeight?: string;
  showColumnFilters?: boolean;
  showGlobalFilter?: boolean;
  onDoubleClickFn?: (row: MRT_Row<T>) => void;
  refetchFn?: () => void;
  exportFn?: (data: T[]) => void;
  toolbarActions?: React.ReactNode;

  externalGrouping?: MRT_GroupingState;
  stickyRightActions?: boolean;
}

export const useBaseTable = <T extends MRT_RowData & BaseRowData>(
  config: Config<T>,
) => {
  const state = useTableState({
    tableId: `${config.tableId}`,
    externalGrouping: config.externalGrouping,
  });

  return useMaterialReactTable<T>({
    ...config,
    // DATA
    columns: config.columns,
    data: config.data || [],
    getRowId: (row) => String(row.id),
    // LOCALIZATION
    localization: MRT_Localization_ES,
    // EXTRA CONFIG
    enableStickyHeader: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    positionToolbarAlertBanner: 'bottom',
    // PAGINATION, FILTERS, SORTING
    enableGrouping: true,
    enableColumnPinning: true,
    enableColumnOrdering: true,
    onColumnFiltersChange: state.setColumnFilters,
    onGlobalFilterChange: state.setGlobalFilter,
    onSortingChange: state.setSorting,
    onGroupingChange: state.setGrouping,
    onColumnPinningChange: state.setColumnPinning,
    onColumnOrderChange: state.setColumnOrdering,
    // STATE
    initialState: {
      showColumnFilters: config.showColumnFilters,
      showGlobalFilter: config.showGlobalFilter,
      density: config.density ?? 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
      columnPinning: {
        right: config.stickyRightActions ? ['mrt-row-actions'] : [],
      },
      columnOrder: config.columns.map((col) => col.id as string),
    },
    state: {
      isLoading: config.isLoading,
      showProgressBars: config.isFetching,
      showAlertBanner: !!config.error,

      columnFilters: state.columnFilters,
      globalFilter: state.globalFilter,
      sorting: state.sorting,
      grouping: state.grouping,
      columnPinning: state.columnPinning,
      columnOrder: state.columnOrdering,
    },
    // CUSTOM ACTIONS
    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {config.refetchFn && <RefreshButton onRefresh={config.refetchFn} />}
          {config.exportFn && (
            <ExportExcelButton
              disabled={config.data?.length === 0}
              size="small"
              onClick={() =>
                config.exportFn
                  ? config.exportFn(
                    table.getRowModel().rows.map((row) => row.original),
                  )
                  : undefined
              }
            />
          )}
          {config.toolbarActions}
        </Box>
      </>
    ),
    muiTableBodyRowProps: config.onDoubleClickFn
      ? ({ row }) => ({
        onClick: () => config.onDoubleClickFn?.(row),
        sx: { cursor: 'pointer' },
      })
      : undefined,
    // CUSTOMIZATION
    muiToolbarAlertBannerProps: config.error
      ? {
        color: 'error',
        children: config.error,
      }
      : undefined,
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
        fontSize: '12px',
        padding: '10px 20px',
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableContainerProps: {
      sx: {
        height: config.containerHeight || 'auto',
      },
    },
    muiSkeletonProps: {
      animation: 'wave',
    },
    muiLinearProgressProps: {
      sx: {
        backgroundColor: 'linear-gradient(90deg, #0b2149, #002887)',
      },
    },
  });
};

