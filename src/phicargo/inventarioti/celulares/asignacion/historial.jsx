import { Button, Chip, Link, User } from '@heroui/react';
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
import {
  useDisclosure,
} from "@heroui/react";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import ModalAsignacion from './form';

const apiUrl = import.meta.env.VITE_ODOO_API_URL;

const HistorialAsignaciones = ({ id_dispositivo }) => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/inventarioti/asignaciones/historial/' + id_dispositivo);
      setData(response.data);
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
      {
        accessorKey: 'nombre_empleado',
        header: 'Empleado',
        Cell: ({ row }) => {
          const nombre = row.original.nombre_empleado;

          // Si es nulo o vacío, no renderiza nada
          if (!nombre) return null;

          return (
            <User
              avatarProps={{
                isBordered: true,
                size: 'sm',
                color: 'primary'
              }}
              name={nombre}
              description={row.original.puesto}
            />
          );
        },
      },
      { accessorKey: 'fecha_asignacion', header: 'Fecha asignación' },
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
        maxHeight: 'calc(100vh - 250px)',
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
          Historial
        </h1>
        <Button color='danger' onPress={() => fetchData()}>Refrescar</Button>
      </Box>
    ),
  });

  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default HistorialAsignaciones;

