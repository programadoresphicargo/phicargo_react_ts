import { Card, CardBody, CardHeader } from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { TiemposViajeProvider, useTiemposViaje } from './TiemposViajeContext';

import Box from '@mui/material/Box';
import { Button } from "@heroui/button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid2';
import { Link } from "@heroui/react";
import Slide from '@mui/material/Slide';
import TiemposViajes from './tiempos_viaje';
import { Typography } from '@mui/material';
import { ViajeContext } from '../context/viajeContext';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import { toast } from 'react-toastify';

const Detenciones = ({ }) => {

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

      if (date_start && (date_end === null || date_end === undefined)) {
        date_end = new Date().toISOString();
      }

      const url = `/detenciones/by_vehicle_id/`;

      try {
        const response = await odooApi.get(url, {
          params: {
            vehicle_id: vehicleId,
            date_start: date_start,
            date_end: date_end,
          },
        });

        console.log(`Datos entre ${keys[i]} y ${keys[i + 1]}:`, response.data);

        const formattedData = response.data.map((item) => ({
          ...item,
          rango_fechas: `${keys[i]} - ${keys[i + 1]}`,
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
      {
        accessorKey: 'detention_minutes',
        header: 'Minutos detenido',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => (
          <strong>Total: {cell.getValue()} min</strong>
        ),
      },
      {
        accessorKey: 'map_link',
        header: 'Ver en Google Maps',
        Cell: ({ row }) => {
          const lat = row.original.start_latitude;
          const lng = row.original.start_longitude;
          const url = `https://www.google.com/maps?q=${lat},${lng}`;
          return <Button
            showAnchorIcon
            as={Link}
            isExternal={true}
            size='sm'
            color="primary"
            href={url}
            variant="solid"
          >
            Ver en Maps
          </Button>;
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
    muiTableContainerProps: {
      sx: {
        borderRadius: '8px',
        overflow: 'hidden',
        maxHeight: 'calc(100vh)',
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length ? '#1184e8' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
      },
    }),
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
              <CardHeader className='bg-primary'>
                <h1 className='text-white'>Tiempos de Detención</h1>
              </CardHeader>
              <CardBody>
                <MaterialReactTable table={table} />
              </CardBody>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Detenciones;
