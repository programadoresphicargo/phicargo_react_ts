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

const Solicitudes = ({ x_tipo, vista, travel_id }) => {

  const [id_solicitud, setIDSolicitud] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const { modoEdicion, setModoEdicion, data, setData } = useAlmacen();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 80,
  });

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
      let url = `/tms_travel/solicitudes_equipo/tipo/${x_tipo}`;

      if (travel_id) {
        url += `?travel_id=${travel_id}`;
      }
      const response = await odooApi.get(url);
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
        header: 'Solicitud',
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
        accessorKey: 'cliente',
        header: 'Cliente',
      },
      {
        accessorKey: 'subcliente',
        header: 'Subcliente',
      },
      {
        accessorKey: 'inicio_programado',
        header: 'Inicio prog. viaje',
      },
      {
        accessorKey: 'operador',
        header: 'Operador',
        Cell: ({ cell }) => {
          const operador = cell.getValue();

          if (!operador) return;

          return (
            <Chip
              size="sm"
              color="primary"
              className="text-white"
            >
              {operador}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'usuario',
        header: 'Solicitado por',
      },
      {
        accessorKey: 'create_date',
        header: 'Fecha de solicitud',
      },
      {
        accessorKey: 'x_studio_estado',
        header: 'Estado',
        Cell: ({ cell }) => {
          const estatus = cell.getValue();
          let badgeClass = '';

          if (estatus === 'entregado') {
            badgeClass = 'primary';
          } else if (estatus === 'confirmado') {
            badgeClass = 'success';
          } else if (estatus === 'borrador') {
            badgeClass = 'warning';
          } else if (estatus === 'devuelto') {
            badgeClass = 'success';
          } else if (estatus === 'cancelada') {
            badgeClass = 'danger';
          } else {
            badgeClass = 'secondary';
          }

          return (
            <Chip
              size="sm"
              color={badgeClass}
              className="text-white"
            >
              {estatus}
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
    autoResetPageIndex: false,
    onPaginationChange: setPagination,
    state: {
      pagination,
      showProgressBars: isLoading
    },
    enablePagination: true,
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
        cliente: vista == 'solicitudes' ? true : false,
        carta_porte: vista == 'solicitudes' ? true : false,
        referencia_viaje: vista == 'solicitudes' ? true : false,
        inicio_programado: vista == 'solicitudes' ? true : false,
      },
      hiddenColumns: ["empresa"],
      density: 'compact',
      expanded: false,
      showColumnFilters: true,
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
        maxHeight: 'calc(100vh - 250px)',
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
        backgroundColor: row.subRows?.length
          ? '#0456cf'
          : '#FFFFFF',

        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',

        color: row.subRows?.length
          ? '#FFFFFF'
          : '#000000',
      }
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
          radius="full"
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
          radius="full"
          className='text-white'
          startContent={<i class="bi bi-arrow-clockwise"></i>}
          color='secondary'
          onPress={() => fetchData()}
        >Actualizar
        </Button>

        <Button
          radius="full"
          color='success'
          className='text-white'
          startContent={<i class="bi bi-file-earmark-excel"></i>}
          onPress={() => exportToCSV(dataSolicitudes, columns, "solicitudes.csv")}>
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

      <SolicitudForm id_solicitud={id_solicitud} open={open} handleClose={handleClose} x_tipo={x_tipo} setID={setIDSolicitud} vista={vista} travel_id={travel_id}></SolicitudForm>
    </>
  );
};

export default Solicitudes;
