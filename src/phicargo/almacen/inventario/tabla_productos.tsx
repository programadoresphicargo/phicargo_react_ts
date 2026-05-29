import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button } from "@heroui/react"
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IndexProducto from './form';
import FormProducto from './form_producto';
import { useAuthContext } from '@/modules/auth/hooks';
import { Historial } from './historial';

type UnidadType = {
  id_unidad: number;
  x_name: string;
  fecha_creacion: string;
  nombre: string;
  estado: string;
  oc_ref: string;
};

export type Producto = {
  id: number | null;
  x_name: string;
  x_tipo: string;
  historial?: Historial[];
  unidades?: UnidadType[];
}

const TablaProductos = ({ }) => {

  const { session } = useAuthContext();

  const [id_producto, setID] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState(false);
  const [dataEquipos, setDataEquipo] = useState<Producto[]>([]);
  const [isLoading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/tms_travel/inventario_equipo/');
      setDataEquipo(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'x_name',
        header: 'Nombre',
      },
      {
        accessorKey: 'create_date',
        header: 'Fecha creación',
      },
      {
        accessorKey: 'x_tipo',
        header: 'Tipo',
      },
      {
        accessorKey: 'disponible',
        header: 'Disponible',
      },
      {
        accessorKey: 'reservado',
        header: 'Reservado',
      },
      {
        accessorKey: 'total_unidades',
        header: 'Total',
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: dataEquipos,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionGlobalFilter: "right",
    localization: MRT_Localization_ES,
    muiSearchTextFieldProps: {
      placeholder: `Buscar`,
      sx: { minWidth: '300px' },
      variant: 'outlined',
    },
    columnResizeMode: "onEnd",
    initialState: {
      showGlobalFilter: true,
      density: 'compact',
      expanded: true,
      showColumnFilters: true,
      pagination: { pageIndex: 0, pageSize: 80 },
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
        maxHeight: 'calc(100vh - 260px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        handleClickOpen();
        setID(row.original.id);
      },
    }),
    muiTableBodyCellProps: () => ({
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
      },
    }),
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Productos
        </h1>

        {session?.user.permissions.includes(218) && (
          <Button
            className='text-white'
            startContent={<i className="bi bi-plus-lg"></i>}
            color='primary'
            radius='full'
            isDisabled={false}
            onPress={async () => {
              setID(null);
              handleClickOpenF();
            }}
          >Nuevo producto
          </Button>
        )}

        <Button
          className='text-white'
          startContent={<i className="bi bi-arrow-clockwise"></i>}
          color='success'
          radius='full'
          isDisabled={false}
          onPress={() => fetchData()}
        >Actualizar
        </Button>

      </Box >
    ),
  });

  const [openF, setOpenF] = React.useState(false);

  const handleClickOpenF = () => {
    setOpenF(true);
  };

  const handleCloseF = () => {
    fetchData();
    setOpenF(false);
  };


  return (
    <>
      <MaterialReactTable
        table={table}
      />

      <IndexProducto id_producto={id_producto} open={open} handleClose={handleClose} ></IndexProducto>

      <Dialog
        open={openF}
        onClose={handleCloseF}
        fullWidth
      >
        <DialogTitle id="responsive-dialog-title">
          {"Nuevo producto"}
        </DialogTitle>
        <DialogContent>
          <FormProducto id_producto={id_producto} onClose={handleCloseF}></FormProducto>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onPress={handleCloseF}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TablaProductos;
