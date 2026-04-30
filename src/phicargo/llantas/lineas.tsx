import {
  MRT_Cell,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useMemo} from 'react';
import { Box } from '@mui/material';
import { Button } from "@heroui/react"
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import toast from 'react-hot-toast';
import { useSolicitudesLlantas } from './contexto';
import LlantasDisponibles from './llantas_disponibles';

type Linea = {
  id_line: number;
  x_tire_id: number;
  descuento?: number;
  condicion?: string;
};

type SolicitudLlantaLineProps = {
  meta: any;
  lineas: Linea[];
  setLineas: (lineas: any[]) => void;
};

const LlantasAsignadas: React.FC<SolicitudLlantaLineProps> = ({
  meta,
  lineas,
  setLineas
}) => {

  const { modoEdicion } = useSolicitudesLlantas();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Llanta',
        enableEditing: false,
      },
      {
        accessorKey: 'marca',
        header: 'Marca',
        enableEditing: false,
      },
      {
        accessorKey: 'modelo',
        header: 'Modelo',
        enableEditing: false,
      },
      {
        accessorKey: 'condicion',
        header: 'Condicion',
        enableEditing: true,
        editVariant: 'select' as const,
        editSelectOptions: ['buena', 'dañada', 'ponchada', 'perdida'],
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'descuento',
        header: 'Descuento',
        enableEditing: true,
        muiEditTextFieldProps: ({ row }: { row: MRT_Row<Linea> }) => {
          const condicionActual =
            row._valuesCache?.condicion ?? row.original.condicion;

          return {
            type: 'number',
            placeholder: 'Monto del descuento',
            sx: {
              display: condicionActual === 'perdida' ? 'block' : 'none',
            },
          };
        },
        Cell: ({ cell }: { cell: MRT_Cell<Linea> }) => {
          if (!cell.row.original.descuento) return null;
          return `$${cell.row.original.descuento}`;
        },
      },
      {
        accessorKey: 'observaciones',
        header: 'Observaciones',
        enableEditing: true,
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'fecha_devolucion',
        header: 'Fecha devolución',
        enableEditing: true,
        muiEditTextFieldProps: {
          type: 'date',
          required: true,
        },
      },
      {
        accessorKey: 'delete',
        header: 'Eliminar',
        enableEditing: false,
        muiEditTextFieldProps: ({ row }: { row: MRT_Row<Linea> }) => {
          return <Button radius='full' color='danger' size='sm' onPress={() => deleteLine(row.original.id_line)} isDisabled={!modoEdicion || meta?.x_studio_status != "borrador"}>
            Eliminar
          </Button>
        },
      }
    ],
    [modoEdicion],
  );

  const deleteLine = (id_line: number) => {
    setLineas(prev => prev.filter(r => r.id_line !== id_line));
  };

  const table = useMaterialReactTable({
    columns,
    data: lineas,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableEditing: meta?.x_studio_status === "entregado" || meta?.x_studio_status === "recepcionado_operador",
    editDisplayMode: "modal",
    positionActionsColumn: 'last',
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionGlobalFilter: "right",
    localization: MRT_Localization_ES,
    muiSearchTextFieldProps: {
      placeholder: `Buscador`,
      sx: { minWidth: '300px' },
      variant: 'outlined',
    },
    columnResizeMode: "onEnd",
    initialState: {
      showGlobalFilter: true,
      density: 'compact',
      expanded: true,
      showColumnFilters: true,
      columnVisibility: {
        condicion: meta?.x_studio_status != 'borrador' ? true : false,
        fecha_devolucion: meta?.x_studio_status != 'borrador' ? true : false,
        observaciones: meta?.x_studio_status != 'borrador' ? true : false,
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 300px)',
      },
    },
    onEditingRowSave: ({ values, row, table }) => {

      if (!values.condicion || !values.observaciones || !values.fecha_devolucion) {
        toast.error("Todos los campos son obligatorios");
        return;
      }

      if (values.condicion !== "perdida") {
        values.descuento = null;
      }

      if (values.condicion === "perdida" && (values.descuento === null || values.descuento === undefined)) {
        toast.error("Debes ingresar el descuento");
        return;
      }

      setLineas(prev =>
        prev.map(r =>
          r.id_line === row.original.id_line
            ? { ...r, ...values }
            : r
        )
      );

      table.setEditingRow(null);
    },
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <h2
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Llantas asignadas
        </h2>

        <Button
          radius='full'
          className='text-white'
          startContent={<i className="bi bi-plus-lg"></i>}
          color='secondary'
          onPress={() => handleClickOpen()}
          isDisabled={!modoEdicion}
        >
          Añadir llantas
        </Button>
      </Box >
    ),
    muiTableBodyCellProps: () => ({
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
      },
    }),
  });

  return (
    <>
      <MaterialReactTable
        table={table}
      />

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        scroll="body"
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '28px',        // Opcional, para bordes redondeados
          }
        }}>
        <DialogContent>
          <LlantasDisponibles onClose={handleClose}></LlantasDisponibles>
        </DialogContent>
        <DialogActions>
          <Button onPress={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LlantasAsignadas;
