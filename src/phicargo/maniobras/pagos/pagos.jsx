import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import customFontTheme from '../../../theme';
import Nomina_form from './pagos_operadores';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import ManiobrasNavBar from '../Navbar';
import { Box } from '@mui/system';
import { ManiobraProvider } from '../context/viajeContext';
import odooApi from '@/api/odoo-api';
import PeriodoPagoManiobras from './form_periodos';
import { Popover, PopoverTrigger, PopoverContent, Button, Input, Select, SelectItem } from "@heroui/react";
import { DateRangePicker } from 'rsuite';
import PagosOperadores from './pagos_operadores';
import AbrirPeriodo from './form_periodos';

const Nominas = () => {

  const [isLoading2, setLoading] = useState();
  const [periodo, setPeriodo] = useState('');

  const [modalShow, setModalShow] = useState(false);

  const handleShowModal = () => {
    setModalShow(true);
    setIDPeriodo(null);
  };

  const handleCloseModal = async () => {
    setModalShow(false);
    await fetchData();
  };

  const [openPeriodo, setOpenPeriodo] = useState(false);

  const handleShowPeriodo = () => {
    setOpenPeriodo(true);
  };

  const handleClosePeriodo = async () => {
    setOpenPeriodo(false);
    await fetchData();
  };

  const [openNewPeriod, setOpenNewPeriod] = useState(false);

  const [data, setData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await odooApi.get('/maniobras/periodos_pagos_maniobras/');
      setData(response.data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_periodo',
        header: 'ID Periodo',
      },
      {
        accessorKey: 'fecha_inicio',
        header: 'Fecha inicio',
      },
      {
        accessorKey: 'fecha_fin',
        header: 'Fecha fin',
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
      },
      {
        accessorKey: 'nombre',
        header: 'Usuario creación',
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'Fecha creación',
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    initialState: {
      showGlobalFilter: true,
      density: 'compact',
      pagination: { pageSize: 80 },
    },
    state: { isLoading: isLoading2 },
    muiCircularProgressProps: {
      color: 'primary',
      thickness: 5,
      size: 35,
    },
    muiSkeletonProps: {
      animation: 'pulse',
      height: 28,
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        handleShowPeriodo();
        setPeriodo(row.original);
      },
      style: {
        cursor: 'pointer',
      },
    }),
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 205px)',
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >

        <h1 className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text">Periodos de pago maniobras</h1>
        <Button color='primary' onPress={() => fetchData()}>Actualizar registros</Button>
        <Button color="primary" onPress={() => setOpenNewPeriod(true)}>Abrir nuevo periodo</Button>
      </Box >
    ),
  });

  return (
    <>
      <ManiobraProvider>
        <PagosOperadores show={openPeriodo} handleClose={handleClosePeriodo} periodo={periodo}></PagosOperadores>
        <ManiobrasNavBar />
        <MaterialReactTable table={table} />
      </ManiobraProvider>

      <AbrirPeriodo open={openNewPeriod} close={setOpenNewPeriod}></AbrirPeriodo>
    </>
  );

};

export default Nominas;
