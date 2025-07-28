import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Popover, PopoverContent, PopoverTrigger, User, useDisclosure } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import { Avatar } from "@heroui/react";
import { Box } from '@mui/material';
import { Button } from "@heroui/react"
import { Chip } from "@heroui/react";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Image } from 'antd';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import odooApi from '@/api/odoo-api';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EPP from '../../inventario/tabla_productos';
import { useAlmacen } from '../../contexto/contexto';
import ReservasDetalle from '../reservas';
import TablaProductosDetalle from './tabla_productos';
import toast from 'react-hot-toast';

const EPPSolicitados = ({ }) => {

  const
    { modoEdicion, setModoEdicion,
      lineasGlobales, setLineasGlobales,
      data, setData,
    } = useAlmacen();

  const [id_solicitud, setIDSolicitud] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [linea, setLinea] = React.useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [open_reservas, setOpenReservas] = React.useState(false);

  const handleClickOpenReservas = (data) => {
    setOpenReservas(true);
    setLinea(data);
    console.log(data);
  };

  const handleCloseReservas = () => {
    setOpenReservas(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'x_name',
        header: 'Nombre',
        enableEditing: false,
      },
      {
        accessorKey: 'x_tipo_entrega',
        header: 'Tipo de entrega',
        editVariant: 'select',
        editSelectOptions: ['prestamo', 'asignacion'],
        enableEditing: () => modoEdicion && data?.x_studio_estado === "borrador",
        muiEditTextFieldProps: {
          select: true,
          defaultValue: 'prestamo',
        },
        Cell: ({ cell }) => (
          <span style={{ textTransform: 'capitalize' }}>
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'x_cantidad_solicitada',
        header: 'Cantidad solicitada',
        enableEditing: () => modoEdicion && data?.x_studio_estado === "borrador",
      },
      {
        accessorKey: 'equipo_asignado',
        header: 'Equipo asignado',
        enableEditing: false,
        Cell: ({ cell, row }) => {
          const estado = cell.getValue();

          return (
            <Button
              size="sm"
              color="primary"
              className="text-white"
              isDisabled={data?.x_studio_estado == "entregado" || data?.x_studio_estado == "recepcionado_operador" || modoEdicion ? false : true}
              onPress={() => handleClickOpenReservas(row.original)} // puedes pasar datos de la fila si lo necesitas
            >
              {estado || 'Pendiente por asignar'}
            </Button>
          );
        },
      },
      {
        accessorKey: 'delete',
        header: 'Borrar',
        enableEditing: false,
        Cell: ({ cell, row, table }) => {
          return data?.x_studio_estado === 'borrador' ? (
            <Button
              onPress={() => deleteReserva(row.original.id)}
              color='danger'
              size='sm'
              isDisabled={!modoEdicion}
            >
              Eliminar
            </Button>
          ) : null; // no muestra nada si no está en borrador
        },
      }
    ],
    [modoEdicion],
  );

  const deleteReserva = (id) => {
    setLineasGlobales(prev => prev.filter(r => r.id !== id));
  };

  const table = useMaterialReactTable({
    columns,
    data: lineasGlobales,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableEditing: true,
    editDisplayMode: "table",
    positionActionsColumn: 'last',
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionGlobalFilter: "right",
    localization: MRT_Localization_ES,
    muiSearchTextFieldProps: {
      placeholder: `Buscador`,
      sx: { minWidth: '300px' },
      variant: 'outlined',
    },
    columnResizeMode: "onEnd",
    initialState: {
      showGlobalFilter: true,
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
          Equipo solicitado
        </h2>

        <Button
          className='text-white'
          startContent={<i class="bi bi-plus-lg"></i>}
          color='primary'
          onPress={() => handleClickOpen()}
          isDisabled={!modoEdicion}
        >
          Añadir equipo
        </Button>

      </Box >
    ),
    muiTableBodyCellProps: ({ cell, row, table }) => ({
      onBlur: (event) => {
        const columnId = cell.column.id;
        const isEditable = cell.column.columnDef?.enableEditing;

        if (modoEdicion && isEditable && data?.x_studio_estado === 'borrador') {
          const newValue = event.target.value;

          const updatedRow = {
            ...row.original,
            [columnId]: columnId === 'cantidad' ? parseFloat(newValue) || 1 : newValue,
          };

          setLineasGlobales((prev) =>
            prev.map((r) => {
              if (r.isNew && r.tempId === updatedRow.tempId) return { ...updatedRow };
              if (!r.isNew && r.id === updatedRow.id) return { ...updatedRow };
              return r;
            })
          );

          toast.success(`Campo "${columnId}" actualizado`);
        }
      }
    }),
  });

  return (
    <>
      <MaterialReactTable
        table={table}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TablaProductosDetalle close={handleClose}></TablaProductosDetalle>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onPress={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      <ReservasDetalle open={open_reservas} handleClose={handleCloseReservas} dataLinea={linea || []}></ReservasDetalle>

    </>
  );
};

export default EPPSolicitados;
