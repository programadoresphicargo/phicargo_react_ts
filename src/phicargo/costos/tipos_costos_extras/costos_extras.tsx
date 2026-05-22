import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button } from '@heroui/react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormularioNewCE from './form';
import odooApi from '@/api/odoo-api';
import CustomNavbar from '@/pages/CustomNavbar';
import { pages } from '../folios/pages';
import { TipoCostoExtra } from './type';

const TiposCostosExtras = ({ }) => {

  const [data, setData] = useState<TipoCostoExtra[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [id_tipo_costo, setIDTCE] = useState<number | null>(null);

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
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
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
        maxHeight: 'calc(100vh - 210px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
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
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button color='primary' onPress={handleClickOpen} radius='full'>
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
      <CustomNavbar pages={pages}></CustomNavbar>
      <MaterialReactTable table={table} />

      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        fullWidth
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
