import { Card, CardBody } from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import { Box } from '@mui/material';
import { Button } from "@heroui/react";
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import PersistentDrawerRight from './Eventos';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

type Entrega = {
  id_entrega: number
}

const Entregas = ({ fecha }: { fecha: string }) => {

  const [open, setOpen] = React.useState(false);
  const [id_entrega, setIDEntrega] = useState<number | null>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const [data, setData] = useState<Entrega[]>([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/entregas/fecha_abierto/' + fecha);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const NuevaEntrega = async () => {
    try {
      const response = await odooApi.get('/entregas/abrir_entrega/');
      toast.success(response.data);
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
      toast.error('Error al obtener los datos: ' + error);
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
    state: { showProgressBars: isLoading },
    localization: MRT_Localization_ES,
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
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
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
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button color='primary' onPress={ComprobarEntrega} radius="full">Nueva entrega</Button>
      </Box>
    ),
  });

  return (<>
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
    >
      <AppBar
        elevation={0}
        position="static"
        sx={{
          background: 'linear-gradient(90deg, #0b2149, #002887)',
          padding: '0 16px',
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
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Entrega E-{id_entrega}
          </Typography>
          <Button autoFocus onPress={handleClose}>
            Cerrar
          </Button>
        </Toolbar>
      </AppBar>
      {id_entrega && (
        <PersistentDrawerRight id_entrega={id_entrega} onClose={handleClose}></PersistentDrawerRight>
      )}
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