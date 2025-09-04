import { Box, DialogProps, IconButton, Tooltip } from '@mui/material';
import type { MaintenanceRecord, MaintenanceRecordStatus } from '../../models';
import { useEffect, useState } from 'react';
import { useMaintenanceRecord, useMaintenanceReportColumns } from '../../hooks';
import { CreateRecordForm } from '../CreateRecordForm';
import EditIcon from '@mui/icons-material/Edit';
import { EditRecordForm } from '../EditRecordForm';
import InfoIcon from '@mui/icons-material/Info';
import { MaterialReactTable } from 'material-react-table';
import { MuiTransition } from '@/components';
import { RecordDetailsModal } from '../RecordDetailsModal';
import { useBaseTable } from '@/hooks';
import { Button } from '@heroui/react';
import { ExportConfig, ExportToExcel } from '@/utilities';

const dialogProps: DialogProps = {
  slots: {
    transition: MuiTransition,
  },
  disableEnforceFocus: true,
  disableScrollLock: true,
  open: true,
  sx: {
    '& .MuiPaper-root': {
      borderRadius: 4,
    },
  },
};

interface MaintenanceReportTableProps {
  status: MaintenanceRecordStatus;
  setStatus: (status: MaintenanceRecordStatus) => void;
}

const MaintenanceReportTable = (props: MaintenanceReportTableProps) => {
  const { status, setStatus } = props;

  const [detail, setDetail] = useState<MaintenanceRecord | null>(null);

  const {
    recordsQuery: { data: records, isFetching, refetch, isLoading },
  } = useMaintenanceRecord(status);

  const columns = useMaintenanceReportColumns(records || []);
  console.log(columns);

  const table = useBaseTable<MaintenanceRecord>({
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
    initialState: {
      columnOrder: columns.map((col) => col.id as string),
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex' }}>
        <Tooltip title="Editar">
          <IconButton size="small" onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Detalles">
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
      <>
        <Button
          radius='full'
          color='primary'
          onPress={() => table.setCreatingRow(true)}
        >Añadir Servicio
        </Button>
        <Button
          radius='full'
          className='text-white'
          color='success'
          onPress={() => exportTo.exportData(records || [])}>
          Exportar
        </Button>
      </>
    ),
    muiEditRowDialogProps: dialogProps,
    muiCreateRowModalProps: dialogProps,
    renderEditRowDialogContent: ({ table, row }) => (
      <EditRecordForm
        onClose={() => table.setEditingRow(null)}
        record={row.original}
      />
    ),
    renderCreateRowDialogContent: ({ table }) => (
      <CreateRecordForm
        onClose={() => table.setCreatingRow(null)}
      />
    ),
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
      {detail && (
        <RecordDetailsModal
          open={!!detail}
          onClose={() => setDetail(null)}
          record={detail}
        />
      )}
    </>
  );
};

export default MaintenanceReportTable;

const exportConf: ExportConfig<MaintenanceRecord> = {
  fileName: 'Turnos',
  withDate: true,
  columns: [
    { accessorFn: (data) => data.vehicle.branch?.name, header: 'Sucursal', columnWidth: 50 },
    { accessorFn: (data) => data.vehicle.name, header: 'Unidad', columnWidth: 50 },
    { accessorFn: (data) => data.lastCommentDate?.format('DD/MM/YYYY') || 'N/A', header: 'Ultima actualizacion', columnWidth: 50 },
    { accessorFn: (data) => data.deliveryDate?.format('DD/MM/YYYY') || 'N/A', header: 'Entrega tentativa', columnWidth: 50 },
    { accessorFn: (data) => data.vehicle.vehicleType, header: 'Tipo', columnWidth: 50 },
    { accessorFn: (data) => data.status, header: 'Estatus', columnWidth: 50 },
    { accessorFn: (data) => data.workshop.name, header: 'Taller', columnWidth: 50 },
    { accessorFn: (data) => data.checkIn?.format('DD/MM/YYYY') || 'N/A', header: 'Entrada', columnWidth: 50 },
    { accessorFn: (data) => data.checkOut?.format('DD/MM/YYYY') || 'N/A', header: 'Salida', columnWidth: 50 },
    { accessorFn: (data) => data.daysInWorkshop, header: 'Dias en sucursal', columnWidth: 50 },
    { accessorFn: (data) => data.order, header: 'OM', columnWidth: 50 },
    { accessorFn: (data) => data.supervisor, header: 'Supervisor', columnWidth: 50 },
  ],
};

const exportTo = new ExportToExcel(exportConf);
