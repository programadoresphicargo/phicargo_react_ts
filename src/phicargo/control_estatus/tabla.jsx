import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button } from "@heroui/react";
import { Checkbox } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import odooApi from '@/api/odoo-api';
const { VITE_ODOO_API_URL } = import.meta.env;

const EstatusOperativos = ({ }) => {

  const [open, setOpen] = React.useState(false);
  const [id_acceso, setIDAcceso] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const NuevoAcceso = () => {
    setOpen(true);
    setIDAcceso(null);
  };

  const [data, setData] = useState([]);
  const [isLoading2, setLoading] = useState();

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

  const cambiarPermiso = async (id_estatus, columna, estado) => {
    try {
      setLoading(true);
      const response = await odooApi.post(`/estatus_operativos/cambiar_permisos/?id_estatus=${id_estatus}&columna=${columna}&estado=${estado}`);
      setLoading(false);
      if (response.data.success === true) {
        fetchData();
      } else {
      }
    } catch (error) {
      setLoading(false);
      toast.error('Error al obtener los datos:', error);
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
        Cell: ({ row }) => {
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

          const handleCheckboxClick = (event) => {
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

          const handleCheckboxClick = (event) => {
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

          const handleCheckboxClick = (event) => {
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
    state: { showProgressBars: isLoading2 },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      pagination: { pageSize: 80 },
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
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          color='primary'
          radius='full'
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onPress={() =>
            NuevoAcceso()
          }
        >
          Nuesto estatus
        </Button>
      </Box>
    ),
  });

  return (<><MaterialReactTable table={table} /></>);

};

export default EstatusOperativos;
