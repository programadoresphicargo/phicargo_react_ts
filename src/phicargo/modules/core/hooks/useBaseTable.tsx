import { Box, IconButton, Tooltip } from '@mui/material';
import {
  type MRT_ColumnDef,
  type MRT_RowData,
  type MRT_TableState,
  useMaterialReactTable,
} from 'material-react-table';

import RefreshIcon from '@mui/icons-material/Refresh';
import type { TableState } from '../types/global-types';

interface UseTableConfig<T extends MRT_RowData> {
  columns: MRT_ColumnDef<T>[];
  data: T[];
  state: TableState;
  isLoading: boolean;
  refetch: () => void;
  onDoubleClickFn?: (id: number | string) => void;
  initialState?: Partial<MRT_TableState<T>>;
  customActions?: React.ReactNode;
  containerHeight?: string;
  memoMode?: 'cells' | 'rows' | undefined;
}

export const useBaseTable = <T extends MRT_RowData>({
  columns,
  data,
  state,
  isLoading,
  refetch,
  onDoubleClickFn,
  initialState = {
    showColumnFilters: true,
    density: 'compact',
    pagination: { pageSize: 100, pageIndex: 0 },
    showGlobalFilter: true,
  },
  customActions,
  containerHeight = 'calc(100vh - 180px)',
  memoMode,
}: UseTableConfig<T>) => {
  return useMaterialReactTable<T>({
    // DATA
    columns,
    data: data || [],
    // EXTRA CONFIG
    enableStickyHeader: true,
    enableDensityToggle: false,
    enableFullScreenToggle: true,
    columnFilterDisplayMode: 'subheader',
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
    initialState,
    state: {
      isLoading,
      columnFilters: state.columnFilters,
      globalFilter: state.globalFilter,
      sorting: state.sorting,
      grouping: state.grouping,
      columnPinning: state.columnPinning,
      columnOrder: state.columnOrdering,
    },
    muiTableBodyRowProps: onDoubleClickFn
      ? ({ row }) => ({
          onDoubleClick: () => onDoubleClickFn(row.original.id),
          sx: { cursor: 'pointer' },
        })
      : undefined,
    renderTopToolbarCustomActions: () => (
      <Box>
        <Tooltip arrow title="Refrescar">
          <IconButton onClick={refetch}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        {customActions}
      </Box>
    ),
    muiTableContainerProps: {
      sx: {
        height: containerHeight,
      },
    },
    memoMode,
  });
};

