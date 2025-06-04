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
import EPP from '../../epp/epp';
import { useAlmacen } from '../../contexto/contexto';

const EPPSolicitados = ({ }) => {

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
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableEditing: false,
      },
      {
        accessorKey: 'nombre',
        header: 'Nombre',
        enableEditing: false,
      },
      {
        accessorKey: 'x_cantidad_solicitada',
        header: 'Cantidad solicitada',
        enableEditing: false,
      },
      {
        accessorKey: 'x_cantidad_devuelta',
        header: 'Cantidad devuelta',
      },
    ],
    [],
  );

  const deleteRow = (id) => {
    const rowToDelete = epp.find(row => row.id === id);
    if (!rowToDelete) return;

    setEPP(epp.filter(row => row.id !== id));
    if (!rowToDelete.isNew) {
      setEPPRemoved([...eppRemoved, { id: id }])
    } else {
      setEPPAdded(eppAdded.filter(row => row.id !== id));
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: epp,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableEditing: true,
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
      columnVisibility: {
        x_cantidad_devuelta: data?.x_studio_estado == "entregado" ? true : false,
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
          Equipo solicitado
        </h2>

        <Button
          className='text-white'
          startContent={<i class="bi bi-plus-lg"></i>}
          color='primary'
          onPress={() => handleClickOpen()}
          size='sm'
          isDisabled={!modoEdicion}
        >
          Añadir
        </Button>

      </Box >
    ),
    onEditingRowSave: ({ row, values, exitEditingMode }) => {
      const updatedData = [...epp];
      const updatedRow = { ...row.original, ...values };

      updatedRow.cantidad = parseFloat(updatedRow.cantidad) || 1;
      updatedData[row.index] = updatedRow;
      setEPP(updatedData);

      if (updatedRow.isNew) {
        // Si es nuevo, actualízalo en el array de nuevos
        setEPPAdded((prev) => {
          const exists = prev.find((r) => r.tempId === updatedRow.tempId);
          if (exists) {
            return prev.map((r) => r.tempId === updatedRow.tempId ? updatedRow : r);
          } else {
            return [...prev, updatedRow];
          }
        });
      } else {
        // Si ya está en BD, márcalo como editado
        setEPPUpdated((prev) => {
          const exists = prev.find((r) => r.id === updatedRow.id);
          if (exists) {
            return prev.map((r) => r.id === updatedRow.id ? updatedRow : r);
          } else {
            return [...prev, updatedRow];
          }
        });
      }

      exitEditingMode();
      toast.success('Registro actualizado');
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '8px' }}>
        <Button
          color="primary"
          size="sm"
          className='text-white'
          isDisabled={data?.x_studio_estado == "entregado" ? false : true}
          onPress={() => table.setEditingRow(row)}
        >
          Editar
        </Button>
      </Box>
    ),
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
            <EPP></EPP>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onPress={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default EPPSolicitados;
