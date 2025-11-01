import { Button, Chip } from '@heroui/react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import { DatePicker } from 'antd';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';

const ContactosCelulares = () => {
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/inventarioti/asignaciones/tipo/celular');
      const filteredData = response.data.filter(item => ![1, 12, 13].includes(item.id_departamento));
      setData(filteredData);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: 'nombre_empleado', header: 'Nombre del empleado' },
      { accessorKey: 'departamento', header: 'Departamento' },
      { accessorKey: 'puesto', header: 'Puesto' },
      {
        accessorKey: 'numero',
        header: 'Número celular',
        Cell: ({ cell }) => {
          const estatus_viaje = cell.getValue();

          return (
            <Chip color="primary" size="sm">
              {estatus_viaje}
            </Chip>
          );
        },
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
          Líneas telefónicas
        </h1>
      </Box>
    ),
  });

  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default ContactosCelulares;

