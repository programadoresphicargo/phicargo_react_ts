import {
  MaterialReactTable,
  MRT_RowData,
  MRT_TableOptions,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

interface MaterialTableProps<TData extends MRT_RowData>
  extends MRT_TableOptions<TData> {
  data: TData[];
  columns: MRT_ColumnDef<TData>[];
}

const MaterialTable = <TData extends MRT_RowData>(
  props: MaterialTableProps<TData>
) => {
  const { data, columns } = props;

  const table = useMaterialReactTable({
    renderEmptyRowsFallback: () => {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "20rem",
          }}
        >
          <p
            style={{
              fontSize: "1.125rem",
              fontWeight: "bold", 
              color: "#6B7280", 
            }}
          >
            No se encontraron registros
          </p>
        </div>
      );
    },
    ...props,
    columns,
    data,
    muiTablePaperProps: {
      style: {
        borderRadius: "1em",
      },
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
};

export default MaterialTable;
