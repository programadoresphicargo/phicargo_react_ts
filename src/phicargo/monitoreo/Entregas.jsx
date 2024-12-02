import { forwardRef, useEffect, useMemo, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import { DialogContent } from '@mui/material';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import PersistentDrawerRight from './Eventos';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const { VITE_PHIDES_API_URL } = import.meta.env;

const Transition = forwardRef(function Transition(props, ref) {
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
      const response = await fetch(VITE_PHIDES_API_URL + '/monitoreo/entrega_turno/getEntregas.php?fecha=' + fecha);
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };


  const NuevaEntrega = async () => {
    try {
      const response = await fetch(VITE_PHIDES_API_URL + '/monitoreo/entrega_turno/abrirEntrega.php');
      toast.success(response);
      handleClose();
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const ComprobarEntrega = async () => {
    try {
      const response = await axios.get(VITE_PHIDES_API_URL + '/monitoreo/entrega_turno/comprobarEntrega.php');
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
              <span className={`badge bg-${variant} rounded-pill`} style={{ width: '20px' }}>
                {value}
              </span>
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
        <button className="btn btn-primary" onClick={ComprobarEntrega}>Abrir nueva entrega</button>
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
      <CardContent>
        <MaterialReactTable table={table} />
      </CardContent>
    </Card>
  </>
  );

};

export default Entregas;
