import { Button, Chip } from "@heroui/react"
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import BonosMes from './BonosMes';
import BonosModal from './AbrirModal';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from 'antd';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import NavbarBonos from './navbar';
import NavbarViajes from '../viajes/navbar';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import odooApi from '@/api/odoo-api';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BonosOperadores = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState('0');
  const [year, setYear] = React.useState('0');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [isLoading, setLoading] = useState(false);

  const [dates, setDates] = useState([]);

  const handleDateChange = (dates) => {
    setDates(dates);
  };

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/bonos_operadores/by_month/');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [dates]);

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const obtenerNombreMes = (numeroMes) => {
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return meses[numeroMes - 1] || "Mes inválido";
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'mes', header: 'Mes',
        Cell: ({ cell }) => obtenerNombreMes(cell.getValue())
      },
      { accessorKey: 'anio', header: 'Año' },
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
    initialState: {
      density: 'compact',
      pagination: { pageSize: 80 },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {
        setMonth(row.original.mes);
        setYear(row.original.anio);
        handleClickOpen();
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
        maxHeight: 'calc(100vh - 190px)',
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
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
        <Button onPress={() => setModalOpen(true)} color='primary'>Nuevo periodo</Button>
      </Box>
    ),
  });

  return (
    <div>
      <NavbarBonos></NavbarBonos>
      <MaterialReactTable table={table} />
      <BonosModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar
          elevation={0}
          sx={{
            position: 'relative',
            background: 'linear-gradient(90deg, #0b2149, #002887)',
            padding: '0 16px'
          }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} component="div">
              Registro de bonos {obtenerNombreMes(month)} {year}
            </Typography>
            <Button autoFocus color="inherit" onPress={handleClose}>
              Cerrar
            </Button>
          </Toolbar>
        </AppBar>
        <BonosMes month={month} year={year}></BonosMes>
      </Dialog>
    </div>
  );
}

export default BonosOperadores; 
