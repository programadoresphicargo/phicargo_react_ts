import {
  MRT_Cell,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button } from "@heroui/react"
import { Chip } from "@heroui/react";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import { Popover, PopoverTrigger, PopoverContent, Input } from "@heroui/react";
import { NumberInput } from "@heroui/react";
import { toast } from 'react-toastify';
import Grid from '@mui/material/Grid';
import HistorialStock from '../historial';
import Unidad from './unidad_individual';
import { useAuthContext } from '@/modules/auth/hooks';
import { Producto } from '../tabla_productos';

const UnidadesProductos = ({ dataProducto, fetchData }: { dataProducto: Producto, fetchData: () => void }) => {

  const { session } = useAuthContext();
  const [id_unidad, setUnidad] = useState(0);

  const [cantidad, setCantidad] = useState<number>(1);
  const [id_po, setPO] = useState<string>("");
  const [isLoading, setLoading] = useState(false);

  const registrarUnidades = async () => {

    const form = {
      id_producto: dataProducto.id,
      estado: "disponible",
    };

    try {
      setLoading(true);
      const response = await odooApi.post("/tms_travel/unidades_equipo/", {
        form: form,
        cantidad: cantidad,
        id_po: id_po
      });

      if (response.data.status == "success") {
        toast.success(response.data.message);
        fetchData();
      } else {
        toast.error(response.data.message);
      }
      setLoading(false);
    } catch (error: any) {
      console.error("Error completo:", error);
      console.error("Detail:", error.response?.data?.detail);
      toast.error(error.response?.data?.detail || "Error al registrar unidades");
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
        Cell: ({ cell }: { cell: MRT_Cell<any> }) => {
          const estado = cell.getValue<string>();

          return (
            <Chip
              size="sm"
              color={
                estado === 'alta'
                  ? 'primary'
                  : estado === 'baja'
                    ? 'danger'
                    : estado === 'borrador'
                      ? 'warning'
                      : estado === 'devuelto' || estado === 'disponible'
                        ? 'success'
                        : 'secondary'
              }
              className="text-white"
            >
              {estado}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'oc_ref',
        header: 'OC',
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: dataProducto?.unidades || [],
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
      pagination: { pageIndex: 0, pageSize: 80 },
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
      onClick: () => {
        setUnidad(row.original.id_unidad);
        handleClickOpen();
      },
    }),
    muiTableBodyCellProps: () => ({
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
      },
    }),
    renderTopToolbarCustomActions: () => (
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

        <Popover placement="right">
          <PopoverTrigger>
            {session?.user.permissions.includes(218) && (
              <Button color="primary" isLoading={isLoading} radius='full'>Crear unidades</Button>
            )}
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2 w-full">
              <p className="text-small font-bold text-foreground">
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
                <Input
                  label="OC"
                  variant="bordered"
                  value={id_po}
                  onValueChange={setPO}
                >
                </Input>
                <Button color="primary" onPress={registrarUnidades} isLoading={isLoading} radius='full'>
                  Registrar
                </Button>
              </div>
            </div>
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
          <HistorialStock data={dataProducto?.historial || []}></HistorialStock>
        </Grid>
      </Grid>
      <Unidad id_unidad={id_unidad} open={open} handleClose={handleClose}></Unidad>
    </>
  );
};

export default UnidadesProductos;
