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
import toast from 'react-hot-toast';
import { useSolicitudesLlantas } from './contexto';
import LlantasDisponibles from './llantas_disponibles';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LlantasAsignadas = ({ }) => {

  const { modoEdicion, setModoEdicion, lineasGlobales, setLineasGlobales, data, setData } = useSolicitudesLlantas();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Llanta',
        enableEditing: false,
      },
      {
        accessorKey: 'marca',
        header: 'Marca',
        enableEditing: false,
      },
      {
        accessorKey: 'modelo',
        header: 'Modelo',
        enableEditing: false,
      },
      {
        accessorKey: 'devolver',
        header: 'Acción',
        enableEditing: false,
        Cell: ({ cell, row, table }) => {
          return <Button radius='full' color='success' size='sm' className="text-white" onPress={() => deleteReserva(row.original.id)} isDisabled={!modoEdicion}>
            Devolver
          </Button>
        },
      },
      {
        accessorKey: 'delete',
        header: 'Borrar',
        enableEditing: false,
        Cell: ({ cell, row, table }) => {
          return <Button radius='full' color='danger' size='sm' onPress={() => deleteReserva(row.original.id)} isDisabled={!modoEdicion}>
            Eliminar
          </Button>
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
        maxHeight: 'calc(100vh - 300px)',
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
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Llantas asignadas
        </h2>

        <Button
          radius='full'
          className='text-white'
          startContent={<i class="bi bi-plus-lg"></i>}
          color='secondary'
          onPress={() => handleClickOpen()}
          isDisabled={!modoEdicion}
        >
          Añadir llantas
        </Button>

      </Box >
    ),
    muiTableBodyCellProps: ({ cell, row, table }) => ({
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
      },
    }),
  });

  return (
    <>
      <MaterialReactTable
        table={table}
      />

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        TransitionComponent={Transition}
        scroll="body"
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '28px',        // Opcional, para bordes redondeados
          }
        }}>
        <DialogContent>
          <LlantasDisponibles onClose={handleClose}></LlantasDisponibles>
        </DialogContent>
        <DialogActions>
          <Button onPress={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LlantasAsignadas;
