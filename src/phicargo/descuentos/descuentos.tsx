import {
  MRT_Cell,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button } from "@heroui/react";
import odooApi from '@/api/odoo-api';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Chip } from '@heroui/react';
import DescuentoForm from './form';
import { Descuento } from './type';

const Descuentos = ({ }) => {

  const [open, setOpen] = React.useState(false);
  const [id_descuento, setDescuento] = React.useState<number | null>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDescuento(null);
    fetchData();
  };

  const [data, setData] = useState<Descuento[]>([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/descuentos/');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [open]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_descuento',
        header: 'ID',
      },
      {
        accessorKey: 'empleado',
        header: 'Empleado',
      },
      {
        accessorKey: 'fecha',
        header: 'Fecha',
      },
      {
        accessorKey: 'motivo',
        header: 'Motivo',
      },
      {
        accessorKey: 'importe',
        header: 'Importe',
      },
      {
        accessorKey: 'periodicidad',
        header: 'Periodicidad',
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        Cell: ({ cell }: { cell: MRT_Cell<Descuento> }) => {
          const status = cell.getValue<string>() || '';
          return (
            <Chip
              color={
                status === 'borrador'
                  ? 'warning'
                  : status === 'aplicado'
                    ? 'success'
                    : status === 'cancelado'
                      ? 'danger'
                      : status === 'confirmado'
                        ? 'primary'
                        : 'default'
              }
              size="sm"
              className="text-white">
              {status.toUpperCase()}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'nombre',
        header: 'Usuario creación',
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'Fecha creación',
      },
      {
        accessorKey: 'id_origen',
        header: 'ID Origen',
      },
      {
        accessorKey: 'tabla',
        header: 'Tabla',
      },
      {
        accessorKey: 'departamento',
        header: 'Departamento',
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    groupedColumnMode: 'remove',
    localization: MRT_Localization_ES,
    positionToolbarAlertBanner: "bottom",
    enableFilters: true,
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    positionToolbarDropZone: "bottom",
    initialState: {
      showGlobalFilter: true,
      showAlertBanner: true,
      showColumnFilters: true,
      grouping: ['departamento'],
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 80 },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        handleClickOpen();
        setDescuento(row.original.id_descuento);
      },
      style: {
        cursor: 'pointer',
      },
    }),
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length ? '#0456cf' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
      },
    }),
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 180px)',
      },
    },
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <h1 className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text">
          Descuentos
        </h1>
        <DescuentoForm open={open} handleClose={handleClose} id_descuento={id_descuento}></DescuentoForm>
        <Button color='primary' className='text-white' onPress={() => handleClickOpen()} radius='full'><i className="bi bi-plus-circle"></i> Nuevo</Button>
        <Button color='success' className='text-white' onPress={() => fetchData()} radius='full'><i className="bi bi-arrow-clockwise"></i> Refrescar</Button>
      </Box>
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );

};

export default Descuentos;
