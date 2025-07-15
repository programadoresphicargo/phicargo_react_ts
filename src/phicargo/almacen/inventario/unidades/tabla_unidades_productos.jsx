import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Card, CardBody, CardHeader, User, useDisclosure } from "@heroui/react";
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
import NavbarAlmacen from '../../Navbar';
import EPPForm from '../form';
import { useAlmacen } from '../../contexto/contexto';
import { Popover, PopoverTrigger, PopoverContent, Input } from "@heroui/react";
import { NumberInput } from "@heroui/react";
import { toast } from 'react-toastify';
import Grid from '@mui/material/Grid';
import HistorialStock from '../historial';
import Unidad from './unidad_individual';

const UnidadesProductos = ({ data2, fetch }) => {

  const [id_unidad, setUnidad] = useState(0);

  const [cantidad, setCantidad] = useState(1);
  const [isLoading, setLoading] = useState(false);
  console.log(data2);

  const registrarUnidades = async () => {

    const form = {
      id_producto: data2.id,
      estado: "disponible"
    };

    try {
      setLoading(true);
      const response = await odooApi.post("/tms_travel/unidades_equipo/", {
        form: form,
        cantidad: parseInt(cantidad),
      });

      if (response.data.status == "success") {
        toast.success(response.data.message);
        fetch();
      } else {
        toast.success(response.data.message);
      }
      console.log("Respuesta:", response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al registrar:", error);
      toast.error("Error al registrar unidades");
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_unidad',
        header: 'ID Unidad',
      },
      {
        accessorKey: 'x_name',
        header: 'Producto',
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'Fecha creación',
      },
      {
        accessorKey: 'nombre',
        header: 'Usuario creación',
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        Cell: ({ cell }) => {
          const estado = cell.getValue();
          let color = '';

          if (estado === 'alta') {
            color = 'primary';
          } else if (estado === 'baja') {
            color = 'danger';
          } else if (estado === 'borrador') {
            color = 'warning';
          } else if (estado === 'devuelto') {
            color = 'success';
          } else if (estado === 'disponible') {
            color = 'success';
          } else {
            color = 'secondary';
          }

          return (
            <Chip
              size="sm"
              color={color}
              className="text-white"
            >
              {estado}
            </Chip>
          );
        },
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: data2.unidades || [],
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionGlobalFilter: "right",
    localization: MRT_Localization_ES,
    muiSearchTextFieldProps: {
      placeholder: `Buscar`,
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
        handleClickOpen();
        setUnidad(row.original.id_unidad);
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
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Unidades
        </h1>

        <Popover showArrow offset={10} placement="bottom">
          <PopoverTrigger>
            <Button color="primary" isLoading={isLoading}>Crear unidades</Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px]">
            {(titleProps) => (
              <div className="px-1 py-2 w-full">
                <p className="text-small font-bold text-foreground" {...titleProps}>
                  Registro de unidades
                </p>
                <div className="mt-2 flex flex-col gap-2 w-full">
                  <NumberInput
                    className="max-w-xs"
                    placeholder="Ingresar número de unidades nuevas"
                    variant="bordered"
                    label="Número de unidades"
                    value={cantidad}
                    onValueChange={setCantidad}
                    minValue={1}
                  />
                  <Button color="primary" onPress={registrarUnidades} isLoading={isLoading}>
                    Registrar
                  </Button>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </Box >
    ),
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={8}>
          <MaterialReactTable
            table={table}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <HistorialStock data={data2?.historial || []}></HistorialStock>
        </Grid>
      </Grid>
      <Unidad id_unidad={id_unidad} open={open} handleClose={handleClose}></Unidad>
    </>
  );
};

export default UnidadesProductos;
