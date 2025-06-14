import { useBaseTable } from "@/hooks";
import { useIncidentsQueries } from "../hooks/quries";
import { useIncidentsColumns } from "../hooks/useIncidentsColumns";
import { useIncidentsContext } from "../hooks/useIncidentsContext";
import { Incident } from "../models";
import { DateRangePicker } from "@/components/inputs";
import { MaterialReactTable } from "material-react-table";

const DirectionIncidentsPage = () => {
  const { dateRange, setDateRange, formatedDateRange } = useIncidentsContext();


  const {
    incidentsQuery: { data: incidents, isFetching, isLoading, refetch, error },
  } = useIncidentsQueries({
    startDate: formatedDateRange.startDate,
    endDate: formatedDateRange.endDate,
  });

  const columns = useIncidentsColumns();

  const table = useBaseTable<Incident>({
    columns,
    data: incidents || [],
    tableId: 'incidents-table',
    isLoading: isLoading,
    isFetching: isFetching,
    error: error?.message,
    refetchFn: () => refetch(),
    showColumnFilters: true,
    showGlobalFilter: true,
    containerHeight: 'calc(100vh - 170px)',
    enableRowActions: true,
    positionActionsColumn: 'first',
    // renderRowActions: ({ row }) => (
    //   <Box sx={{ display: 'flex' }}>
    //     <Tooltip title="Editar">
    //       <IconButton size="small" onClick={() => table.setEditingRow(row)}>
    //         <EditIcon />
    //       </IconButton>
    //     </Tooltip>
    //   </Box>
    // ),
    toolbarActions: (
      <div className="flex items-center gap-4">
        <DateRangePicker
          showOneCalendar
          placeholder="Rango"
          showWeekNumbers
          isoWeek
          ranges={[]}
          value={dateRange}
          onChange={setDateRange}
          cleanable={false}
        />
      </div>
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

export default DirectionIncidentsPage;
