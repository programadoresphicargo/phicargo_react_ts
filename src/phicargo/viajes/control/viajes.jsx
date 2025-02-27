import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import { Avatar } from "@heroui/react";
import { Box } from '@mui/material';
import { Button } from "@heroui/react"
import { Chip } from "@heroui/react";
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import { Image } from 'antd';
import NavbarViajes from '../navbar';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Viaje from '../viaje';
import { ViajeContext } from '../context/viajeContext';
import ViajesActivosMasivo from '../envio_masivo/viajes_activos';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import { Popover, PopoverTrigger, PopoverContent, useDisclosure } from "@heroui/react";
import DetencionesViajesActivos from '../detenciones/detenciones_modal';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Travel from './viaje';
import EstatusDropdown from '../estatus/resumen_estatus';
const { VITE_PHIDES_API_URL } = import.meta.env;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ViajesActivos = ({ }) => {

  const [open, setOpen] = React.useState(false);
  const [openMasivo, setMasivoOpen] = React.useState(false);
  const { id_viaje, viaje, getViaje, loading, error, ActualizarIDViaje } = useContext(ViajeContext);
  const [blinkRows, setBlinkRows] = useState({});

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

  const handleClose2 = () => {
    setMasivoOpen(false);
    fetchData();
  };

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/tms_travel/active_travels/');
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
          const estatus_viaje = cell.getValue();
          let badgeClass = '';

          if (estatus_viaje === 'ruta') {
            badgeClass = 'primary';
          } else if (estatus_viaje === 'planta') {
            badgeClass = 'success';
          } else if (estatus_viaje === 'retorno') {
            badgeClass = 'warning';
          } else if (estatus_viaje === 'resguardo') {
            badgeClass = 'secondary';
          }

          return (
            <Chip
              color={badgeClass}
              size="sm"
              className="text-white"
            >
              {estatus_viaje.charAt(0).toUpperCase() + estatus_viaje.slice(1)}
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
        Cell: ({ cell }) => (
          <EstatusDropdown
            id_viaje={cell.row.original.id_viaje}
            ultimo_estatus={cell.getValue() || ''}
          />
        ),
      },
      {
        accessorKey: 'vehiculo',
        header: 'Vehiculo',
        id: 'vehiculo',
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
      {
        accessorKey: 'fecha_llegada_planta',
        header: 'Llegada a planta',
      },
      {
        accessorKey: 'fecha_salida_planta',
        header: 'Salida de planta',
      },
      {
        accessorKey: 'horas_transcurridas',
        header: 'Horas en planta',
      },
      {
        accessorKey: 'estado_estadia',
        header: 'Estado estadias',
        Cell: ({ cell }) => {
          const estado = cell.getValue();
          let color = 'default';

          if (estado === 'Generando estadías') {
            color = 'danger';
          }

          return (
            <Chip color={color} size='sm'>
              {estado}
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
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionGlobalFilter: "right",
    localization: MRT_Localization_ES,
    muiSearchTextFieldProps: {
      placeholder: `Buscar en ${data.length} viajes`,
      sx: { minWidth: '300px' },
      variant: 'outlined',
    },
    columnResizeMode: "onEnd",
    initialState: {
      showGlobalFilter: true,
      columnVisibility: {
        empresa: false,
      },
      hiddenColumns: ["empresa"],
      density: 'compact',
      expanded: true,
      showColumnFilters: true,
      pagination: { pageSize: 80 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 200px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {
        handleClickOpen();
        ActualizarIDViaje(row.original.id_viaje);
      },
    }),
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
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
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Viajes activos
        </h1>
        <Button
          className='text-white'
          startContent={<i class="bi bi-send-plus-fill"></i>}
          color='success'
          isDisabled={false}
          onPress={() => setMasivoOpen(true)}
        >Envio masivo
        </Button>
        <Button
          className='text-white'
          startContent={<i class="bi bi-arrow-clockwise"></i>}
          color='primary'
          isDisabled={false}
          onPress={() => fetchData()}
        >Actualizar tablero
        </Button>

        <Button color='danger' className='text-white' startContent={<i class="bi bi-sign-stop"></i>} onPress={() => handleOpen()}>Unidades detenidas</Button>

      </Box >
    ),
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpen = (size) => {
    onOpen();
  };

  return (
    <>
      <DetencionesViajesActivos isOpen={isOpen} close={onClose}></DetencionesViajesActivos>
      <NavbarViajes></NavbarViajes>
      <MaterialReactTable
        table={table}
      />

      <Travel open={open} handleClose={handleClose}></Travel>

      <Dialog
        open={openMasivo}
        fullScreen={true}
        scroll='paper'
        onClose={handleClose2}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', backgroundColor: 'white' }} elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="black"
              onClick={handleClose2}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1, color: 'black' }} variant="h6" component="div">
            </Typography>
            <Button autoFocus color="primary" onPress={handleClose2}>
              SALIR
            </Button>
          </Toolbar>
        </AppBar>
        <ViajesActivosMasivo></ViajesActivosMasivo>
      </Dialog>
    </>
  );
};

export default ViajesActivos;
