import { useBaseTable } from '@/hooks';
import { useGetVehicleInspections } from '@/modules/vehicles/hooks/queries';
import type { VehicleInspection } from '@/modules/vehicles/models';
import { MaterialReactTable } from 'material-react-table';
import { useVehicleInspectionColumns } from '../hooks/useVehicleInspectionColumns';

const VehicleInspectionPage = () => {
  const { query } = useGetVehicleInspections();

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
    // toolbarActions: (
    //   <div className="flex items-center gap-4">
    //     <AddButton
    //       label="Crear Incidencia"
    //       size="small"
    //       onClick={() => table.setCreatingRow(true)}
    //     />
    //     <DateRangePicker
    //       showOneCalendar
    //       placeholder="Rango"
    //       showWeekNumbers
    //       isoWeek
    //       ranges={[]}
    //       value={dateRange}
    //       onChange={setDateRange}
    //       cleanable={false}
    //     />
    //   </div>
    // ),
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
