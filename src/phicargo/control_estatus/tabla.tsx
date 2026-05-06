import {
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Checkbox } from '@mui/material';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';
const { VITE_ODOO_API_URL } = import.meta.env;

type Estatus = {
  id_estatus: number;
  monitoreo: boolean;
  operador: boolean;
  es_justificante: boolean;
  imagen: string;
};

const EstatusOperativos = ({ }) => {

  const [data, setData] = useState<Estatus[]>([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {

    try {
      setLoading(true);
      const response = await odooApi.get('/estatus_operativos/');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error al obtener los datos:', error);
    }
  };

  const cambiarPermiso = async (id_estatus: number, columna: String, estado: String) => {
    try {
      setLoading(true);
      const response = await odooApi.post(`/estatus_operativos/cambiar_permisos/?id_estatus=${String(id_estatus)}&columna=${columna}&estado=${estado}`);
      setLoading(false);
      if (response.data.success === true) {
        fetchData();
      } else {
      }
    } catch (error: any) {
      setLoading(false);
      toast.error('Error al obtener los datos: ' + error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_estatus',
        header: 'ID Estatus',
      },
      {
        accessorKey: 'imagen',
        header: 'Icono',
        Cell: ({ row }: { row: MRT_Row<Estatus> }) => {
          const imagen = row.original.imagen;

          return (
            <img
              height={50}
              width={50}
              src={VITE_ODOO_API_URL + `/assets/trafico/estatus_operativos/${imagen}`} />
          );
        },
      },
      {
        accessorKey: 'nombre_estatus',
        header: 'Nombre Estatus',
      },
      {
        accessorKey: 'tipo',
        header: 'Tipo',
      },
      {
        accessorKey: 'monitoreo',
        header: 'Monitoreo',
        Cell: ({ row }) => {
          const id_estatus = row.original.id_estatus;
          const isChecked = row.original.monitoreo;

          const handleCheckboxClick = (event: any) => {
            const isCheckedNow = event.target.checked;
            cambiarPermiso(id_estatus, 'monitoreo', isCheckedNow);
          };

          return (
            <Checkbox
              checked={isChecked}
              onChange={handleCheckboxClick}
            />
          );
        },
      },
      {
        accessorKey: 'operador',
        header: 'Operador',
        Cell: ({ row }) => {
          const id_estatus = row.original.id_estatus;
          const isChecked = row.original.operador;

          const handleCheckboxClick = (event: any) => {
            const isCheckedNow = event.target.checked;
            cambiarPermiso(id_estatus, 'operador', isCheckedNow);
          };

          return (
            <Checkbox
              checked={isChecked}
              onChange={handleCheckboxClick}
            />
          );
        },
      },
      {
        accessorKey: 'es_justificante',
        header: 'Es justificable en salidas/llegadas tarde',
        Cell: ({ row }) => {
          const id_estatus = row.original.id_estatus;
          const isChecked = row.original.es_justificante;

          const handleCheckboxClick = (event: any) => {
            const isCheckedNow = event.target.checked;
            cambiarPermiso(id_estatus, 'es_justificante', isCheckedNow);
          };

          return (
            <Checkbox
              checked={isChecked}
              onChange={handleCheckboxClick}
            />
          );
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 80 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
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
        maxHeight: 'calc(100vh - 220px)',
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
      </Box>
    ),
  });

  return (<><MaterialReactTable table={table} /></>);

};

export default EstatusOperativos;
