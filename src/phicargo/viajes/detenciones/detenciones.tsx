import { Card, CardBody, CardHeader } from "@heroui/react";
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTiemposViaje } from './TiemposViajeContext';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Box from '@mui/material/Box';
import { Button } from "@heroui/react";
import Grid from '@mui/material/Grid2';
import { Link } from "@heroui/react";
import TiemposViajes from './tiempos_viaje';
import { ViajeContext } from '../context/viajeContext';
import odooApi from '@/api/odoo-api';
import DetencionesMotum from "./detenciones-motum";

interface Detencion {
  id?: number;
  start_time: string;
  start_latitude: number;
  start_longitude: number;
  detention_minutes: number;
  rango_fechas: string;
}

interface TiemposViajeData {
  [key: string]: string | null | undefined;
}

interface DetencionResponse {
  id?: number;
  start_time: string;
  start_latitude: number;
  start_longitude: number;
  detention_minutes: number;
}

const Detenciones = ({ }) => {

  const { id_viaje, viaje } = useContext(ViajeContext);
  const { data, setData } = useTiemposViaje();

  const getEstatus = async (): Promise<TiemposViajeData> => {
    try {
      const response = await odooApi.get<TiemposViajeData[]>(
        `/tms_travel/tiempos_viaje/${id_viaje}`
      );
      const newData = response.data.length > 0 ? { ...data, ...response.data[0] } : data;
      setData(newData);
      return newData;
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      return data;
    }
  };

  const [detenciones, setDetenciones] = useState<Detencion[]>([]);
  const [isLoadingDetenciones, setLoadingDetenciones] = useState<boolean>(false);

  const fetchData = async (
    vehicleId: number,
    data: TiemposViajeData
  ): Promise<void> => {
    const keys = Object.keys(data);
    const newDetenciones: Detencion[] = [];

    setLoadingDetenciones(true);

    try {
      for (let i = 0; i < keys.length - 1; i++) {
        const currentKey = keys[i];
        const nextKey = keys[i + 1];

        if (!currentKey || !nextKey) continue;

        const date_start = data[currentKey];

        let date_end = data[nextKey];

        if (!date_start) continue;

        if (!date_end) {
          date_end = new Date().toISOString();
        }

        try {
          const response = await odooApi.get<DetencionResponse[]>(
            '/detenciones/by_vehicle_id/',
            {
              params: {
                vehicle_id: vehicleId,
                date_start,
                date_end,
              },
            }
          );

          const formattedData: Detencion[] = response.data.map((item) => ({
            ...item,
            rango_fechas: `${currentKey} - ${nextKey}`,
          }));

          newDetenciones.push(...formattedData);

        } catch (error: unknown) {
          console.error(
            `Error en la solicitud entre ${currentKey} y ${nextKey}`,
            error
          );
        }
      }

      setDetenciones(newDetenciones);

    } finally {
      setLoadingDetenciones(false);
    }
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      const vehicleId = viaje?.vehicle?.id;
      if (!vehicleId) return;
      const updatedData = await getEstatus();
      await fetchData(vehicleId, updatedData);
    };

    fetchDataAsync();
  }, []);

  const columns = useMemo<MRT_ColumnDef<Detencion>[]>(
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
          <strong>Total: {cell.getValue<number>()} min</strong>
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
            radius="full"
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

  const table = useMaterialReactTable<Detencion>({
    columns,
    data: detenciones,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    positionToolbarAlertBanner: "bottom",
    state: { showProgressBars: isLoadingDetenciones },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 80 },
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
              <CardHeader className='bg-danger'>
                <h1 className='text-white'>Tiempos de Detención Motum Alerts</h1>
              </CardHeader>
              <CardBody>
                <DetencionesMotum></DetencionesMotum>
              </CardBody>
            </Card>

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
