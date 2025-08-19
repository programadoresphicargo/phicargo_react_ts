import { Button, Chip, Link } from '@heroui/react';
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
import ModalAsignacion from './modal';
import {
  useDisclosure,
} from "@heroui/react";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_ODOO_API_URL;

const Asignaciones = () => {
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/inventarioti/asignaciones/tipo/celular');
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

  const Devolver = async (data) => {
    Swal.fire({
      title: '¿Estás seguro?',
      html: `
        <p><strong>Nombre empleado:</strong> ${data.nombre_empleado || 'N/A'}</p>
        <p><strong>Fecha asignación:</strong> ${new Date(data.fecha_asignacion).toLocaleDateString()}</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await odooApi.put(`/inventarioti/asignaciones/devolver/${data.id_asignacion}`);
          if (response.data.status === 'success') {
            toast.success(response.data.message);
            fetchData();
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error('Ocurrió un error en la desasignación');
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });
  };

  const columns = useMemo(
    () => [
      { accessorKey: 'id_asignacion', header: 'ID ASIGNACION' },
      {
        accessorKey: 'nombre_empleado', header: 'Empleado',
        Cell: ({ cell }) => {
          const estatus_viaje = cell.getValue();

          return (
            <span className="font-bold uppercase">{estatus_viaje}</span>
          );
        },
      },
      { accessorKey: 'puesto', header: 'Puesto' },
      { accessorKey: 'imei', header: 'IMEI' },
      { accessorKey: 'marca', header: 'Marca' },
      { accessorKey: 'modelo', header: 'Modelo' },
      { accessorKey: 'numero', header: 'Número' },
      { accessorKey: 'compañia', header: 'Compañía' },
      { accessorKey: 'fecha_asignacion', header: 'Fecha asignación' },
      {
        accessorKey: 'responsiva',
        header: 'Responsiva',
        Cell: ({ row }) => (
          <Button
            showAnchorIcon
            as={Link}
            isExternal={true}
            color="secondary"
            href={`${apiUrl}/inventarioti/asignaciones/celulares/responsiva/${row.original.id_asignacion}`}
            variant="solid"
            size='sm'
          >
            Responsiva
          </Button>
        ),
      },
      {
        accessorKey: 'desasignar',
        header: 'Desasignar',
        Cell: ({ row }) => (
          <Button
            color="danger"
            onPress={() => Devolver(row.original)}
            variant="solid"
            size='sm'
          >
            Desasignar
          </Button>
        ),
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
        maxHeight: 'calc(100vh - 210px)',
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
          Asignaciones celulares
        </h1>
        <Button color='primary' onPress={() => onOpen()}>Nueva asignación</Button>
      </Box>
    ),
  });

  return (
    <div>
      <NavbarInventarioTI></NavbarInventarioTI>
      <MaterialReactTable table={table} />
      <ModalAsignacion isOpen={isOpen} onOpenChange={onOpenChange}></ModalAsignacion>
    </div>
  );
};

export default Asignaciones;

