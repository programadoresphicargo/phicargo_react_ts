import { Box, IconButton, Tooltip } from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button } from '@/components/ui';
import { ComplementCpCreate } from '../../models';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { GoodForm } from './GoodForm';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useCreateServiceContext } from '../../hooks/useCreateServiceContext';
import { useGoodsColumns } from '../../hooks/goods-table/useGoodsColumns';

export const GoodsTable = () => {
  const columns = useGoodsColumns();

  const { form } = useCreateServiceContext();
  const { watch, setValue } = form;

  const goods = watch('complementCp') ?? [];

  const addGood = (newGood: ComplementCpCreate) => {
    setValue('complementCp', [...goods, newGood]);
  };

  const table = useMaterialReactTable<ComplementCpCreate>({
    columns,
    data: goods,
    localization: MRT_Localization_ES,
    createDisplayMode: 'modal',
    editDisplayMode: 'row',
    enableEditing: true,
    muiTableContainerProps: {
      sx: {
        minHeight: 'calc(100vh - 315px)',
      },
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => {}}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        size='small'
        onClick={() => {
          table.setCreatingRow(true);
        }}
        startIcon={<AddCircleIcon />}
      >
        Añadir Mercancía
      </Button>
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
    muiTablePaperProps: {
      elevation: 4,
      sx: {
        borderRadius: 2,
      },
    },
    state: {
      density: 'compact',
    },
  });

  return <MaterialReactTable table={table} />;
};

