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
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Viaje from '../viaje';
import { ViajeContext } from '../context/viajeContext';
import { exportToCSV } from '../../utils/export';
import odooApi from '@/api/odoo-api';
import { DateRangePicker } from 'rsuite';
import { DatePicker } from 'rsuite';
import NavbarTravel from '../navbar_viajes';
import { Select, SelectItem } from "@heroui/react";
import FormularioAsignacionEquipo from './formulario';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ViajesProgramados = ({ }) => {
  const [date, setDate] = useState(null);
  const [value, setValue] = React.useState(new Set(["1"]));
  const [open, setOpen] = React.useState(false);

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
    const storeId = Array.from(value)[0];
    try {
      setLoading(true);
      const fecha = date.toISOString().slice(0, 10);
      const response = await odooApi.get('/tms_waybill/plan_viaje/', {
        params: {
          date_order: fecha,
          store_id: storeId
        }
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date, value]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'carta_porte',
        header: 'Carta porte',
      },
      {
        accessorKey: 'vehiculo_programado',
        header: 'Vehiculo',
      },
      {
        accessorKey: 'operador_programado',
        header: 'Operador',
      },
      {
        accessorKey: 'x_reference',
        header: 'Contenedor',
      },
      {
        accessorKey: 'x_tipo_bel',
        header: 'Modo',
        Cell: ({ cell }) => {
          const tipo = cell.getValue();
          let color = 'default';

          if (tipo === 'single') {
            color = 'warning';
          } else if (tipo === 'full') {
            color = 'danger';
          }

          return (
            <Chip color={color} size="sm" className={"text-white"}>
              {tipo}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'x_medida_bel',
        header: 'Medida',
      },
      {
        accessorKey: 'x_modo_bel',
        header: 'Modo',
        Cell: ({ cell }) => {
          const tipo = cell.getValue();
          let color = 'default';

          if (tipo === 'exp') {
            color = 'success';
          } else if (tipo === 'imp') {
            color = 'primary';
          }

          return (
            <Chip color={color} size="sm" className={"text-white"}>
              {tipo}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'x_ruta_bel',
        header: 'Ruta',
      },
      {
        accessorKey: 'x_clase_bel',
        header: 'Clase',
      },
      {
        accessorKey: 'trailer1',
        header: 'Remolque 1',
      },
      {
        accessorKey: 'trailer2',
        header: 'Remolque 2',
      },
      {
        accessorKey: 'dolly',
        header: 'Dolly',
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
    enableColumnPinning: true,
    layoutMode: 'grid-no-grow',
    state: { showProgressBars: isLoading },
    enableStickyHeader: true,
    localization: MRT_Localization_ES,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      showColumnFilters: true,
      pagination: { pageSize: 80 },
      columnPinning: { right: ['trailer1', 'trailer2', 'dolly'] },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableBodyRowProps: ({ row }) => {
      return {
        onClick: () => {
          handleClickOpen();
        },
        style: {
          color: '#ffcccc',
          cursor: 'pointer',
        },
      };
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 230px)',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTopToolbarProps: {
      sx: {
        background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
        color: 'white',
        '& .MuiSvgIcon-root': {
          color: 'white',   // 🎨 iconos en blanco
        },
        '& .MuiButton-root': {
          color: 'white',   // texto de botones en blanco
        },
        '& .MuiInputBase-root': {
          color: 'white',   // texto del buscador
        },
        '& .MuiInputBase-root .MuiSvgIcon-root': {
          color: 'white',   // icono de lupa en blanco
        },
      },
    },
    muiTableBodyCellProps: ({ row }) => {
      return {
        sx: {
          fontFamily: 'Inter',
          fontWeight: 'normal',
          fontSize: '12px',
        },
      }
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr auto auto',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <h1
          className="font-semibold lg:text-2xl"
        >
          Asignación de equipo
        </h1>
        <Select
          className="max-w-xs"
          label="Sucursal"
          placeholder="Seleccionar sucursal"
          selectedKeys={value}
          onSelectionChange={setValue}
          size='sm'
        >
          <SelectItem key={"1"}>Veracruz</SelectItem>
          <SelectItem key={"9"}>Manzanillo</SelectItem>
          <SelectItem key={"2"}>México</SelectItem>
        </Select>
        <DatePicker
          value={date}
          onChange={setDate}
          format="yyyy-MM-dd"
          placeholder="Selecciona una fecha"
        />
        <Button color='success' className='text-white' startContent={<i class="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, "plan_viaje.csv")} radius='full'>Exportar</Button>
      </Box >
    ),
  });

  return (
    <>
      <NavbarTravel></NavbarTravel>
      <MaterialReactTable
        table={table}
      />

      <Dialog
        open={open}
        fullWidth
        maxWidth="sm"
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar
          elevation={0}
          position="static"
          sx={{
            background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
          }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="black"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1, color: 'white' }} variant="h6" component="div">
              Asignacion de equipo
            </Typography>
            <Button autoFocus color="primary" onClick={handleClose}>
              Salir
            </Button>
          </Toolbar>
        </AppBar>

        <FormularioAsignacionEquipo></FormularioAsignacionEquipo>

      </Dialog>
    </>
  );
};

export default ViajesProgramados;
