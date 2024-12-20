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
import { Image } from 'antd';
import { Avatar } from '@nextui-org/react';
const { VITE_PHIDES_API_URL } = import.meta.env;
import { Chip } from '@nextui-org/react';
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
      const response = await fetch(VITE_PHIDES_API_URL + '/viajes/control/getViajes.php');
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
          let badgeClass = 'badge rounded-pill text-white ';

          if (tipoMovimiento === 'ruta') {
            badgeClass += 'bg-primary';
          } else if (tipoMovimiento === 'planta') {
            badgeClass += 'bg-success';
          } else if (tipoMovimiento === 'retorno') {
            badgeClass += 'bg-warning';
          } else if (tipoMovimiento === 'resguardo') {
            badgeClass += 'bg-morado';
          }

          return (
            <Chip className={badgeClass} size='sm'>
              {tipoMovimiento.charAt(0).toUpperCase() + tipoMovimiento.slice(1)}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'tipo',
        header: 'Modalidad',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue() || '';
          let badgeClass = 'badge rounded-pill text-white ';

          if (tipoMovimiento === 'imp') {
            badgeClass += 'bg-warning';
          } else if (tipoMovimiento === 'exp') {
            badgeClass += 'bg-danger';
          } else {
            badgeClass += 'bg-primary';
          }

          return (
            <Chip className={badgeClass} style={{ width: '60px' }} size='sm'>
              {tipoMovimiento.charAt(0).toUpperCase() + tipoMovimiento.slice(1)}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'ultimo_estatus_enviado',
        header: 'Último estatus',
      },
      {
        accessorKey: 'codigo_postal',
        header: 'Distancia con cliente',
        Cell: ({ row }) => {
          const [distancia, setDistancia] = React.useState(null);

          React.useEffect(() => {
            const calcularDistancia = async () => {
              const placas = row.original.placas;
              const estado = row.original.x_status_viajel;
              const codigoPostal = row.original.codigo_postal;
              const idSucursal = row.original.id_sucursal;

              try {
                // Llama al API enviando los datos necesarios
                const response = await fetch(VITE_PHIDES_API_URL + '/viajes/funciones/calcularDistancia.php', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', // Suponiendo que PHP maneja este tipo de contenido
                  },
                  body: new URLSearchParams({
                    placas: placas,
                    estado: estado,
                    codigo_postal: codigoPostal,
                    id_sucursal: idSucursal,
                  }),
                });

                if (!response.ok) {
                  throw new Error(`Error del servidor: ${response.status}`);
                }

                const text = await response.text(); // Procesa la respuesta como texto
                setDistancia(text); // Guarda el texto directamente en el estado
              } catch (error) {
                console.error('Error al calcular la distancia:', error);
                setDistancia('Error');
              }
            };

            calcularDistancia();
          }, [row.original.codigo_postal, row.original.id_sucursal]);

          return (
            <Chip className="text-white" color='success' size='sm' style={{ width: '150px' }}>
              {distancia !== null ? distancia : 'Cargando...'}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'vehiculo',
        header: 'Vehiculo',
      },
      {
        accessorKey: 'operador',
        header: 'Operador',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue();
          let badgeClass = 'text-white bg-primary';

          return (
            <Chip className={badgeClass} size='sm'>
              {tipoMovimiento.charAt(0).toUpperCase() + tipoMovimiento.slice(1)}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'ejecutivo',
        header: 'Ejecutivo',
      },
      {
        accessorKey: 'nombre_cliente',
        header: 'Cliente',
      },
      {
        accessorKey: 'contenedores',
        header: 'Contenedores',
        width: "10%",
      },
      {
        accessorKey: 'tipo_armado',
        header: 'Armado',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue() || '';
          let badgeClass = 'badge rounded-pill text-white ';

          if (tipoMovimiento === 'single') {
            badgeClass += 'bg-success';
          } else if (tipoMovimiento === 'full') {
            badgeClass += 'bg-danger';
          } else {
            badgeClass += 'bg-primary';
          }

          return (
            <Chip className={badgeClass} size='sm'>
              {tipoMovimiento.charAt(0).toUpperCase() + tipoMovimiento.slice(1)}
            </Chip>
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
