import { useBaseTable } from '@/hooks';
import { useGetVehicleInspections } from '@/modules/vehicles/hooks/queries';
import type { VehicleInspection } from '@/modules/vehicles/models';
import { MaterialReactTable } from 'material-react-table';
import { useVehicleInspectionColumns } from '../hooks/useVehicleInspectionColumns';
import { MonthSelect, YearSelect } from '@/components/inputs';
import { useState } from 'react';

const VehicleInspectionPage = () => {
  const [month, setMonth] = useState<string | number>(
    new Date().getMonth() + 1,
  );
  const [year, setYear] = useState<string | number>(new Date().getFullYear());

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
    // renderRowActions: ({ row }) => (
    //   <Box sx={{ display: 'flex' }}>
    //     <Tooltip title="Detalles">
    //       <IconButton
    //         size="small"
    //         color="primary"
    //         onClick={() => setDetail(row.original)}
    //       >
    //         <InfoIcon />
    //       </IconButton>
    //     </Tooltip>
    //     <Tooltip title="Editar">
    //       <IconButton size="small" onClick={() => table.setEditingRow(row)}>
    //         <EditIcon />
    //       </IconButton>
    //     </Tooltip>
    //   </Box>
    // ),
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
      {/* {detail && (
        <IncidentDetailsModal
          open={!!detail}
          onClose={() => setDetail(null)}
          incident={detail}
        />
      )} */}
    </>
  );
};

export default VehicleInspectionPage;

