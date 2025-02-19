import React, { useState, useEffect, useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import Box from '@mui/material/Box';
import { Button, Chip } from '@nextui-org/react'
import { DatePicker } from 'antd';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import NavbarViajes from '../viajes/navbar';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import BonosMes from './BonosMes';
import BonosModal from './AbrirModal';

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

  const handleClose = () => {
    setOpen(false);
    fetchData();
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
      <MaterialReactTable table={table} />
      <BonosModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }} elevation={0}>
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
            <Button autoFocus color="inherit" onClick={handleClose}>
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
