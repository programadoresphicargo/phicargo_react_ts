import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';

import { Box } from '@mui/material';
import { Button, Checkbox, Chip } from "@heroui/react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormularioCorreoGeneral from './correoForm';
import Slide from '@mui/material/Slide';
import odooApi from '@/api/odoo-api';
import CustomNavbar from '@/pages/CustomNavbar';

const CorreosElectronicos = ({ estado }) => {

  const [open, setOpen] = React.useState(false);
  const [correo, setCorreo] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const [data, setData] = useState([]);
  const [isLoading2, setLoading] = useState();

  const fetchData = async () => {

    try {
      setLoading(true);
      const response = await odooApi.get('/correos/');
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
        accessorKey: 'id_correo',
        header: 'ID Correo',
      },
      {
        accessorKey: 'cliente_name',
        header: 'Cliente',
      },
      {
        accessorKey: 'correo',
        header: 'Correo Electronico',
      },
      {
        accessorKey: 'tipo',
        header: 'Tipo',
      },
      {
        accessorKey: 'activo',
        header: 'Activo',
        Cell: ({ row }) => (
          <Checkbox isSelected={row.original.activo ? true : false}></Checkbox>
        ),
      },
      {
        accessorKey: 'nombre',
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
    state: { showProgressBars: isLoading2 },
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
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {

        if (row.subRows?.length) {
        } else {
          handleClickOpen();
          setCorreo(row.original);
        }
      },
      style: {
        cursor: 'pointer',
      },
    }),
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
        fontSize: '12px',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 210px)',
      },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        Correos electronicos
        <Button
          color='primary'
          onPress={() => fetchData()}
        >Recargar</Button>
      </Box>
    ),
  });

  return (<>
    <CustomNavbar></CustomNavbar>
    <MaterialReactTable table={table} />

    <Dialog
      fullWidth={true}
      maxWidth={"sm"}
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <FormularioCorreoGeneral idCliente={null} handleClose={handleClose} data={correo}>
        </FormularioCorreoGeneral>
      </DialogContent>
    </Dialog>
  </>
  );

};

export default CorreosElectronicos;
