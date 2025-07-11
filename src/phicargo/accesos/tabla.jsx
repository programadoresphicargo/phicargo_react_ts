import { Button, Chip } from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import AccesoCompo from './AccesoCompo';
import AccesoForm from './formulario';
import AppBar from '@mui/material/AppBar';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Slide from '@mui/material/Slide';
import { TextField } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { button } from "@heroui/theme";
import dayjs from 'dayjs';
import odooApi from '@/api/odoo-api';
import { width } from '@mui/system';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TablaAccesos = ({ title, tipo }) => {

  const [open, setOpen] = React.useState(false);
  const [id_acceso, setIDAcceso] = useState(0);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const NuevoAcceso = () => {
    setOpen(true);
    setIDAcceso(null);
  };

  const [data, setData] = useState([]);
  const [isLoading2, setLoading] = useState();

  const fetchData = async () => {

    try {
      setLoading(true);
      const response = await odooApi.get('/accesos/get_by_tipo_acceso/' + tipo);
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
        accessorKey: 'id_acceso',
        header: 'ID Acceso',
      },
      {
        accessorKey: 'empresa',
        header: 'Empresa visitante',
        Cell: ({ cell }) => (
          <span style={{ fontWeight: 'bold' }}>{cell.getValue()?.toUpperCase()}</span>
        ),
      },
      {
        accessorKey: 'marca',
        header: 'Marca',
      },
      {
        accessorKey: 'modelo',
        header: 'Modelo',
      },
      {
        accessorKey: 'placas',
        header: 'Placas',
      },
      {
        accessorKey: 'tipo_movimiento',
        header: 'Tipo de movimiento',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue();
          let badgeClass = '';

          if (tipoMovimiento === 'entrada') {
            badgeClass += 'success';
          } else if (tipoMovimiento === 'salida') {
            badgeClass += 'danger';
          } else {
            badgeClass += 'primary';
          }

          return (
            <Chip color={badgeClass} size="sm" className={"text-white"}>
              {tipoMovimiento?.toUpperCase()}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'fecha_entrada',
        header: 'Fecha de entrada',
        Cell: ({ cell }) => {
          const rawDate = cell.getValue();
          return dayjs(rawDate).format('DD/MM/YYYY h:mm A'); // Formato: 20/01/2025 6:00 am
        },
      },
      {
        accessorKey: 'nombre',
        header: 'Solicita',
        Cell: ({ cell }) => {
          const usuario = cell.getValue()?.toUpperCase();

          return (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i class="bi bi-person-fill"></i>
              {usuario}
            </span>
          );
        },
      },
      {
        accessorKey: 'empresa_visitada',
        header: 'Empresa visitada',
        Cell: ({ cell }) => (
          <span style={{ fontWeight: 'bold' }}>{cell.getValue()?.toUpperCase()}</span>
        ),
      },
      {
        accessorKey: 'estado_acceso',
        header: 'Estado del acceso',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue();
          let badgeClass = '';

          if (tipoMovimiento === 'espera') {
            badgeClass = 'warning';
          } else if (tipoMovimiento === 'validado') {
            badgeClass = 'success';
          } else if (tipoMovimiento === 'autorizado') {
            badgeClass = 'primary';
          } else if (tipoMovimiento === 'rechazado') {
            badgeClass = 'danger';
          } else {
            badgeClass = 'secondary';
          }

          const displayText = tipoMovimiento === 'espera' ? 'En espera de validación' : tipoMovimiento;

          return (
            <Chip color={badgeClass} size='sm' className={"text-white"}>
              {displayText}
            </Chip>
          );
        },
      },
    ],
    [],
  );

  const manualGrouping = ['nombre_operador'];

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading2, showLoadingOverlay: isLoading2, showSkeletons: isLoading2 },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    grouping: manualGrouping,
    localization: MRT_Localization_ES,
    initialState: {
      showColumnFilters: true,
      density: 'compact',
      pagination: { pageSize: 80 },
      showGlobalFilter: true,
      columnVisibility: {
        marca: tipo == 'vehicular' ? true : false,
        modelo: tipo == 'vehicular' ? true : false,
        placas: tipo == 'vehicular' ? true : false,
      },
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
          setIDAcceso(row.original.id_acceso);
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
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 260px)',
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
        <h2
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          {title}
        </h2>
        <Button
          color='primary'
          onPress={() =>
            NuevoAcceso()
          }
        >
          <i class="bi bi-plus-lg"></i> Nuevo registro
        </Button>
        <Button
          color='success'
          className="text-white"
          onPress={() =>
            fetchData()
          }
        >
          <i class="bi bi-arrow-clockwise"></i> Recargar
        </Button>
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
      <AppBar elevation={0}
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
            Acceso
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            Cerrar
          </Button>
        </Toolbar>
      </AppBar>
      <AccesoCompo>
        <AccesoForm id_acceso={id_acceso} onClose={handleClose}
        />
      </AccesoCompo>
    </Dialog>

    <MaterialReactTable table={table} />
  </>
  );

};

export default TablaAccesos;
