import React, { useState, useEffect, useMemo, useContext } from 'react';
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
import TiemposViajes from './tiempos_viaje';
import { Card, CardHeader } from '@nextui-org/react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import { TiemposViajeProvider, useTiemposViaje } from './TiemposViajeContext';
import { Typography } from '@mui/material';

const ReporteDetenciones = ({ }) => {

  const { id_viaje, viaje, getViaje, loading, error, setIDViaje, isLoading } = useContext(ViajeContext);
  const { data, setData } = useTiemposViaje();
  const [isLoading3, setLoading3] = React.useState(false);

  const getEstatus = async () => {
    try {
      setLoading3(true);
      const response = await odooApi.get('/tms_travel/tiempos_viaje/' + id_viaje);
      console.log(response.data);

      const newData = response.data.length > 0 ? { ...data, ...response.data[0] } : data;
      setData(newData);

      setLoading3(false);
      return newData;
    } catch (error) {
      setLoading3(false);
      console.error('Error al obtener los datos:', error);
      return data;
    }
  };

  const [detenciones, setDetenciones] = useState([]);
  const [isLoading2, setLoading] = useState();

  const fetchData = async (vehicleId, data) => {
    const keys = Object.keys(data);
    const newDetenciones = [];

    for (let i = 0; i < keys.length - 1; i++) {
      const date_start = data[keys[i]];
      const date_end = data[keys[i + 1]];
      console.log(data[keys[i]]);
      console.log(data[keys[i]]);

      const url = `/locations/by_vehicle_id/`;

      try {
        const response = await odooApi.get(url, {
          params: {
            vehicle_id: vehicleId,
            date_start: date_start,
            date_end: date_end,
          },
        });

        console.log(`Datos entre ${keys[i]} y ${keys[i + 1]}:`, response.data);

        // Procesamos los datos y agregamos el rango de fechas
        const formattedData = response.data.map((item) => ({
          ...item,
          rango_fechas: `${keys[i]} - ${keys[i + 1]}`, // Agrupación por rango
        }));

        newDetenciones.push(...formattedData);
      } catch (error) {
        console.error(`Error en la solicitud entre ${keys[i]} y ${keys[i + 1]}`, error);
      }
    }

    setDetenciones(newDetenciones);
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      const updatedData = await getEstatus();
      fetchData(viaje.vehicle_id, updatedData);
    };

    fetchDataAsync();
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: 'rango_fechas', header: 'Rango de Fechas', enableGrouping: true },
      { accessorKey: 'start_time', header: 'Hora de inicio' },
      { accessorKey: 'start_latitude', header: 'Latitud' },
      { accessorKey: 'start_longitude', header: 'Longitud' },
      { accessorKey: 'detention_minutes', header: 'Minutos detenido' },
      {
        accessorKey: 'map_link',
        header: 'Ver en Google Maps',
        Cell: ({ row }) => {
          const lat = row.original.start_latitude;
          const lng = row.original.start_longitude;
          const url = `https://www.google.com/maps?q=${lat},${lng}`;
          return <a href={url} target="_blank" rel="noopener noreferrer">Ver mapa</a>;
        },
      }
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: detenciones,
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
      grouping: ['rango_fechas'],
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

  return (
    <>
      <Box sx={{ flexGrow: 1 }} margin={2}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Card>
              <TiemposViajes></TiemposViajes>
            </Card>
          </Grid>
          <Grid size={12}>
            <Card>
              <CardHeader>
                <Typography variant="h6" className='text-primary'>Tiempos de Detención</Typography>
              </CardHeader>
              <MaterialReactTable table={table} />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ReporteDetenciones;
