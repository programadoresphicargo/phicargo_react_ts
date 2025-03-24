import { Box, IconButton, Tooltip } from '@mui/material';
import type { ComplementCpCreate, WaybillCreate } from '../../models';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button } from '@/components/ui';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { GoodForm } from './GoodForm';
import {
  MaterialReactTable,
} from 'material-react-table';
import { UseFormReturn } from 'react-hook-form';
import { useBaseTable } from '@/hooks';
import { useGoodsColumns } from '../../hooks/goods-table/useGoodsColumns';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<WaybillCreate, any, undefined>;
  height?: string;
}

export const GoodsTable = ({ form, height }: Props) => {
  const columns = useGoodsColumns();

  const { watch, setValue } = form;

  const goods = watch('complementCp') ?? [];

  const addGood = (newGood: ComplementCpCreate) => {
    setValue('complementCp', [...goods, newGood]);
  };

  const table = useBaseTable<ComplementCpCreate>({
    columns,
    data: goods,
    tableId: 'service-goods-table',
    isLoading: false,
    isFetching: false,
    error: null,
    containerHeight: height ?? 'calc(100vh - 315px)',
    enableEditing: true,
    editDisplayMode: 'row',
    renderRowActions: ({ row, table }) => (
      <Box>
        <Tooltip title="Editar">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton color="error" onClick={() => {}}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    muiCreateRowModalProps: () => ({
      open: true,
      sx: {
        '& .MuiDialog-paper': {
          width: '100%',
          maxWidth: '600px',
          borderRadius: 3,
        },
      },
    }),
    renderCreateRowDialogContent: ({ table }) => (
      <GoodForm onClose={() => table.setCreatingRow(null)} addGood={addGood} />
    ),
    toolbarActions: (
      <Button
        variant="contained"
        size="small"
        startIcon={<AddCircleIcon />}
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Añadir Mercancía
      </Button>
    ),
  });

  return <MaterialReactTable table={table} />;
};

