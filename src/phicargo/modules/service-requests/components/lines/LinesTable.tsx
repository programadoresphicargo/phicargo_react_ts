import { Box, IconButton, Tooltip } from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import { Button } from '@/components/ui/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { ServiceCreate } from '../../models';
import { ServiceForm } from './ServiceForm';
import { useLinesColumns } from '../../hooks/lines-table/useLinesColumns';
import { useServiceRequestFormContext } from '../../hooks/useServiceRequestFormContext';

export const LinesTable = () => {
  const columns = useLinesColumns();

  const { form } = useServiceRequestFormContext();
  const { watch, setValue } = form;

  const services = watch('services') ?? [];

  const addService = (newService: ServiceCreate) => {
    setValue('services', [...services, newService]);
  };

  const table = useMaterialReactTable<ServiceCreate>({
    columns,
    data: services,
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
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Añadir Servicio
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
      <ServiceForm
        onClose={() => table.setCreatingRow(null)}
        addService={addService}
      />
    ),
    renderEditRowDialogContent: undefined,
    state: {
      density: 'compact',
    },
  });

  return <MaterialReactTable table={table} />;
};

