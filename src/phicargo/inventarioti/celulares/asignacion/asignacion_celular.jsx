import { Button, Card, CardBody, CardHeader, Chip, Divider, Select, SelectItem } from '@heroui/react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import { DatePicker } from 'antd';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import NavbarInventarioTI from '../../navbar';
import StockCelulares from './stock';
import {
  useDisclosure,
} from "@heroui/react";
import { useInventarioTI } from '../../contexto/contexto';

const AsignacionCelular = () => {
  const [isLoading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { celulares_asignados, setCelularesAsignados } = useInventarioTI();

  const columns = useMemo(
    () => [
      { accessorKey: 'imei', header: 'IMEI' },
      { accessorKey: 'marca', header: 'Marca' },
      { accessorKey: 'modelo', header: 'Modelo' },
      {
        accessorKey: 'delete',
        header: 'Borrar',
        Cell: ({ cell, row, table }) => {
          return <Button onPress={() => eliminarCelular(row.original.id_celular)} color='danger' size='sm'> Eliminar {row.original.id_celular}</Button>
        },
      }
    ],
    [],
  );

  const eliminarCelular = (id) => {
    console.log(id);
    setCelularesAsignados(celulares_asignados.filter(c => c.id_celular !== id));
  };

  const table = useMaterialReactTable({
    columns,
    data: celulares_asignados,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    state: { showProgressBars: isLoading },
    initialState: {
      showGlobalFilter: true,
      density: 'compact',
      pagination: { pageSize: 80 },
      showColumnFilters: true,
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => { },
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
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
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
        maxHeight: 'calc(100vh - 170px)',
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
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Asignación celular
        </h1>
        <Button color='primary' onPress={onOpen}>Añadir</Button>
      </Box>
    ),
  });

  return (
    <div>
      <StockCelulares isOpen={isOpen} onOpenChange={onOpenChange}></StockCelulares>
      <Card className='mt-3'>
        <CardHeader>
          Asignación celular
        </CardHeader>
        <Divider></Divider>
        <CardBody>
          <MaterialReactTable table={table} />
        </CardBody>
      </Card>
    </div>
  );
};

export default AsignacionCelular;

