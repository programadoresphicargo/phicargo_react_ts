import { Box, IconButton, Tooltip } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_TableOptions,
} from 'material-react-table';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton as RsuiteIconButton } from 'rsuite';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useGlobalContext } from '../../hook/useGlobalContext';
import { useRecordsQuery } from '../../hook/useRecordsQuery';
import { useRecords } from '../../hook/useRecords';
import { Record } from '../../models/record-model';
import { useDailyReportColumns } from '../../hook/useDailyReportTable';
import toast from 'react-hot-toast';

/**
 * Componente que muestra la tabla de registros diarios
 */
const DailyReportTable = () => {
  const { month, branchId } = useGlobalContext();

  const {
    recordsQuery: { data: records, isFetching, refetch, isError, error },
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

  const onUpdateRecordData = (id: number) => {
    updateRecordData(id);
  };

  const { columns } = useDailyReportColumns();

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || 'Error al cargar los registros');
    }
  }, [isError, error]);

  const table = useMaterialReactTable({
    data: records || [],
    columns: columns,
    enableRowPinning: true,
    enableStickyHeader: true,
    keepPinnedRows: false,

    initialState: {
      pagination: { pageSize: 50, pageIndex: 0 },
    },
    state: {
      isLoading: isFetching,
      density: 'compact',
      isSaving: isPending,
    },
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    columnFilterDisplayMode: 'popover',
    // EDITING
    enableEditing: true,
    editDisplayMode: 'row',
    onEditingRowSave: handleSave,
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
              onClick={() => onUpdateRecordData(row.original.id)}
            >
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Editar">
          <span>
            <IconButton
              color="primary"
              // disabled={row.original?.date.isBefore(dayjs(), 'day')}
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <RsuiteIconButton
          appearance="primary"
          icon={<RefreshIcon />}
          style={{ padding: '5px', backgroundColor: '#2B303A' }}
          onClick={() => refetch()}
        />
      </div>
    ),
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 265px)',
      },
    },
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
    renderEmptyRowsFallback: () => {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '20rem',
          }}
        >
          <p
            style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: '#6B7280',
            }}
          >
            No se encontraron registros
          </p>
        </div>
      );
    },
    muiTablePaperProps: {
      style: {
        borderRadius: '1em',
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
