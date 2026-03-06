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
import Swal from 'sweetalert2';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LlantasAsignadas = ({ }) => {

  const { modoEdicion, setModoEdicion, lineasGlobales, setLineasGlobales, data, setData } = useSolicitudesLlantas();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const devolver = async (row) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '-',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await odooApi.patch('/solicitudes_llantas/devolver/', row);
        if (response.data.status == 'success') {
          toast.success(response.data.message);
          handleClose();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error('Error al guardar:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_line',
        header: 'ID Linea',
        enableEditing: false,
      },
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
        accessorKey: 'condicion',
        header: 'Condicion',
        enableEditing: true,
        editVariant: 'select',
        editSelectOptions: ['buena', 'dañada', 'ponchada', 'perdida'],
      },
      {
        accessorKey: 'observaciones',
        header: 'Observaciones',
        enableEditing: true,
      },
      {
        accessorKey: 'fecha_devolucion',
        header: 'Fecha devolución',
        enableEditing: true,
        muiEditTextFieldProps: {
          type: 'date',
        },
      },
      {
        accessorKey: 'devolver',
        header: 'Devolver',
        enableEditing: false,
        Cell: ({ cell, row, table }) => {
          console.log(row.original);
          return <Button radius='full' color='success' size='sm' className="text-white" onPress={() => devolver(row.original)}>
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
    [data],
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
    editDisplayMode: "modal",
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
      columnVisibility: {
        condicion: data.x_studio_status == 'borrador' ? true : false,
        fecha_devolucion: data.x_studio_status == 'borrador' ? true : false,
        observaciones: data.x_studio_status == 'borrador' ? true : false,
      },
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
    onEditingRowSave: ({ values, row }) => {
      setLineasGlobales(prev =>
        prev.map(r => r.id === row.original.id ? { ...r, ...values } : r)
      );
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
