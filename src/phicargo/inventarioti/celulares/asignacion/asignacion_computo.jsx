import { Button, Card, CardBody, CardHeader, Chip, Divider, Select, SelectItem, Link } from '@heroui/react';
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
import StockComputo from './stock_computo';

const AsignacionComputo = () => {

  const [isLoading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { form_data, setFormData } = useInventarioTI();

  const columns = useMemo(
    () => [
      { accessorKey: 'sn', header: 'SN' },
      { accessorKey: 'so', header: 'SO' },
      { accessorKey: 'marca', header: 'Marca' },
      { accessorKey: 'modelo', header: 'Modelo' },
      {
        accessorKey: 'delete',
        header: 'Borrar',
        Cell: ({ cell, row, table }) => {
          return <Button onPress={() => removeCelular(row.original.id_ec)} color='danger' size='sm'> Eliminar</Button>
        },
      }
    ],
    [],
  );

  const removeCelular = (id) => {
    setFormData(prev => ({
      ...prev,
      equipo_computo: (prev.equipo_computo || []).filter(cel => cel.id_ec !== id)
    }));
  };

  const table = useMaterialReactTable({
    columns,
    data: form_data.equipo_computo || [],
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    state: { showProgressBars: isLoading },
    initialState: {
      showGlobalFilter: true,
      density: 'compact',
      pagination: { pageSize: 80 },
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
          Asignación Computo
        </h1>
        <Button color='success' className='text-white' onPress={onOpen}>Añadir equipo de computo</Button>
      </Box>
    ),
  });

  return (
    <div>
      <StockComputo isOpen={isOpen} onOpenChange={onOpenChange}></StockComputo>
      <Card className='mt-3'>
        <CardBody>
          <MaterialReactTable table={table} />
        </CardBody>
      </Card>
    </div>
  );
};

export default AsignacionComputo;

