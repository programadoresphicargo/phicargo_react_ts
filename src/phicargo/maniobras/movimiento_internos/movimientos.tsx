import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button } from "@heroui/react";
import odooApi from '@/api/odoo-api';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import CustomNavbar from '@/pages/CustomNavbar';
import { pages } from '../pages';
import { MovInterno } from './type';
import MovimientosInternosForm from './form';

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

  const [data, setData] = useState<MovInterno[]>([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/movimientos-internos/');
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
        accessorKey: 'date',
        header: 'Fecha',
      },
      {
        accessorKey: 'type',
        header: 'Tipo',
      },
      {
        accessorKey: 'driver',
        header: 'Operador',
      },
      {
        accessorKey: 'vehicle',
        header: 'Unidad',
      },
      {
        accessorKey: 'trailer1_name',
        header: 'Remolque 1',
      },
      {
        accessorKey: 'trailer2_name',
        header: 'Remolque 2',
      },
      {
        accessorKey: 'dolly_name',
        header: 'Dolly',
      },
      {
        accessorKey: 'usuario_creacion',
        header: 'Usuario creacion',
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
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 80 },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        handleClickOpen();
        setDescuento(row.original.id);
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
        backgroundColor: row.subRows?.length
          ? '#0456cf'
          : row.index % 2 === 0
            ? '#FFFFFF'
            : '#F8F9FA',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        padding: '2px 8px',
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
          Movimientos internos
        </h1>
        <MovimientosInternosForm open={open} handleClose={handleClose} id={id_descuento}></MovimientosInternosForm>
        <Button color='primary' className='text-white' onPress={() => handleClickOpen()} radius='md' size='sm'><i className="bi bi-plus-circle"></i> Nuevo</Button>
        <Button color='success' className='text-white' onPress={() => fetchData()} radius='md' size='sm'><i className="bi bi-arrow-clockwise"></i> Refrescar</Button>
      </Box>
    ),
  });

  return (
    <>
      <CustomNavbar pages={pages}></CustomNavbar>
      <MaterialReactTable table={table} />
    </>
  );

};

export default Descuentos;
