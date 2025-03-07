import { Box, IconButton, Tooltip } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_TableOptions,
} from 'material-react-table';
import RefreshIcon from '@mui/icons-material/Refresh';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useGlobalContext } from '../../hook/useGlobalContext';
import { useRecordsQuery } from '../../hook/useRecordsQuery';
import { useRecords } from '../../hook/useRecords';
import { Record } from '../../models/record-model';
import { useDailyReportColumns } from '../../hook/useDailyReportTable';
import toast from 'react-hot-toast';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

/**
 * Componente que muestra la tabla de registros diarios
 */
const DailyReportTable = () => {
  const { month, branchId } = useGlobalContext();

  const {
    recordsQuery: { data: records, isFetching, isLoading, refetch, isError, error },
  } = useRecordsQuery(month, branchId);

  const {
    updateRecordMutation: { mutate: updateRecord, isPending },
    updateRecordDataMutation: { mutate: updateRecordData },
  } = useRecords();

  const handleSave: MRT_TableOptions<Record>['onEditingRowSave'] = async ({
    values,
    table,
    row,
  }) => {
    updateRecord({
      id: row.original.id,
      updatedItem: values,
    });
    table.setEditingRow(null);
  };

  const onUpdateRecordData = (record: Record) => {
    updateRecordData({ branchId, date: record.date.format('YYYY-MM-DD') });
  };

  const { columns } = useDailyReportColumns();

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || 'Error al cargar los registros');
    }
  }, [isError, error]);

  const table = useMaterialReactTable({
    // DATA
    data: records || [],
    columns: columns,
    localization: MRT_Localization_ES,
    enableStickyHeader: true,
    enableRowPinning: true,
    keepPinnedRows: false,
    enableDensityToggle: false,
    enableFullScreenToggle: true,
    // PAGINATION, FILTERS, SORTING
    columnFilterDisplayMode: 'popover',
    enableEditing: true,
    editDisplayMode: 'row',
    onEditingRowSave: handleSave,
    // STATE
    initialState: {
      density: 'compact',
      pagination: { pageSize: 50, pageIndex: 0 },
    },
    state: {
      isLoading: isLoading,
      showProgressBars: isFetching,
      isSaving: isPending,
    },
    // ACTIONS
    enableRowActions: true,
    positionActionsColumn: 'first',
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex' }}>
        <Tooltip title="Actualizar">
          <span>
            <IconButton
              color="default"
              disabled={!row.original?.date.isSame(dayjs(), 'day')}
              onClick={() => onUpdateRecordData(row.original)}
            >
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Editar">
          <span>
            <IconButton
              color="primary"
              disabled={row.original?.date.isBefore(
                dayjs().subtract(3, 'day'),
                'day',
              )}
              onClick={() => table.setEditingRow(row)}
            >
              <EditIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    ),
    // CUSTOMIZATIONS
    renderTopToolbarCustomActions: () => (
      <div className="flex flex-row gap-2">
        <div className="flex flex-row items-center rounded-xl">
          <Tooltip arrow title="Refrescar">
            <IconButton onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>
        <div className="flex flex-row items-center"></div>
      </div>
    ),
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: '',
        size: 20,
      },
      'mrt-row-pin': {
        header: '',
        size: 10,
      },
    },
    muiTableBodyRowProps: ({ row }) => {
      return {
        sx: {
          backgroundColor: row.original?.date
            ? row.original?.date.isBefore(dayjs(), 'day')
              ? '#829399'
              : row.original?.date.isSame(dayjs(), 'day')
              ? '#E8FCC2'
              : 'inherit'
            : 'inherit',
        },
      };
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
      },
    },
    muiTableContainerProps: {
      sx: {
        height: 'calc(100vh - 200px)',
      },
    },
  });

  useEffect(() => {
    table.resetRowPinning();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records]);

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

export default DailyReportTable;
