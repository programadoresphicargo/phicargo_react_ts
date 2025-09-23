import { Button, Chip } from "@heroui/react";
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AppBar from '@mui/material/AppBar';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import EnviosMasivosManiobras from '../envio_masivo';
import EstatusDropdownManiobra from '../reportes_estatus/resumen_estatus';
import Formulariomaniobra from '../maniobras/formulario_maniobra';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Slide from '@mui/material/Slide';
import { TextField } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { User } from "@heroui/react";
import dayjs from 'dayjs';
import { exportToCSV } from '../../utils/export';
import odooApi from '@/api/odoo-api';
import { width } from '@mui/system';
import { DateRangePicker } from 'rsuite';

const getMonthStartAndEnd = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1); // 1er día
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Último día
  return [start, end];
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Maniobras = ({ estado_maniobra }) => {

  const [data, setData] = useState([]);
  const [isLoading2, setLoading] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [id_maniobra, setIdmaniobra] = useState('');
  const [id_cp, setIdcp] = useState('');
  const [idCliente, setClienteID] = useState('');
  const [range, setRange] = useState(getMonthStartAndEnd());

  const handleShowModal = (id_maniobra, id_cp) => {
    setModalShow(true);
    setIdmaniobra(id_maniobra);
    setIdcp(id_cp);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    fetchData();
  };


  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/maniobras/estado/', {
        params: { estado: estado_maniobra, fecha_inicio: range[0].toISOString().split('T')[0], fecha_fin: range[1].toISOString().split('T')[0] }
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_maniobra',
        header: 'ID Maniobra',
        size: 50,
      },
      {
        accessorKey: 'sucursal',
        header: 'Sucursal',
      },
      {
        accessorKey: 'inicio_programado',
        header: 'Inicio programado',
        size: 150,
        Cell: ({ cell }) => {
          const rawDate = cell.getValue();
          const date = new Date(rawDate);

          if (isNaN(date.getTime())) {
            return "Fecha no válida";
          }

          const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          };

          const formattedDate = date.toLocaleString('es-ES', options);
          return formattedDate;
        },
      },
      {
        accessorKey: 'terminal',
        header: 'Terminal',
      },
      {
        accessorKey: 'unidad',
        header: 'Unidad',
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return (
            <Chip color='primary' size="sm">
              {value}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'nombre_operador',
        header: 'Operador',
        size: 150,
      },
      {
        accessorKey: 'tipo_empleado',
        header: 'Tipo',
        Cell: ({ cell }) => {
          const value = cell.getValue();

          let color = 'success'; // valor por defecto
          if (value === 'MOVEDOR') {
            color = 'success';
          } else if (value === 'OPERADOR') {
            color = 'primary';
          } else if (value === 'OPERADOR POSTURERO') {
            color = 'danger';
          }

          return (
            <Chip color={color} size="sm" className="text-white capitalize">
              {value}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'tipo_maniobra',
        header: 'Tipo de maniobra',
        Cell: ({ cell }) => {
          const value = cell.getValue();

          let variant = 'secondary';
          if (value === 'retiro') {
            variant = 'success';
          } else if (value === 'ingreso') {
            variant = 'primary';
          } else if (value === 'local') {
            variant = 'danger';
          }

          return (
            <Chip color={variant} className="text-white" size="sm">
              {value}
            </Chip>
          );
        },

      },
      {
        accessorKey: 'modo',
        header: 'Modo',
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
        accessorKey: 'contenedores_ids',
        header: 'Contenedor',
      },
      {
        accessorKey: 'medidas',
        header: 'Medidas',
      },
      {
        accessorKey: 'ultimo_estatus',
        header: 'Último estatus enviado',
        size: 300,
        Cell: ({ cell }) => (
          <EstatusDropdownManiobra
            id_maniobra={cell.row.original.id_maniobra}
            ultimo_estatus={cell.getValue() || ''}
            usuario_ultimo_estatus={cell.row.original.usuario_ultimo_estatus}
            fecha_ultimo_estatus={cell.row.original.fecha_ultimo_estatus}
          />
        ),
      },
      {
        accessorKey: 'fecha_activacion',
        header: 'Fecha de inicio',
        size: 150,
      },
      {
        accessorKey: 'fecha_finalizada',
        header: 'Fecha finalizada',
        size: 150,
      },
      {
        accessorKey: 'x_ejecutivo_viaje_bel',
        header: 'Ejecutivo',
        size: 150,
      },
      {
        accessorKey: 'cartas_porte',
        header: 'Cartas porte',
        size: 150,
      },
      {
        accessorKey: 'nombre_cliente',
        header: 'Cliente',
        size: 150,
      },
      {
        accessorKey: 'usuario_creacion',
        header: 'Usuario registro',
        size: 150,
        Cell: ({ cell }) => {
          const nombre = cell.getValue();
          const fecha_registro = cell.row.original.fecha_registro;

          return (
            <User
              avatarProps={{
                size: 'sm',
                color: 'primary',
                isBordered: true,
              }}
              description={fecha_registro}
              name={nombre}
            />
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
    localization: MRT_Localization_ES,
    state: { showProgressBars: isLoading2 },
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
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 250px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {
        if (row.subRows?.length) {
        } else {
          handleShowModal(row.original.id_maniobra, row.original.id);
          setClienteID(row.original.id_cliente);
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
        fontSize: '12px',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
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
        <h1 className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text">Control de maniobras</h1>
        <DateRangePicker
          value={range}
          onChange={setRange}
          format="yyyy-MM-dd"
          placeholder="Selecciona un rango de fechas"
        />
        <Button color="primary" isLoading={isLoading2} onPress={() => fetchData()} startContent={<i class="bi bi-arrow-clockwise"></i>} size="sm" radius="full">Refrescar</Button>
        <Button color="secondary" onPress={() => handleClickOpen()} className='text-white' startContent={<i class="bi bi-send-plus"></i>} size="sm" radius="full">Envio masivo</Button>
        <Button color='success' className='text-white' startContent={<i class="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, `maniobras ${estado_maniobra}.csv`)} size="sm" radius="full">Exportar</Button>
      </Box >
    ),
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Formulariomaniobra
        show={modalShow}
        handleClose={handleCloseModal}
        id_maniobra={id_maniobra}
        id_cp={id_cp}
        id_cliente={idCliente}
        form_deshabilitado={true}
      />

      <MaterialReactTable table={table} />

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar
          elevation={0}
          sx={{
            background: 'linear-gradient(90deg, #0b2149, #002887)',
            padding: '0 16px',
            position: 'static'
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
              Envio masivo de estatus
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <EnviosMasivosManiobras></EnviosMasivosManiobras>
      </Dialog>
    </div >
  );

};

export default Maniobras;
