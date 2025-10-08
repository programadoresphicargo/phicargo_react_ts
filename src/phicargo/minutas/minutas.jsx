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
import MinutaForm from './form';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

const { VITE_ODOO_API_URL } = import.meta.env;

const Minutas = ({ }) => {

  const [open, setOpen] = React.useState(false);
  const [id_minuta, setMinuta] = React.useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMinuta(null);
  };

  const [data, setData] = useState([]);
  const [isLoading2, setLoading] = useState();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/minutas/');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [open]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_minuta',
        header: 'ID Minuta',
      },
      {
        accessorKey: 'participantes',
        header: 'Participantes',
        Cell: ({ row }) => {
          const responsables = row.original.participantes;
          return (
            <div style={{ whiteSpace: 'pre-line' }}>
              {responsables && responsables.length > 0
                ? responsables.map(p => p.empleado).join(",\n")
                : "Sin responsables"}
            </div>
          );
        },
      },
      {
        accessorKey: 'usuario_registro_nombre',
        header: 'Usuario registro',
      },
      {
        accessorKey: 'fecha_registro',
        header: 'Fecha registro',
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    localization: MRT_Localization_ES,
    enableFilters: true,
    state: { showProgressBars: isLoading2 },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      pagination: { pageSize: 80 },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {
        handleClickOpen();
        setMinuta(row.original.id_minuta);
      },
      style: {
        cursor: 'pointer',
      },
    }),
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
        <MinutaForm open={open} handleClose={handleClose} id_minuta={id_minuta}></MinutaForm>
        <Button color='primary' className='text-white' onPress={() => handleClickOpen()} radius='full'>Nuevo</Button>
        <Button color='success' className='text-white' onPress={() => fetchData()} radius='full'>Refrescar</Button>
      </Box>
    ),
  });

  return (<>
    <div>
      <MaterialReactTable table={table} />
    </div >
  </>
  );

};

export default Minutas;
