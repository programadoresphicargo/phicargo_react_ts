import { useBaseTable } from '@/hooks';
import { useGetVehicleInspections } from '@/modules/vehicles/hooks/queries';
import type { VehicleInspection } from '@/modules/vehicles/models';
import { MaterialReactTable } from 'material-react-table';
import { useVehicleInspectionColumns } from '../hooks/useVehicleInspectionColumns';
import { MonthSelect, YearSelect } from '@/components/inputs';
import { useState } from 'react';
import { VehicleInspectionDetailModal } from '@/modules/vehicles/components/vehicle-inspections/VehicleInspectionDetailsModal';
import InfoIcon from '@mui/icons-material/Info';
import { Box, IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { InspectionModal } from '@/modules/vehicles/components/vehicle-inspections/InspectionModal';

// const dialogProps: DialogProps = {
//   slots: {
//     transition: MuiTransition,
//   },
//   disableEnforceFocus: true,
//   disableScrollLock: true,
//   open: true,
//   maxWidth: 'md',
//   sx: {
//     '& .MuiPaper-root': {
//       borderRadius: 4,
//     },
//   },
// };

const VehicleInspectionPage = () => {
  const [month, setMonth] = useState<string | number>(
    new Date().getMonth() + 1,
  );
  const [year, setYear] = useState<string | number>(new Date().getFullYear());
  const [detail, setDetail] = useState<VehicleInspection | null>(null);
  const [toInspect, setToInspect] = useState<VehicleInspection | null>(null);

  const { query } = useGetVehicleInspections(month as number, year as number);

  const columns = useVehicleInspectionColumns();

  const table = useBaseTable<VehicleInspection>({
    columns,
    data: query.data || [],
    tableId: 'vehicle-inspections-table',
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error?.message,
    refetchFn: () => query.refetch(),
    showColumnFilters: true,
    showGlobalFilter: true,
    containerHeight: 'calc(100vh - 170px)',
    enableRowActions: true,
    positionActionsColumn: 'first',
    renderRowActions: ({ row }) => {
      const value = row.original;
      const hasInspection = !!value.inspection;
      return (
        <Box sx={{ display: 'flex' }}>
          <Tooltip title={hasInspection ? 'Ver detalles' : 'Revisar Unidad'}>
            <IconButton
              size="small"
              color={hasInspection ? 'primary' : 'warning'}
              onClick={
                hasInspection
                  ? () => setDetail(value)
                  : () => setToInspect(value)
              }
            >
              {hasInspection ? <InfoIcon /> : <VisibilityIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      );
    },
    toolbarActions: (
      <div className="flex items-center gap-4">
        <MonthSelect onMonthChange={setMonth} />
        <YearSelect onYearChange={setYear} />
      </div>
    ),
    // muiEditRowDialogProps: dialogProps,
    // muiCreateRowModalProps: dialogProps,
    // renderCreateRowDialogContent: ({ table }) => (
    //   <CreateIncidentModal onClose={() => table.setCreatingRow(null)} />
    // ),
    // renderEditRowDialogContent: ({ table, row }) => (
    //   <EditIncidentModal
    //     onClose={() => table.setEditingRow(null)}
    //     incident={row.original}
    //   />
    // ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
      {detail && (
        <VehicleInspectionDetailModal
          open={!!detail}
          onClose={() => setDetail(null)}
          vehicleInspection={detail}
        />
      )}
      {toInspect && (
        <InspectionModal
          open={!!toInspect}
          onClose={() => setToInspect(null)}
          vehicleInspection={toInspect}
        />
      )}
    </>
  );
};

export default VehicleInspectionPage;

