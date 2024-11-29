import {
  MRT_RowData,
  MRT_TableInstance,
  MaterialReactTable,
} from 'material-react-table';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';

interface MaterialTableProps<TData extends MRT_RowData> {
  table: MRT_TableInstance<TData>;
}

const MaterialTableBase = <TData extends MRT_RowData>({
  table,
}: MaterialTableProps<TData>) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
};

export default MaterialTableBase;
