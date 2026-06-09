import { Chip } from '@heroui/react';
import {
  MRT_Cell,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';

type Asignaciones = {
  id_departamento: number;
}

const ContactosCelularesEmpleados = () => {

  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<Asignaciones[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get<Asignaciones[]>('/inventarioti/asignaciones/tipo/celular');
      const filteredData = response.data.filter(item => ![1, 12, 13, 14].includes(item.id_departamento));
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
        Cell: ({ cell }: { cell: MRT_Cell<Asignaciones> }) => {
          const numero = cell.getValue<number>();

          return (
            <Chip color="primary" size="sm">
              {numero}
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
        maxHeight: 'calc(100vh - 170px)',
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
          Líneas telefónicas
        </h1>
      </Box>
    ),
  });

  return (<MaterialReactTable table={table} />

  );
};

export default ContactosCelularesEmpleados;

