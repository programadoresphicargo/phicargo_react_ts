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
import { Card, CardBody, CardHeader } from "@heroui/react";
import CardActions from '@mui/material/CardActions';
import PersistentDrawerRight from './Eventos';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Box } from '@mui/material';
import { Button } from "@heroui/react";
import { Chip } from "@heroui/react";

import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import AuthContext from '../modules/auth/context/AuthContext';
import { useAuthContext } from '../modules/auth/hooks';
import odooApi from '../modules/core/api/odoo-api';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Entregas = ({ fecha }) => {

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
      const response = await odooApi.get('/entregas/get_by_entrega_fecha_abierto/'+fecha);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const NuevaEntrega = async () => {
    try {
      const response = await odooApi.get('/entregas/abrir_entrega/');
      toast.success(response);
      handleClose();
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const ComprobarEntrega = async () => {
    try {

      const response = await odooApi.get('/entregas/comprobar_entrega/');
      const data = response.data;

      if (Array.isArray(data)) {
        if (data.length > 0) {
          console.log('El arreglo contiene al menos un registro.');
          toast.error(
            'Tienes una entrega de turno abierta: ' + ' Entrega: ' + data[0].id_entrega + ' Fecha: ' + data[0].abierto
          );
        } else {
          console.log('El arreglo está vacío.');
          NuevaEntrega();
        }
      }

    } catch (error) {
      toast.error('Error al obtener los datos: '  + error);
    }
  };


  useEffect(() => {
    fetchData();
  }, [fecha]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_entrega',
        header: 'ID Entrega',
      },
      {
        accessorKey: 'abierto',
        header: 'Fecha',
      },
      {
        accessorKey: 'nombre_usuario',
        header: 'Monitorista',
      },
      {
        accessorKey: 'total_eventos',
        header: 'Eventos',
        Cell: ({ cell }) => {
          const value = cell.getValue();
          if (value != 0) {
            let variant = 'danger';
            return (
              <Chip className={`badge bg-${variant} rounded-pill text-white`} style={{ width: '20px' }}>
                {value}
              </Chip>
            );
          }

        },
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
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
        <Button color='primary' onClick={ComprobarEntrega}>Nueva entrega</Button>
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

    <Card>
      <CardBody>
        <MaterialReactTable table={table} />
      </CardBody>
    </Card>
  </>
  );

};

export default Entregas;