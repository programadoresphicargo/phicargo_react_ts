import { Box, IconButton, Tooltip } from '@mui/material';
import type { ShippedProductCreate, WaybillCreate } from '../../models';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button } from '@/components/ui';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  MaterialReactTable,
} from 'material-react-table';
import { ServiceForm } from './ServiceForm';
import { UseFormReturn } from 'react-hook-form';
import { useBaseTable } from '@/hooks';
import { useLinesColumns } from '../../hooks/lines-table/useLinesColumns';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<WaybillCreate, any, undefined>;
  height?: string;
}

export const LinesTable = ({ form, height }: Props) => {
  const columns = useLinesColumns();

  const { watch, setValue } = form;

  const services = watch('shippedProducts') ?? [];

  const addProduct = (newProduct: ShippedProductCreate) => {
    setValue('shippedProducts', [...services, newProduct]);
  };

  const removeProduct = (index: number) => {
    const newServices = services.filter((_, i) => i !== index);
    setValue('shippedProducts', newServices);
  };

  const table = useBaseTable<ShippedProductCreate>({
    columns,
    data: services,
    tableId: 'service-lines-table',
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
          <IconButton color="error" onClick={() => removeProduct(row.index)}>
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
      <ServiceForm
        onClose={() => table.setCreatingRow(null)}
        addProduct={addProduct}
      />
    ),
    toolbarActions: (
      <Button
        variant="contained"
        size="small"
        onClick={() => {
          table.setCreatingRow(true);
        }}
        startIcon={<AddCircleIcon />}
      >
        Añadir Servicio
      </Button>
    ),
  });

  // const table = useMaterialReactTable<ShippedProductCreate>({
  //   columns,
  //   data: services,
  //   localization: MRT_Localization_ES,
  //   createDisplayMode: 'modal',
  //   editDisplayMode: 'row',
  //   enableEditing: true,
  //   muiTableContainerProps: {
  //     sx: {
  //       minHeight: 'calc(100vh - 315px)',
  //     },
  //   },
  //   renderRowActions: ({ row, table }) => (
  //     <Box>
  //       <Tooltip title="Editar">
  //         <IconButton onClick={() => table.setEditingRow(row)}>
  //           <EditIcon />
  //         </IconButton>
  //       </Tooltip>
  //       <Tooltip title="Eliminar">
  //         <IconButton color="error" onClick={() => removeProduct(row.index)}>
  //           <DeleteIcon />
  //         </IconButton>
  //       </Tooltip>
  //     </Box>
  //   ),
  //   renderTopToolbarCustomActions: ({ table }) => (
  //     <Button
  //       variant="contained"
  //       size="small"
  //       onClick={() => {
  //         table.setCreatingRow(true);
  //       }}
  //       startIcon={<AddCircleIcon />}
  //     >
  //       Añadir Servicio
  //     </Button>
  //   ),
  //   muiCreateRowModalProps: () => ({
  //     open: true,
  //     sx: {
  //       '& .MuiDialog-paper': {
  //         width: '100%',
  //         maxWidth: '600px',
  //         borderRadius: 3,
  //       },
  //     },
  //   }),
  //   renderCreateRowDialogContent: ({ table }) => (
  //     <ServiceForm
  //       onClose={() => table.setCreatingRow(null)}
  //       addProduct={addProduct}
  //     />
  //   ),
  //   renderEditRowDialogContent: undefined,
  //   state: {
  //     density: 'compact',
  //   },
  // });

  return <MaterialReactTable table={table} />;
};

