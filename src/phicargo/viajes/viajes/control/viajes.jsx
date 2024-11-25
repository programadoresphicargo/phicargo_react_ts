import React, { useState, useEffect, useMemo, useContext } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Viaje from '../viaje';
import { Box } from '@mui/material';

import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { ViajeContext } from '../context/viajeContext';
import NavbarViajes from '../navbar';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ViajesActivos = ({ }) => {

  const [open, setOpen] = React.useState(false);
  const { id_viaje, viaje, getViaje, loading, error, ActualizarIDViaje } = useContext(ViajeContext);

  useEffect(() => {
    getViaje(id_viaje);
  }, [id_viaje]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/phicargo/viajes/control/getViajes.php');
      const jsonData = await response.json();
      setData(jsonData);
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
        accessorKey: 'empresa',
        header: 'Empresa',
      },
      {
        accessorKey: 'sucursal',
        header: 'Sucursal',
      },
      {
        accessorKey: 'name',
        header: 'Referencia',
      },
      {
        accessorKey: 'x_status_viaje',
        header: 'Estado',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue();
          let badgeClass = 'badge rounded-pill ';

          if (tipoMovimiento === 'ruta') {
            badgeClass += 'bg-primary';
          } else if (tipoMovimiento === 'planta') {
            badgeClass += 'bg-success';
          } else if (tipoMovimiento === 'retorno') {
            badgeClass += 'bg-warning';
          } else if (tipoMovimiento === 'resguardo') {
            badgeClass += 'bg-success';
          }

          return (
            <span className={badgeClass} style={{ width: '80px' }}>
              {tipoMovimiento.charAt(0).toUpperCase() + tipoMovimiento.slice(1)}
            </span>
          );
        },
      },
      {
        accessorKey: 'ultimo_estatus_enviado',
        header: 'Último estatus',
      },
      {
        accessorKey: 'vehiculo',
        header: 'Vehiculo',
      },
      {
        accessorKey: 'operador',
        header: 'Operador',
      },
      {
        accessorKey: 'ejecutivo',
        header: 'Ejecutivo',
      },
      {
        accessorKey: 'contenedores',
        header: 'Contenedores',
      },
      {
        accessorKey: 'tipo_armado',
        header: 'Armado',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue() || '';
          let badgeClass = 'badge rounded-pill ';

          if (tipoMovimiento === 'single') {
            badgeClass += 'bg-success';
          } else if (tipoMovimiento === 'full') {
            badgeClass += 'bg-danger';
          } else {
            badgeClass += 'bg-primary';
          }

          return (
            <span className={badgeClass} style={{ width: '60px' }}>
              {tipoMovimiento.charAt(0).toUpperCase() + tipoMovimiento.slice(1)}
            </span>
          );
        },
      },
      {
        accessorKey: 'tipo',
        header: 'Modalidad',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue() || '';
          let badgeClass = 'badge rounded-pill ';

          if (tipoMovimiento === 'imp') {
            badgeClass += 'bg-warning';
          } else if (tipoMovimiento === 'exp') {
            badgeClass += 'bg-danger';
          } else {
            badgeClass += 'bg-primary';
          }

          return (
            <span className={badgeClass} style={{ width: '60px' }}>
              {tipoMovimiento.charAt(0).toUpperCase() + tipoMovimiento.slice(1)}
            </span>
          );
        },
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
    state: { isLoading: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      showColumnFilters: true,
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
        handleClickOpen();
        ActualizarIDViaje(row.original.id_viaje);
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
        <h1 className='text-primary'>Gestión de viajes</h1>
      </Box>
    ),
  });

  return (
    <>
      <NavbarViajes></NavbarViajes>
      <MaterialReactTable
        table={table}
      />

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', backgroundColor: 'white' }} elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="black"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1, color: 'black' }} variant="h6" component="div">
            </Typography>
            <Button autoFocus color="primary" onClick={handleClose}>
              SALIR
            </Button>
          </Toolbar>
        </AppBar>
        <Viaje></Viaje>
      </Dialog>
    </>
  );
};

export default ViajesActivos;
