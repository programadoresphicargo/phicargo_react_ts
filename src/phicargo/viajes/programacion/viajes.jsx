import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Button } from '@heroui/react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Viaje from '../viaje';
import { Box } from '@mui/material';
import { Chip } from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { ViajeContext } from '../context/viajeContext';
import NavbarViajes from '../navbar';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import { exportToCSV } from '../../utils/export';

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
        accessorKey: 'carta_porte',
        header: 'Carta porte',
      },
      {
        accessorKey: 'ejecutivo',
        header: 'Ejecutivo',
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
        accessorKey: 'tipo_armado',
        header: 'Armado',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue();
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
              {tipoMovimiento}
            </span>
          );
        },
      },
      {
        accessorKey: 'tipo',
        header: 'Modalidad',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue();
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
              {tipoMovimiento}
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
    state: { showProgressBars: isLoading },
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
          alignItems: 'center',
        }}
      >
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Programación de viajes
        </h1>
        <select value={mes} onChange={handleChange} className='form-control'>
          <option value="">Seleccione un mes</option>
          <option value="1">Enero</option>
          <option value="2">Febrero</option>
          <option value="3">Marzo</option>
          <option value="4">Abril</option>
          <option value="5">Mayo</option>
          <option value="6">Junio</option>
          <option value="7">Julio</option>
          <option value="8">Agosto</option>
          <option value="9">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>
        <select value={año} onChange={handleChangeAño} className="form-control">
          <option value="">Seleccione un año</option>
          {Array.from({ length: 9 }, (_, i) => (
            <option key={i} value={2021 + i}>
              {2021 + i}
            </option>
          ))}
        </select>
        <Button color='success' className='text-white' startContent={<i class="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, "programacion_viajes.csv")}>Exportar</Button>
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

export default ViajesProgramados;
