import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Popover, PopoverContent, PopoverTrigger, User, useDisclosure } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import { Avatar } from "@heroui/react";
import { Box, Stack } from '@mui/material';
import { Button } from "@heroui/react"
import { Chip } from "@heroui/react";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Image } from 'antd';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { exportToCSV } from '../../utils/export';
import odooApi from '@/api/odoo-api';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EPP from '../inventario/tabla';
import SolicitudForm from './form';
import { useAlmacen } from '../contexto/contexto';

const AsignacionesEquipos = ({ x_tipo }) => {

  const
    { modoEdicion, setModoEdicion,
      data, setData,
      epp, setEPP,
      eppAdded, setEPPAdded,
      eppRemoved, setEPPRemoved,
      eppUpdated, setEPPUpdated
    } = useAlmacen();

  const [id_solicitud, setIDSolicitud] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const [dataSol, setDataSol] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/tms_travel/asignaciones_equipo/');
      setDataSol(response.data);
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
        accessorKey: 'id_asignacion',
        header: 'ID',
      },
      {
        accessorKey: 'operador',
        header: 'Operador',
      },
      {
        accessorKey: 'nombre',
        header: 'Solicitador por',
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'Fecha creacion',
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        Cell: ({ cell }) => {
          const estatus_viaje = cell.getValue();
          let badgeClass = '';

          if (estatus_viaje === 'entregado') {
            badgeClass = 'primary';
          } else if (estatus_viaje === 'confirmado') {
            badgeClass = 'success';
          } else if (estatus_viaje === 'borrador') {
            badgeClass = 'warning';
          } else if (estatus_viaje === 'devuelto') {
            badgeClass = 'success';
          } else {
            badgeClass = 'default';
          }

          return (
            <Chip
              size="sm"
              color={badgeClass}
              className="text-white"
            >
              {estatus_viaje}
            </Chip>
          );
        },
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: dataSol,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionGlobalFilter: "right",
    localization: MRT_Localization_ES,
    muiSearchTextFieldProps: {
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
        setIDSolicitud(row.original.id_asignacion);
        handleClickOpen();
      },
    }),
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
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
        <h2
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Asignaciones
        </h2>

        <Button
          className='text-white'
          startContent={<i class="bi bi-plus-lg"></i>}
          color='primary'
          isDisabled={false}
          onPress={() => {
            setIDSolicitud(null);
            setEPP([]);
            setEPPAdded([]);
            setModoEdicion(true);
            handleClickOpen();
          }}
          size='sm'
        >
          Nueva solicitud
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

        <Button
          color='success'
          className='text-white'
          startContent={<i class="bi bi-file-earmark-excel"></i>}
          onPress={() => exportToCSV(dataSol, columns, "viajes_activos.csv")}
          size='sm'>
          Exportar
        </Button>

      </Box >
    ),
  });

  return (
    <>
      <MaterialReactTable
        table={table}
      />

      <SolicitudForm id_solicitud={id_solicitud} open={open} handleClose={handleClose}></SolicitudForm>
    </>
  );
};

export default AsignacionesEquipos;
