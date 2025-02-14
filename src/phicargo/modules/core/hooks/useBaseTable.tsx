import { IconButton, Tooltip } from '@mui/material';
import {
  type MRT_ColumnDef,
  type MRT_RowData,
  type MRT_TableState,
  useMaterialReactTable,
} from 'material-react-table';

import RefreshIcon from '@mui/icons-material/Refresh';
import type { TableState } from '../types/global-types';
import ExportExcelButton from '../components/ui/ExportExcelButton';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

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
  onExportExcel?: (data: T[]) => void;
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
  containerHeight = 'calc(100vh - 171px)',
  memoMode,
  onExportExcel
}: UseTableConfig<T>) => {
  return useMaterialReactTable<T>({
    // DATA
    columns,
    data: data || [],
    localization: MRT_Localization_ES,
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
        fontSize: '0.75rem',
        padding: '3px 5px',
      },
    },
    muiTableBodyRowProps: onDoubleClickFn
      ? ({ row }) => ({
        onDoubleClick: () => onDoubleClickFn(row.original.id),
        sx: { cursor: 'pointer' },
      })
      : undefined,
    renderTopToolbarCustomActions: ({ table }) => (
      <div className="flex items-center gap-4">
        <Tooltip arrow title="Refrescar">
          <IconButton onClick={refetch}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        {onExportExcel && (
          <ExportExcelButton 
            label={"Exportar"} 
            size='sm' 
            variant='faded'
            isDisabled={data.length === 0}
            onPress={() => onExportExcel(table.getRowModel().rows.map((row) => row.original))}
          />
        )}
        {customActions}
      </div>
    ),
    muiTableContainerProps: {
      sx: {
        height: containerHeight,
      },
    },
    memoMode,
  });
};

