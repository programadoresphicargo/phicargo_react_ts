import { Box, IconButton, Tooltip } from '@mui/material';
import type { MaintenanceRecord, MaintenanceRecordStatus } from '../../models';
import { useEffect, useState } from 'react';
import { useMaintenanceRecord, useMaintenanceReportColumns } from '../../hooks';

import { AddButton } from '@/components/ui';
import CompleteDialog from '../CompleteDialog';
import EditIcon from '@mui/icons-material/Edit';
import { EditRecordForm } from '../EditRecordForm';
import InfoIcon from '@mui/icons-material/Info';
import { MaterialReactTable } from 'material-react-table';
import { MuiTransition } from '@/components';
import { RecordDetailsModal } from '../RecordDetailsModal';
import { useBaseTable } from '@/hooks';
import { useNavigate } from 'react-router-dom';

interface MaintenanceReportTableProps {
  status: MaintenanceRecordStatus;
  setStatus: (status: MaintenanceRecordStatus) => void;
}

const MaintenanceReportTable = (props: MaintenanceReportTableProps) => {
  const { status, setStatus } = props;

  const [detail, setDetail] = useState<MaintenanceRecord | null>(null);

  const navigate = useNavigate();

  const [completeModal, setCompleteModal] = useState(false);
  const [reigsterToFinishId, setRegisterToFinishId] = useState<number | null>(
    null,
  );

  const {
    recordsQuery: { data: records, isFetching, refetch, isLoading },
  } = useMaintenanceRecord(status);

  const columns = useMaintenanceReportColumns(records || []);

  const table2 = useBaseTable<MaintenanceRecord>({
    columns,
    data: records || [],
    isFetching,
    isLoading,
    refetchFn: refetch,
    tableId: 'maintenance-report-table',
    containerHeight: 'calc(100vh - 220px)',
    enableRowActions: true,
    columnFilterDisplayMode: 'popover',
    positionActionsColumn: 'first',
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
            onClick={() => setDetail(row.original)}
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    toolbarActions: (
      <AddButton
        label="Añadir Servicio"
        size="small"
        onClick={() => navigate('/reportes/mantenimiento/nuevo')}
      />
    ),
    muiEditRowDialogProps: () => ({
      slots: {
        transition: MuiTransition,
      },
      disableEnforceFocus: true,
      disableScrollLock: true,
      open: true,
    }),
    renderEditRowDialogContent: ({ table, row }) => (
      <EditRecordForm
        onClose={() => table.setEditingRow(null)}
        record={row.original}
      />
    ),
  });

  const columnFilters = table2.getState().columnFilters;
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
      <MaterialReactTable table={table2} />
      {detail && (
        <RecordDetailsModal
          open={!!detail}
          onClose={() => setDetail(null)}
          record={detail}
        />
      )}
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
