import { Card, CardBody } from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import AuthContext from '../modules/auth/context/AuthContext';
import { Box } from '@mui/material';
import { Button } from "@heroui/react";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Chip } from "@heroui/react";
import CloseIcon from '@mui/icons-material/Close';
import DetalleForm from './DetalleEvento';
import Dialog from '@mui/material/Dialog';
import { DialogContent } from '@mui/material';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MonitoreoNavbar from './Navbar';
import PersistentDrawerRight from './Eventos';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import dayjs from 'dayjs';
import odooApi from '../modules/core/api/odoo-api';
import { toast } from 'react-toastify';
import { useAuthContext } from '../modules/auth/hooks';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EventosPendientes = () => {

  const { session } = useAuthContext();
  const [open, setOpen] = React.useState(false);
  const [id_evento, setIDEntrega] = useState(0);
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
      const response = await odooApi.get('/eventos/eventos_no_atendidos/');
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
        accessorKey: 'id_evento',
        header: 'ID Evento',
      },
      {
        accessorKey: 'sucursal',
        header: 'Sucursal',
        Cell: ({ cell }) => {
          const value = cell.getValue();
          let className;

          if (value === 'veracruz') {
            className = 'badge bg-success text-white';
          } else if (value === 'manzanillo') {
            className = 'badge bg-warning text-white';
          } else {
            className = 'badge bg-primary text-white';
          }

          return <Chip className={className}>{value}</Chip>;
        },
      },
      {
        accessorKey: 'titulo',
        header: 'Nombre del evento',
      },
      {
        accessorKey: 'nombre_evento',
        header: 'Tipo evento',
        Cell: ({ cell }) => {
          const value = cell.getValue();
          if (value != 0) {
            let variant = 'primary';
            return (
              <Chip className={`badge bg-${variant} rounded-pill text-white`} style={{ width: '20px' }}>
                {value}
              </Chip>
            );
          }
        },
      },
      {
        accessorKey: 'nombre',
        header: 'Monitorista',
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'fecha_creacion',
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
      expanded: true,
      grouping: ['sucursal'],
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
          setIDEntrega(row.original.id_evento);
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
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length ? '#b3b3b3' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
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
      </Box>
    ),
  });

  return (<>

    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      scroll='body'
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
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Evento E-{id_evento}
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            Cerrar
          </Button>
        </Toolbar>
      </AppBar>
      <DetalleForm id_evento={id_evento} onClose={handleClose}></DetalleForm>

    </Dialog>

    <MonitoreoNavbar></MonitoreoNavbar>
    <Card className='m-5'>
      <CardBody>
        <MaterialReactTable table={table} />
      </CardBody>
    </Card>
  </>
  );

};

export default EventosPendientes;
