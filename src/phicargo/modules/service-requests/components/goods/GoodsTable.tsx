import { Box, IconButton, Tooltip } from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import { Button } from '@/components/ui/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Good } from '../../models';
import { GoodForm } from './GoodForm';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useGoodsColumns } from '../../hooks/goods-table/useGoodsColumns';
import { useServiceRequestFormContext } from '../../hooks/useServiceRequestFormContext';

export const GoodsTable = () => {
  const columns = useGoodsColumns();

  const { form } = useServiceRequestFormContext();
  const { watch, setValue } = form;

  const goods = watch('goods') ?? [];

  const addGood = (newGood: Good) => {
    setValue('goods', [...goods, newGood]);
  };

  const table = useMaterialReactTable<Good>({
    columns,
    data: goods,
    localization: MRT_Localization_ES,
    createDisplayMode: 'modal',
    editDisplayMode: 'row',
    enableEditing: true,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
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
        onClick={() => {
          table.setCreatingRow(true);
        }}
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

