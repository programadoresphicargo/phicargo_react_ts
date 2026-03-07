import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button } from "@heroui/react"
import { Chip } from "@heroui/react";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Slide from '@mui/material/Slide';
import odooApi from '@/api/odoo-api';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import toast from 'react-hot-toast';
import { useSolicitudesLlantas } from './contexto';
import LlantasDisponibles from './llantas_disponibles';
import Swal from 'sweetalert2';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LlantasAsignadas = ({ }) => {

  const { modoEdicion, setModoEdicion, lineasGlobales, setLineasGlobales, data, setData, fetchData, lineasOriginales, setLineasOriginales } = useSolicitudesLlantas();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_line',
        header: 'ID Linea',
        enableEditing: false,
      },
      {
        accessorKey: 'id_devolucion',
        header: 'ID Devolucion',
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
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'observaciones',
        header: 'Observaciones',
        enableEditing: true,
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'fecha_devolucion',
        header: 'Fecha devolución',
        enableEditing: true,
        muiEditTextFieldProps: {
          type: 'date',
          required: true,
        },
      },
      {
        accessorKey: 'delete',
        header: 'Borrar',
        enableEditing: false,
        Cell: ({ cell, row, table }) => {
          return <Button radius='full' color='danger' size='sm' onPress={() => deleteLine(row.original.id_line)} isDisabled={!modoEdicion}>
            Eliminar
          </Button>
        },
      }
    ],
    [modoEdicion],
  );

  const deleteLine = (id_line) => {
    setLineasGlobales(prev => prev.filter(r => r.id_line !== id_line));
  };

  const guardarCambios = async () => {

    const lineasModificadas = lineasGlobales.filter(linea => {

      const original = lineasOriginales.find(
        o => o.id_line === linea.id_line
      );

      if (!original) return true; // línea nueva

      return (
        linea.condicion !== original.condicion ||
        linea.observaciones !== original.observaciones ||
        linea.fecha_devolucion !== original.fecha_devolucion
      );
    });

    if (lineasModificadas.length === 0) {
      toast("No hay cambios para guardar");
      return;
    }

    try {

      setLoading(true);

      const response = await odooApi.patch(
        '/solicitudes_llantas/update_lines/',
        lineasModificadas
      );

      if (response.data.status === 'success') {
        toast.success('Líneas actualizadas');
        fetchData(data?.id);
      }

    } catch (error) {

      toast.error("Error al guardar");

    } finally {
      setLoading(false);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: lineasGlobales,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableEditing: data?.x_studio_status === "entregado",
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
        condicion: data?.x_studio_status != 'borrador' ? true : false,
        fecha_devolucion: data?.x_studio_status != 'borrador' ? true : false,
        observaciones: data?.x_studio_status != 'borrador' ? true : false,
        delete: data?.x_studio_status === "borrador",
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
    onEditingRowSave: ({ values, row, table }) => {

      if (!values.condicion || !values.observaciones || !values.fecha_devolucion) {
        toast.error("Todos los campos son obligatorios");
        return; // evita cerrar el modal
      }

      setLineasGlobales(prev =>
        prev.map(r =>
          r.id_line === row.original.id_line
            ? {
              ...r,
              ...values,
              updated: row.original.id_devolucion ? true : false
            }
            : r
        )
      );

      table.setEditingRow(null);
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
          startContent={<i className="bi bi-plus-lg"></i>}
          color='secondary'
          onPress={() => handleClickOpen()}
          isDisabled={!modoEdicion}
        >
          Añadir llantas
        </Button>

        {data?.x_studio_status == "entregado" && (
          <Button
            radius="full"
            color="primary"
            className="text-white"
            onPress={guardarCambios}
            isLoading={isLoading}
          >
            Devolver llantas
          </Button>
        )}

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
