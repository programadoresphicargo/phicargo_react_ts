import { AddButton, RefreshButton } from '@/components/ui';
import {
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import type { MaintenanceRecord, MaintenanceRecordStatus } from '../../models';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useState } from 'react';
import { useMaintenanceRecord, useMaintenanceReportColumns } from '../../hooks';

import CompleteDialog from '../CompleteDialog';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useNavigate } from 'react-router-dom';

interface MaintenanceReportTableProps {
  status: MaintenanceRecordStatus;
  setStatus: (status: MaintenanceRecordStatus) => void;
}

const MaintenanceReportTable = (props: MaintenanceReportTableProps) => {
  const { status, setStatus } = props;
  const navigate = useNavigate();

  const [completeModal, setCompleteModal] = useState(false);
  const [reigsterToFinishId, setRegisterToFinishId] = useState<number | null>(
    null,
  );

  const {
    recordsQuery: { data: records, isFetching, refetch, isLoading },
  } = useMaintenanceRecord(status);

  const columns = useMaintenanceReportColumns(records || []);

  const table = useMaterialReactTable<MaintenanceRecord>({
    // DATA
    columns,
    data: records || [],
    localization: MRT_Localization_ES,
    enableStickyHeader: true,
    // PAGINATION, FILTERS, SORTING
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    getRowId: (row) => row.id as unknown as string,
    editDisplayMode: 'row',
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: 'first',
    // STATE
    state: {
      isLoading: isLoading,
      showProgressBars: isFetching,
    },
    initialState: {
      density: 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
    },
    // CUSTOMIZATIONS
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex' }}>
        <Tooltip title="Edit">
          <IconButton size="small" onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            color="primary"
            onClick={() =>
              navigate(`/reportes/mantenimiento/detalles/${row.original.id}`)
            }
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: () => (
      <div className="flex flex-row gap-2 items-center">
        <RefreshButton onRefresh={() => refetch()} />
        <AddButton
          label="Añadir Servicio"
          onClick={() => navigate('/reportes/mantenimiento/nuevo')}
        />
      </div>
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
      },
    },
    muiTableContainerProps: {
      sx: {
        height: 'calc(100vh - 225px)',
      },
    },
  });

  const columnFilters = table.getState().columnFilters;
  useEffect(() => {
    const statusFilter = columnFilters.find((filter) => filter.id === 'status');
    if (statusFilter) {
      setStatus(statusFilter.value as MaintenanceRecordStatus);
    } else {
      setStatus('pending');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters]);

  return (
    <>
      <MaterialReactTable table={table} />
      {completeModal && reigsterToFinishId && (
        <CompleteDialog
          open={completeModal}
          onClose={() => {
            setCompleteModal(false);
            setRegisterToFinishId(null);
          }}
          itemId={reigsterToFinishId}
        />
      )}
    </>
  );
};

export default MaintenanceReportTable;
