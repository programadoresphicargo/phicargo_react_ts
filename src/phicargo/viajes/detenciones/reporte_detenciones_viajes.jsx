import { Card, CardHeader, NavbarMenu } from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import { Typography } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import NavbarTravel from "../navbar_viajes";

const ReporteDetencionesViajes = () => {
  const [data, setData] = useState([]);
  const [isLoading3, setLoading3] = useState(false);

  useEffect(() => {
    getEstatus();
  }, []);

  const getEstatus = async () => {
    try {
      setLoading3(true);
      const response = await odooApi.get('/locations/detenciones/viajes/');
      setData(response.data);
    } catch (error) {
      toast.error('Error al cargar los datos');
    } finally {
      setLoading3(false);
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: 'id_viaje', header: 'ID viaje' },
      { accessorKey: 'name', header: 'Referencia viaje' },
      { accessorKey: 'vehiculo', header: 'Vehiculo' },
      { accessorKey: 'operador', header: 'Operador' },
    ],
    [],
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
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
  });

  return (
    <>
      <NavbarTravel></NavbarTravel>
      <Box sx={{ flexGrow: 1 }} margin={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <MaterialReactTable table={tableInstance} />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ReporteDetencionesViajes;
