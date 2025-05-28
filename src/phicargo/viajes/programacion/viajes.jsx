import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import { Box } from '@mui/material';
import { Button } from '@heroui/react';
import { Chip } from "@heroui/react";
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import MonthSelector from '@/mes';
import NavbarViajes from '../navbar';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Viaje from '../viaje';
import { ViajeContext } from '../context/viajeContext';
import YearSelector from '@/año';
import { exportToCSV } from '../../utils/export';
import odooApi from '@/api/odoo-api';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ViajesProgramados = ({ }) => {

  const [open, setOpen] = React.useState(false);
  const { id_viaje, viaje, getViaje, loading, error, ActualizarIDViaje } = useContext(ViajeContext);
  const mesActual = String(new Date().getMonth() + 1).padStart(2, '0');
  const [mes, setMes] = useState(mesActual);
  const añoActual = String(new Date().getFullYear());
  const [año, setAño] = useState(añoActual);

  const handleChangeAño = (e) => {
    setAño(e.target.value);
  };

  const handleChange = (event) => {
    setMes(event.target.value);
  };

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
      const response = await odooApi.get('/tms_travel/scheduled_travels/' + mes + '/' + año);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mes, año]);

  const { cantidadRojo, cantidadAmarillo } = useMemo(() => {
    let rojo = 0;
    let amarillo = 0;
    const ahora = new Date();

    data.forEach((item) => {
      const inicio = new Date(item.inicio_programado);
      const diffMs = inicio - ahora;
      const diffHoras = diffMs / (1000 * 60 * 60);

      if (diffMs < 0) {
        rojo++;
      } else if (diffHoras <= 1) {
        amarillo++;
      }
    });

    return { cantidadRojo: rojo, cantidadAmarillo: amarillo };
  }, [data]);

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
        accessorKey: 'carta_porte',
        header: 'Carta porte',
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
        accessorKey: 'custodia',
        header: 'Custodia',
        Cell: ({ cell }) => {
          const value = cell.getValue();

          if (value !== 'yes') return null;

          return (
            <div
              style={{
                backgroundColor: '#4caf50', // verde
                color: 'white',
                padding: '6px 12px',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              Yes
            </div>
          );
        },
      },
      {
        accessorKey: 'estado_correos',
        header: 'Correos ligados',
        Cell: ({ cell }) => {
          const value = cell.getValue();
          let badgeClass = 'badge rounded-pill text-white ';

          if (value === 'Correos ligados') {
            badgeClass += 'bg-primary text-white';
          } else {
            badgeClass += 'bg-secondary text-white';
          }

          return (
            <Chip className={badgeClass} style={{ width: '100px' }}>
              {value}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'inicio_programado',
        header: 'Inicio programado',
      },
      {
        accessorKey: 'contenedores',
        header: 'Contenedores',
      },
      {
        accessorKey: 'ejecutivo',
        header: 'Ejecutivo',
      },
      {
        accessorKey: 'tipo_armado',
        header: 'Armado',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue();
          let badgeClass = '';

          if (tipoMovimiento === 'single') {
            badgeClass = 'success';
          } else if (tipoMovimiento === 'full') {
            badgeClass = 'danger';
          } else {
            badgeClass = 'primary';
          }

          return (
            <Chip color={badgeClass} style={{ width: '60px' }} className={'text-white'}>
              {tipoMovimiento}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'tipo',
        header: 'Modalidad',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue();
          let badgeClass = '';

          if (tipoMovimiento === 'imp') {
            badgeClass = 'warning';
          } else if (tipoMovimiento === 'exp') {
            badgeClass = 'danger';
          } else {
            badgeClass = 'primary';
          }

          return (
            <Chip color={badgeClass} style={{ width: '60px' }} className={"text-white"}>
              {tipoMovimiento}
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
    localization: MRT_Localization_ES,
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
    muiTableBodyRowProps: ({ row }) => {
      const inicioProgramado = new Date(row.original.inicio_programado);
      const ahora = new Date();
      const diferenciaMs = inicioProgramado - ahora;
      const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);

      let backgroundColor = 'inherit'; // valor por defecto

      if (diferenciaMs < 0) {
        backgroundColor = '#f31260'; // rojo si ya pasó
      } else if (diferenciaHoras <= 1) {
        backgroundColor = '#f5a524'; // amarillo si falta 1 hora o menos
      }

      return {
        onClick: () => {
          handleClickOpen();
          ActualizarIDViaje(row.original.id_viaje);
        },
        style: {
          color: '#ffcccc',
          cursor: 'pointer',
        },
      };
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 210px)',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTableBodyCellProps: ({ row }) => {
      const inicioProgramado = new Date(row.original.inicio_programado);
      const ahora = new Date();
      const diferenciaMs = inicioProgramado - ahora;
      const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);

      let backgroundColor = '';
      let ColorText = '';

      if (diferenciaMs < 0) {
        backgroundColor = '#f31260';
        ColorText = '#FFFFFF';
      } else if (diferenciaHoras <= 1) {
        backgroundColor = '#f5a524';
        ColorText = '#FFFFFF';
      }

      return {
        sx: {
          backgroundColor: backgroundColor,
          color: ColorText,
          fontFamily: 'Inter',
          fontWeight: 'normal',
          fontSize: '12px',
        },
      }
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Programación de viajes
        </h1>
        <MonthSelector selectedMonth={mes} handleChange={handleChange}></MonthSelector>
        <YearSelector selectedYear={año} handleChange={handleChangeAño}></YearSelector>
        <Chip color="danger" className="text-white" size='lg'>
          Retrasados: {cantidadRojo}
        </Chip>
        <Chip color="warning" className="text-white" size='lg'>
          Proximos a salir: {cantidadAmarillo}
        </Chip>
        <Button color='primary' startContent={<i class="bi bi-arrow-clockwise"></i>} onPress={() => fetchData()}>Actualizar</Button>
        <Button color='success' className='text-white' startContent={<i class="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, "programacion_viajes.csv")}>Exportar</Button>
      </Box >
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

export default ViajesProgramados;
