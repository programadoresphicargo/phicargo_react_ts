import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import { Avatar } from '@nextui-org/react';
import { Box } from '@mui/material';
import { Button } from '@nextui-org/react'
import { Chip, Autocomplete, AutocompleteItem, Textarea } from '@nextui-org/react';
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
import odooApi from '@/phicargo/modules/core/api/odoo-api';
const { VITE_PHIDES_API_URL } = import.meta.env;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ViajesActivosMasivo = ({ }) => {

  const [open, setOpen] = React.useState(false);
  const [openMasivo, setMasivoOpen] = React.useState(false);
  const { id_viaje, viaje, getViaje, loading, error, ActualizarIDViaje } = useContext(ViajeContext);

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
  const [isLoading, setLoading] = useState();

  const [options, setOptions] = useState([]);

  odooApi.get('/estatus_operativos/')
    .then(response => {
      const data = response.data.map(item => ({
        key: Number(item.id_estatus),
        label: item.nombre_estatus,
      }));
      console.log(data);
      setOptions(data);
    })
    .catch(err => {
      setError(err);
    })
    .finally(() => {
      setLoading(false);
    });

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
      },
      {
        accessorKey: 'tipo_armado',
        header: 'Estatus',
        Cell: ({ cell }) => {
          return (
            <Autocomplete
              className="max-w-xs"
              defaultItems={options}
              label="Estatus"
              placeholder="Selecciona un estatus"
            >
              {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
            </Autocomplete>
          );
        },
      },
      {
        accessorKey: 'tipo_armado_2',
        header: 'Comentarios',
        Cell: ({ cell }) => {
          return (
            <Textarea className="max-w-xs" label="comentarios" placeholder="Comentarios" rows={2} />
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
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {
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
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 230px)',
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length ? '#0456cf' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
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
        <h1 className='text-primary'>Viajes activos</h1>
      </Box>
    ),
  });

  return (
    <>
      <MaterialReactTable
        table={table}
      />
    </>
  );
};

export default ViajesActivosMasivo;
