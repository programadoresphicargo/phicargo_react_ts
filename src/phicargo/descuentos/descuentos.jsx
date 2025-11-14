import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, AvatarGroup } from "@heroui/react";
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
import { Tooltip } from "@heroui/react";
import { Chip } from '@heroui/react';
import DescuentoForm from './form';

const { VITE_ODOO_API_URL } = import.meta.env;

const Descuentos = ({ }) => {

  const [open, setOpen] = React.useState(false);
  const [id_minuta, setMinuta] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMinuta(null);
    fetchData();
  };

  const [data, setData] = useState([]);
  const [isLoading2, setLoading] = useState();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/descuentos/');
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
        accessorKey: 'id_descuento',
        header: 'ID',
      },
      {
        accessorKey: 'empleado',
        header: 'Empleado',
      },
      {
        accessorKey: 'fecha',
        header: 'Fecha',
      },
      {
        accessorKey: 'motivo',
        header: 'Motivo',
      },
      {
        accessorKey: 'importe',
        header: 'Importe',
      },
      {
        accessorKey: 'periodicidad',
        header: 'Periodicidad',
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        Cell: ({ cell }) => {
          const status = cell.getValue() || '';
          let badgeClass = 'default';

          if (status === 'borrador') {
            badgeClass = 'warning';
          } else if (status === 'aplicado') {
            badgeClass = 'success';
          } else if (status === 'cancelado') {
            badgeClass = 'danger';
          } else if (status === 'confirmado') {
            badgeClass = 'primary';
          }

          return (
            <Chip color={badgeClass} size="sm" className="text-white">
              {status}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'nombre',
        header: 'Usuario creación',
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'Fecha creación',
      },
      {
        accessorKey: 'id_origen',
        header: 'ID Origen',
      },
      {
        accessorKey: 'tabla',
        header: 'Tabla',
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
        setMinuta(row.original.id_descuento);
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
        maxHeight: 'calc(100vh - 180px)',
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
          Descuentos
        </h1>
        <DescuentoForm open={open} handleClose={handleClose} id_descuento={id_minuta}></DescuentoForm>
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

export default Descuentos;
