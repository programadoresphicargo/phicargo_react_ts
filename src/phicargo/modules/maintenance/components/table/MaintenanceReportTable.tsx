import { IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';
import {
  MRT_ColumnFiltersState,
  MRT_TableOptions,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import type { MaintenanceRecord, MaintenanceRecordStatus } from '../../models';
import { useEffect, useState } from 'react';
import { useMaintenanceRecord, useMaintenanceReportColumns } from '../../hooks';

import AddButton from '../../../core/components/ui/AddButton';
import CheckIcon from '@mui/icons-material/Check';
import CompleteDialog from '../CompleteDialog';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import dayjs from 'dayjs';
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

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );

  const {
    recordsQuery: { data: records, isFetching, refetch },
    editRecordMutation: { mutate: updateRegister, isPending },
  } = useMaintenanceRecord(status);

  const columns = useMaintenanceReportColumns(records || []);

  const handleSaveRegisters: MRT_TableOptions<MaintenanceRecord>['onEditingRowSave'] =
    async ({ values, table, row }) => {
      const r = {
        ...values,
        checkIn: values.checkIn ? dayjs(values.checkIn) : row.original.checkIn,
        deliveryDate: values.deliveryDate
          ? dayjs(values.deliveryDate)
          : row.original.deliveryDate,
        workshopId:
          typeof values.workshop === 'number'
            ? values.workshop
            : row.original.workshop.id,
      };
      updateRegister({ id: row.original.id, updatedItem: r });
      table.setEditingRow(null);
    };

  useEffect(() => {
    const statusFiltered = columnFilters.find((f) => f.id === 'status');
    if (statusFiltered) {
      setStatus(statusFiltered.value as MaintenanceRecordStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters]);

  const table = useMaterialReactTable<MaintenanceRecord>({
    // DATA
    columns,
    data: records || [],
    enableStickyHeader: true,
    // PAGINATION, FILTERS, SORTING
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    getRowId: (row) => row.id as unknown as string,
    onColumnFiltersChange: setColumnFilters,
    editDisplayMode: 'row',
    enableEditing: true,
    onEditingRowSave: handleSaveRegisters,
    enableRowActions: true,
    positionActionsColumn: 'first',
    // STATE
    state: {
      isLoading: isFetching,
      isSaving: isPending,
      columnFilters: columnFilters,
    },
    initialState: {
      density: 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
    },
    // CUSTOMIZATIONS
    renderRowActionMenuItems: ({ row, closeMenu }) => [
      <MenuItem
        key="details"
        onClick={() =>
          navigate(`/reportes/mantenimiento/detalles/${row.original.id}`)
        }
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        Detalles
      </MenuItem>,
      <MenuItem
        key="complete"
        onClick={() => {
          setRegisterToFinishId(Number(row.original.id));
          setCompleteModal(true);
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <CheckIcon />
        </ListItemIcon>
        Finalizar
      </MenuItem>,
    ],
    renderTopToolbarCustomActions: () => (
      <div className="flex flex-row gap-2">
        <div className="flex flex-row items-center rounded-xl">
          <Tooltip arrow title="Refrescar">
            <IconButton onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>
        <div className="flex flex-row items-center">
          <AddButton
            label="Añadir Registro"
            onClick={() => navigate('/reportes/mantenimiento/nuevo')}
          />
        </div>
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
        maxHeight: 'calc(100vh - 225px)',
      },
    },
  });

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