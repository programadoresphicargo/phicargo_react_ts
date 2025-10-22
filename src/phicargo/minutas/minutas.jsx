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
  const [id_minuta, setMinuta] = React.useState(null);

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
        accessorKey: 'fecha',
        header: 'Fecha',
      },
      {
        accessorKey: 'solicitante',
        header: 'Solicitante',
      },
      {
        accessorKey: 'departamento',
        header: 'Departamento',
      },
      {
        accessorKey: 'puesto',
        header: 'Puesto',
      },
      {
        accessorKey: 'puntos_discusion',
        header: 'Puntos a discusión',
        Cell: ({ row }) => {
          const texto = row.original.puntos_discusion || '';
          const palabras = texto.split(' ');

          const textoRecortado =
            palabras.length > 30
              ? palabras.slice(0, 30).join(' ') + '...'
              : texto;

          return <div style={{ whiteSpace: 'pre-line' }}>{textoRecortado}</div>;
        },
      },
      {
        accessorKey: 'participantes',
        header: 'Participantes',
        Cell: ({ row }) => {
          const participantes = row.original.participantes;
          return (
            <div style={{ whiteSpace: 'pre-line' }}>
              {participantes && participantes.length > 0 ? (
                participantes.map((p, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i className="bi bi-person-fill"></i> {p.empleado}
                  </div>
                ))
              ) : (
                "Sin responsables"
              )}
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
      {
        accessorKey: 'estado',
        header: 'Estado',
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
        <h1 className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text">
          Minutas
        </h1>
        <MinutaForm open={open} handleClose={handleClose} id_minuta={id_minuta}></MinutaForm>
        <Button color='primary' className='text-white' onPress={() => handleClickOpen()} radius='full'><i class="bi bi-plus-circle"></i> Nuevo registro</Button>
        <Button color='success' className='text-white' onPress={() => fetchData()} radius='full'><i class="bi bi-arrow-clockwise"></i> Refrescar</Button>
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
