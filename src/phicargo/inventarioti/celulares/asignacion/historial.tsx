import { Button, User } from '@heroui/react';
import {
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';

const HistorialAsignaciones = ({ id_dispositivo }: { id_dispositivo: number }) => {

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
        Cell: ({ row }: { row: MRT_Row<any> }) => {
          const nombre = row.original.nombre_empleado;

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
        maxHeight: 'calc(100vh - 250px)',
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
        <h2
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Historial de asignaciones
        </h2>
        <Button color='danger' onPress={() => fetchData()} radius='full'>Refrescar</Button>
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

