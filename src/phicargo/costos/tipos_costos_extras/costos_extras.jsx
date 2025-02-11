import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Box } from '@mui/material';
import { Button } from '@nextui-org/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import { toast } from 'react-toastify';
import CENavBar from '../Navbar';
import FormularioNewCE from './formulario';

const TiposCostosExtras = ({ }) => {

  const [data, setData] = useState([]);
  const [isLoading2, setLoading] = useState();
  const [id_tipo_costo, setIDTCE] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/tipos_costos_extras/');
      setData(response.data);
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
        accessorKey: 'id_tipo_costo',
        header: 'Clave',
      },
      {
        accessorKey: 'descripcion',
        header: 'Descripción',
      },
      {
        accessorKey: 'costo',
        header: 'Costo',
      },
      {
        accessorKey: 'unidad_medida',
        header: 'Unidad medida',
      },
      {
        accessorKey: 'observaciones',
        header: 'Observaciones',
      },
      {
        accessorKey: 'usuario_creacion',
        header: 'Usuario creación',
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'Fecha creación',
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { isLoading: isLoading2 },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      pagination: { pageSize: 80 },
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
    muiTableBodyCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
      },
    },
    muiTableContainerProps: {
      sx: {
        borderRadius: '8px',
        overflow: 'hidden',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 210px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {
        if (row.subRows?.length) {
        } else {
          handleClickOpen();
          setIDTCE(row.original.id_tipo_costo);
        }
      },
      style: {
        cursor: 'pointer',
      },
    }),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button color='primary' onPress={handleClickOpen}>
          Nuevo
        </Button>
      </Box>
    )
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setIDTCE(null);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  return (
    <>
      <CENavBar></CENavBar>
      <MaterialReactTable table={table} />

      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth="sm"
        maxWidth="sm"
      >
        <DialogContent>
          <FormularioNewCE onClose={handleClose} id_tipo_costo={id_tipo_costo}></FormularioNewCE>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TiposCostosExtras;
