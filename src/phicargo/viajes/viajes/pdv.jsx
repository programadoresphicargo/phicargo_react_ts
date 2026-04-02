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
import NavbarTravel from '../navbar_viajes';
import Travel from '../control/viaje';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PDV = ({ }) => {

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [range, setRange] = useState([firstDay, lastDay]);

  const [open, setOpen] = React.useState(false);
  const [idViaje, setIDViaje] = React.useState(null);

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
      const response = await odooApi.get('/tms_waybill/get_waybills/', {
        params: {
          date_start: range[0].toISOString().slice(0, 10),
          date_end: range[1].toISOString().slice(0, 10)
        }
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'date_order',
        header: 'Fecha',
      },
      {
        accessorKey: 'sucursal',
        header: 'Sucursal',

      },
      {
        accessorKey: 'carta_porte',
        header: 'Carta porte',
      },
      {
        accessorKey: 'x_comentarios_maniobra',
        header: 'Comentarios maniobra',
      },
      {
        accessorKey: 'x_reference',
        header: 'Contenedor',
      },
      {
        accessorKey: 'cliente',
        header: 'Cliente',
      },
      {
        accessorKey: 'x_ruta_bel',
        header: 'Ruta',
      },
      {
        accessorKey: 'x_tipo_bel',
        header: 'Tipo armado',
      },
      {
        accessorKey: 'x_modo_bel',
        header: 'Modo',
      },
      {
        accessorKey: 'date_start',
        header: 'Inicio programado',
      },
      {
        accessorKey: 'x_date_arrival_shed',
        header: 'Llegada a planta',
      },
      {
        accessorKey: 'referencia_viaje',
        header: 'Viaje',
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
    positionToolbarAlertBanner: "bottom",
    localization: MRT_Localization_ES,
    columnResizeMode: "onEnd",
    initialState: {
      grouping: ['sucursal', 'date_order'],
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
          setIDViaje(row.original.id_viaje);
        },
        style: {
          color: '#ffcccc',
          cursor: 'pointer',
        },
      };
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 200px)',
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
          backgroundColor: row.subRows?.length ? '#0456cf' : '#FFFFFF',
          color: row.subRows?.length ? '#FFFFFF' : '#000000',
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
          className="font-semibold lg:text-2xl"
        >
          PDV
        </h1>
        <DateRangePicker
          value={range}
          onChange={(value) => setRange(value)}
          placeholder="Selecciona un rango de fechas"
          format="yyyy-MM-dd"
          loading={isLoading}
        />
        <Button color='primary' startContent={<i class="bi bi-arrow-clockwise"></i>} onPress={() => fetchData()} radius='full'>Actualizar</Button>
        <Button color='success' className='text-white' startContent={<i class="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, "programacion_viajes.csv")} radius='full'>Exportar</Button>
      </Box >
    ),
  });

  return (
    <>
      <NavbarTravel></NavbarTravel>
      <MaterialReactTable table={table} />
      <Travel idViaje={idViaje} open={open} handleClose={handleClose}></Travel>
    </>
  );
};

export default PDV;
