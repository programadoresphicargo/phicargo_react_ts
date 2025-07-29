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
import EPP from '../inventario/tabla_productos';
import SolicitudForm from './form';
import { useAlmacen } from '../contexto/contexto';

const Solicitudes = ({ x_tipo, vista }) => {

  const [id_solicitud, setIDSolicitud] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const { modoEdicion, setModoEdicion, data, setData } = useAlmacen();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const [dataSolicitudes, setDataSolicitudes] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/tms_travel/solicitudes_equipo/tipo/' + x_tipo);

      let solicitudes = response.data;

      if (vista === 'solicitudes') {
        solicitudes = solicitudes.filter((sol) => sol.x_waybill_id !== null);
      } else if (vista === 'asignaciones') {
        solicitudes = solicitudes.filter((sol) => sol.x_waybill_id == null);
      }

      setDataSolicitudes(solicitudes);
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
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'carta_porte',
        header: 'Carta porte',
      },
      {
        accessorKey: 'referencia_viaje',
        header: 'Viaje',
      },
      {
        accessorKey: 'inicio_programado',
        header: 'Inicio prog. viaje',
      },
      {
        accessorKey: 'operador',
        header: 'Operador',
      },
      {
        accessorKey: 'usuario',
        header: 'Solicitador por',
      },
      {
        accessorKey: 'create_date',
        header: 'Fecha de solicitud',
      },
      {
        accessorKey: 'x_studio_estado',
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
      {
        accessorKey: 'descripcion',
        header: 'Equipo asignado',
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: dataSolicitudes,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionGlobalFilter: "right",
    localization: MRT_Localization_ES,
    muiSearchTextFieldProps: {
      placeholder: `Buscar en ${dataSolicitudes.length} solicitud`,
      sx: { minWidth: '300px' },
      variant: 'outlined',
    },
    columnResizeMode: "onEnd",
    initialState: {
      showGlobalFilter: true,
      columnVisibility: {
        carta_porte: vista == 'solicitudes' ? true : false,
        referencia_viaje: vista == 'solicitudes' ? true : false,
        inicio_programado: vista == 'solicitudes' ? true : false,
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
        maxHeight: 'calc(100vh - 260px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {
        setIDSolicitud(row.original.id);
        setModoEdicion(false);
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
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          {vista.toUpperCase()}
        </h2>

        <Button
          className='text-white'
          startContent={<i class="bi bi-plus-lg"></i>}
          color='primary'
          isDisabled={false}
          onPress={() => {
            setIDSolicitud(null);
            setModoEdicion(true);
            handleClickOpen();
            setData({});
          }}
        >
          Nueva solicitud
        </Button>

        <Button
          className='text-white'
          startContent={<i class="bi bi-arrow-clockwise"></i>}
          color='primary'
          isDisabled={false}
          onPress={() => fetchData()}
        >Actualizar tablero
        </Button>

      </Box >
    ),
  });

  return (
    <>
      <MaterialReactTable
        table={table}
      />

      <SolicitudForm id_solicitud={id_solicitud} open={open} handleClose={handleClose} x_tipo={x_tipo} setID={setIDSolicitud} vista={vista}></SolicitudForm>
    </>
  );
};

export default Solicitudes;
