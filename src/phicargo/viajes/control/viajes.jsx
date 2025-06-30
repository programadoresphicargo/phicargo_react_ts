import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Popover, PopoverContent, PopoverTrigger, User, useDisclosure } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import { Avatar } from "@heroui/react";
import { Box } from '@mui/material';
import { Button } from "@heroui/react"
import { Chip } from "@heroui/react";
import CloseIcon from '@mui/icons-material/Close';
import DetencionesViajesActivos from '../detenciones/detenciones_modal';
import Dialog from '@mui/material/Dialog';
import EstatusDropdown from '../estatus/resumen_estatus';
import IconButton from '@mui/material/IconButton';
import { Image } from 'antd';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import NavbarViajes from '../navbar';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Travel from './viaje';
import Typography from '@mui/material/Typography';
import Viaje from '../viaje';
import { ViajeContext } from '../context/viajeContext';
import ViajesActivosMasivo from '../envio_masivo/viajes_activos';
import { exportToCSV } from '../../utils/export';
import odooApi from '@/api/odoo-api';

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
        Cell: ({ cell }) => {
          const Referencia = cell.getValue();

          return (
            <>
              {Referencia}
              {(
                cell.row.original.ejecutivo === 'OLIVA TORRES JESUS ANGEL ROMAN' ||
                cell.row.original.ejecutivo === 'Abraham Josué Barrientos López '
              ) && (
                  <Chip
                    size="sm"
                    color="warning"
                    className="text-white"
                  >
                    Viaje local
                  </Chip>
                )}
            </>
          );
        },
      },
      {
        accessorKey: 'x_status_viaje',
        header: 'Estado',
        Cell: ({ cell }) => {
          const estatus = cell.getValue();
          let badgeClass = '';

          if (estatus === 'ruta') {
            badgeClass = 'primary';
          } else if (estatus === 'planta') {
            badgeClass = 'success';
          } else if (estatus === 'retorno') {
            badgeClass = 'warning';
          } else if (estatus === 'resguardo') {
            badgeClass = 'secondary';
          }

          return (
            <Chip
              size="sm"
              color={badgeClass}
              className="text-white"
            >
              {estatus.charAt(0).toUpperCase() + estatus.slice(1)}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'modo',
        header: 'Modalidad',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue() || '';
          let badgeClass = 'default';

          if (tipoMovimiento === 'imp') {
            badgeClass = 'warning';
          } else if (tipoMovimiento === 'exp') {
            badgeClass = 'danger';
          } else {
            badgeClass = 'primary';
          }

          return (
            <Chip color={badgeClass} className="text-white" size="sm">
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
            data={cell.row.original}
          />
        ),
      },
      {
        accessorKey: 'vehiculo',
        header: 'Vehiculo',
        id: 'vehiculo',
        Cell: ({ cell }) => {
          const vehiculo = cell.getValue() || '';

          return (
            <Chip color={"primary"} size="sm">
              {vehiculo}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'operador',
        header: 'Operador',
        Cell: ({ cell }) => {
          const value = cell.getValue();

          return (
            <User
              avatarProps={{
                size: "sm",
                src: "https://th.bing.com/th/id/R.b79d045f4b512cd239bcd4bbf4065aac?rik=gdIMsJ5mwf2Ikw&pid=ImgRaw&r=0",
              }}
              name={value}
            />
          );
        },
      },
      {
        accessorKey: 'ruta',
        header: 'Ruta',
      },
      {
        accessorKey: 'inicio_programado',
        header: 'Inicio programado',
      },
      {
        accessorKey: 'llegada_planta_programada',
        header: 'Llegada planta programada',
      },
      {
        accessorKey: 'codigo_postal',
        header: 'Distancia (50km/h)',
        Cell: ({ row }) => {
          const [distancia, setDistancia] = React.useState(null);
          const [error, setError] = React.useState(null);


          React.useEffect(() => {
            const calcularDistancia = async () => {
              const codigoPostal = row.original.codigo_postal;
              const vehicle_id = row.original.vehicle_id;
              const estado = row.original.x_status_viajel;
              const idSucursal = row.original.id_sucursal;

              try {
                const response = await odooApi.get('/tms_travel/codigos_postales/distancia_coordenadas/', {
                  params: {
                    codigo_postal: codigoPostal,
                    vehicle_id: vehicle_id,
                    velocidad_kmh: 50
                  },
                });

                const data = await response.data;

                if (data.error) {
                  setError(data.error);
                  setDistancia(null);
                } else {
                  setError(null);
                  setDistancia(data);
                }
              } catch (error) {
                console.error('Error al calcular la distancia:', error);
                setError('Error al obtener la distancia');
                setDistancia(null);
              }
            };

            calcularDistancia();
          }, [row.original.codigo_postal, row.original.id_sucursal]);

          return (
            <Chip className="text-white" color={error ? 'danger' : 'primary'} size='sm'>
              {error ? error : (distancia ? `A ${distancia.distancia_km} km / ${distancia.tiempo_estimado_horas} h` : 'Calculando...')}
            </Chip>
          );
        }
      },
      {
        accessorKey: 'nombre_cliente',
        header: 'Cliente',
      },
      {
        accessorKey: 'contenedores',
        header: 'Contenedores',
      },
      {
        accessorKey: 'medida',
        header: 'Medidas',
      },
      {
        accessorKey: 'tipo_armado',
        header: 'Armado',
        Cell: ({ cell }) => {
          const value = cell.getValue() || '';
          let badgeClass = 'default';

          if (value === 'single') {
            badgeClass = 'success';
          } else if (value === 'full') {
            badgeClass = 'danger';
          } else {
            badgeClass = 'primary';
          }

          return (
            <Chip color={badgeClass} className="text-white" size="sm">
              {value}
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
      {
        accessorKey: 'ejecutivo',
        header: 'Ejecutivo',
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
        maxHeight: 'calc(100vh - 210px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {
        handleClickOpen();
        ActualizarIDViaje(row.original.id_viaje);
      },
    }),
    muiTableBodyCellProps: ({ row }) => {
      const ultimoEnvio = new Date(row.original.ultimo_envio_ejecutivo);
      const ahora = new Date();
      const diferenciaMs = ahora - ultimoEnvio; // ahora - ultimoEnvio, no al revés
      const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);

      // Si han pasado más de 1 hora, aplicar estilo
      if (diferenciaHoras > 1) {
        return {
          sx: {
            backgroundColor: '#f31260', // rojo
            color: '#FFFFFF',
            fontFamily: 'Inter',
            fontWeight: 'normal',
            fontSize: '12px',
          },
        };
      }

      // Si no, dejar estilo por defecto
      return {};
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
          size='sm'
        >Envio masivo
        </Button>
        <Button
          className='text-white'
          startContent={<i class="bi bi-arrow-clockwise"></i>}
          color='primary'
          isDisabled={false}
          onPress={() => fetchData()}
          size='sm'
        >Actualizar tablero
        </Button>

        <Button color='danger' className='text-white' startContent={<i class="bi bi-sign-stop"></i>} onPress={() => handleOpen()} size='sm'>Unidades detenidas</Button>
        <Button color='success' className='text-white' startContent={<i class="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, "viajes_activos.csv")} size='sm'>Exportar</Button>

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
