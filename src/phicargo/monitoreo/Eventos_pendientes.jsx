import React, { useState, useEffect, useMemo } from 'react';
import { DialogContent } from '@mui/material';
import dayjs from 'dayjs';
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
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import PersistentDrawerRight from './Eventos';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Box } from '@mui/material';
import { Button } from '@nextui-org/react';
import { Chip } from '@nextui-org/react';
import odooApi from '../modules/core/api/odoo-api';
const { VITE_PHIDES_API_URL } = import.meta.env;

import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import AuthContext from '../modules/auth/context/AuthContext';
import { useAuthContext } from '../modules/auth/hooks';
import MonitoreoNavbar from './Navbar';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EventosPendientes = () => {

  const { session } = useAuthContext();
  const [open, setOpen] = React.useState(false);
  const [id_entrega, setIDEntrega] = useState(0);
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

  const NuevaEntrega = async () => {
    try {
      const response = await fetch(VITE_PHIDES_API_URL + '/monitoreo/entrega_turno/abrirEntrega.php', {
        method: 'POST',
        body: new URLSearchParams({
          'id_usuario': session.user.id
        })
      });
      toast.success(response);
      handleClose();
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const ComprobarEntrega = async () => {
    try {
      const params = new URLSearchParams();
      params.append('id_usuario', session.user.id);

      const response = await axios.post(VITE_PHIDES_API_URL + '/monitoreo/entrega_turno/comprobarEntrega.php', params);

      const data = response.data;

      if (data.status === 1) {
        NuevaEntrega();
      } else if (data.status === 0) {
        toast.error(
          data.message
          + ' Entrega: ' + data.id_entrega
          + ' Fecha: ' + data.fecha_inicio
        );
      }
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
        accessorKey: 'titulo',
        header: 'Nombre',
      },
      {
        accessorFn: (row) => row.usuario?.nombre,
        header: 'Monitorista',
      },
      {
        accessorKey: 'tipo_evento',
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
          setIDEntrega(row.original.id_entrega);
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
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Entrega E-{id_entrega}
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            Cerrar
          </Button>
        </Toolbar>
      </AppBar>
      <PersistentDrawerRight id_entrega={id_entrega} onClose={handleClose}></PersistentDrawerRight>

    </Dialog>

    <MonitoreoNavbar></MonitoreoNavbar>
    <MaterialReactTable table={table} />
  </>
  );

};

export default EventosPendientes;
