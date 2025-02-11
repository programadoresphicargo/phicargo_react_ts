import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Box } from '@mui/material';
import { ViajeContext } from '../context/viajeContext';
import { Button } from '@nextui-org/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import { toast } from 'react-toastify';

const Detenciones = ({ }) => {

  const { id_viaje, viaje, getViaje, loading, error, setIDViaje, isLoading } = useContext(ViajeContext);

  const [data, setData] = useState([]);
  const [isLoading2, setLoading] = useState();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/locations/by_vehicle_id/');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'start_time',
        header: 'Nombre del archivo',
      },
      {
        accessorKey: 'start_latitude',
        header: 'Latitud',
      },
      {
        accessorKey: 'start_longitude',
        header: 'Longitud',
      },
      {
        accessorKey: 'detention_minutes',
        header: 'Minutos detenido',
      },
      {
        header: 'Ver en Mapa',
        id: 'map',
        Cell: ({ row }) => {
          const { start_latitude, start_longitude } = row.original;
          const mapsUrl = `https://www.google.com/maps?q=${start_latitude},${start_longitude}`;

          return (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              <Button color='primary' size='sm'>
                Ver en Mapa
              </Button>
            </a>
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
    state: { isLoading: isLoading2 },
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
        borderRadius: '8px',
        overflow: 'hidden',
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
      </Box>
    )
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

export default Detenciones;
