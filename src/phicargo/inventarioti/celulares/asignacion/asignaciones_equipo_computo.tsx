import { Button, Link, User } from '@heroui/react';
import {
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import NavbarInventarioTI from '../../navbar';
import ModalAsignacion from './form';
import {
  useDisclosure,
} from "@heroui/react";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { exportToCSV } from '@/phicargo/utils/export';

type AsignacionComputo = {
  id_asignacion: number;
  nombre_empleado: string;
  fecha_asignacion: string;
  puesto: string;
}

const apiUrl = import.meta.env.VITE_ODOO_API_URL;

const AsignacionesEquipoComputo = () => {
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState<AsignacionComputo[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/inventarioti/asignaciones/tipo/computo');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isOpen]);

  const Desasignar = async (data: AsignacionComputo) => {
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
          const response = await odooApi.put(`/inventarioti/asignaciones/devolver/${data.id_asignacion}/computo`);
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
      {
        accessorKey: 'nombre_empleado', header: 'Empleado',
        Cell: ({ row }: { row: MRT_Row<AsignacionComputo> }) => {
          const nombre = row.original.nombre_empleado;

          // Si es nulo o vacío, no renderiza nada
          if (!nombre) return null;

          return (
            <User
              avatarProps={{
                isBordered: true,
                size: 'sm',
                color: 'secondary'
              }}
              name={nombre}
              description={row.original.puesto}
            />
          );
        },
      },
      { accessorKey: 'puesto', header: 'Puesto' },
      { accessorKey: 'marca', header: 'Marca' },
      { accessorKey: 'modelo', header: 'Modelo' },
      { accessorKey: 'sn', header: 'SN' },
      { accessorKey: 'fecha_asignacion', header: 'Fecha asignación' },
      { accessorKey: 'dias_asignado', header: 'Días asignado' },
      {
        accessorKey: 'responsiva',
        header: 'Responsiva',
        Cell: ({ row }: { row: MRT_Row<AsignacionComputo> }) => (
          <Button
            showAnchorIcon
            as={Link}
            isExternal={true}
            color="secondary"
            href={`${apiUrl}/inventarioti/asignaciones/equipo_computo/responsiva/${row.original.id_asignacion}`}
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
            onPress={() => Desasignar(row.original)}
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
      pagination: { pageIndex: 0, pageSize: 80 },
      showColumnFilters: true,
    },
    muiTableBodyRowProps: () => ({
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
          Asignaciones computo
        </h1>
        <Button radius='full' color='primary' onPress={() => onOpen()}>Nueva asignación</Button>
        <Button radius='full' color='danger' onPress={() => fetchData()}>Refrescar</Button>
        <Button
          radius='full'
          color='success'
          className='text-white'
          startContent={<i className="bi bi-file-earmark-excel"></i>}
          onPress={() => exportToCSV(data, columns, "asignaciones_computo.csv")}>
          Exportar
        </Button>
      </Box>
    ),
  });

  return (
    <>
      <NavbarInventarioTI></NavbarInventarioTI>
      <MaterialReactTable table={table} />
      <ModalAsignacion isOpen={isOpen} onOpenChange={onOpenChange}></ModalAsignacion>
    </>
  );
};

export default AsignacionesEquipoComputo;

