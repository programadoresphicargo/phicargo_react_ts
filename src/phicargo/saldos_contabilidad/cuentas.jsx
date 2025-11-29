import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Chip, DatePicker } from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import CuentaForm from './cuentaForm';
import OperadorForm from './saldoForm';
import Slide from '@mui/material/Slide';
import odooApi from '@/api/odoo-api';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions
} from "@mui/material";
import { MRT_Localization_ES } from 'material-react-table/locales/es';

const Cuentas = ({ estado }) => {

  const fechaActual = new Date().toISOString().split('T')[0];
  const [value, setValue] = React.useState(parseDate(fechaActual));

  const [open, setOpen] = React.useState(false);
  const [id_cuenta, setCuenta] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
    setCuenta(null);
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
      const response = await odooApi.get('/cuentas/');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [value]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_cuenta',
        header: 'Cuenta',
      },
      {
        accessorKey: 'empresa',
        header: 'Empresa',
      },
      {
        accessorKey: 'banco',
        header: 'Banco',
        Cell: ({ cell }) => {
          const referencia = cell.getValue() || '';
          return (
            <Chip color='primary' className='text-white'>
              {referencia}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'referencia',
        header: 'Referencia',
      },
      {
        accessorKey: 'tipo',
        header: 'Tipo',
        Cell: ({ cell }) => {
          const referencia = cell.getValue() || '';
          return (
            <Chip color='success' className='text-white'>
              {referencia}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'moneda',
        header: 'Moneda',
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'Fecha creacion',
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
    localization: MRT_Localization_ES,
    state: { showProgressBars: isLoading2 },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 100 },
      showColumnFilters: true,
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
          setCuenta(row.original.id_cuenta);
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
        fontSize: '14px',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 200px)',
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
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">

            <h1 className='text-primary'>Cuentas registradas</h1>
            <Button color='primary' onPress={handleClickOpen} radius="full">Nueva cuenta</Button>
          </div>
        </div>

      </Box>
    ),
  });

  return (<>

    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <AppBar sx={{
        background: 'linear-gradient(90deg, #0b2149, #002887)',
        position: 'relative',
        padding: '0 16px'
      }} elevation={0}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Cuenta
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            Cerrar
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent dividers>
        <CuentaForm id_cuenta={id_cuenta} onClose={handleClose}></CuentaForm>
      </DialogContent>

      <DialogActions>
        <Button onPress={handleClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>

    <MaterialReactTable table={table} />
  </>
  );

};

export default Cuentas;
