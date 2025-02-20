import { Card, CardBody, CardHeader, Modal, ModalContent, ModalBody, ModalHeader } from '@nextui-org/react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { Button } from '@nextui-org/button';
import { Link } from "@nextui-org/react";
import Slide from '@mui/material/Slide';
import { Typography } from '@mui/material';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import { toast } from 'react-toastify';

const DetencionesViajesActivos = ({ isOpen, close }) => {

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = React.useState(false);

  const getDetenciones = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/detenciones/detenciones_viajes_activos/');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    getDetenciones();
  }, []);

  const columns = [
    {
      accessorKey: "name",
      header: "ID Viaje",
    },
    {
      accessorKey: "vehiculo",
      header: "Vehículo",
    },
    {
      accessorKey: "placas",
      header: "Placas",
    },
    {
      accessorKey: "ultima_detencion",
      header: "Inicio Detención",
      Cell: ({ cell }) => {
        const detenciones = cell.getValue();
        return detenciones.length > 0
          ? new Date(detenciones[0].recorded_at_inicio_detenido).toLocaleString("es-MX")
          : "Sin datos";
      },
    },
    {
      accessorKey: "ultima_detencion",
      header: "Latitud",
      Cell: ({ cell }) => {
        const detenciones = cell.getValue();
        return detenciones.length > 0 ? `${detenciones[0].lat_inicio_detenido}` : "Sin datos";
      },
    },
    {
      accessorKey: "ultima_detencion",
      header: "Longitud",
      Cell: ({ cell }) => {
        const detenciones = cell.getValue();
        return detenciones.length > 0 ? `${detenciones[0].lon_inicio_detenido}` : "Sin datos";
      },
    },
    {
      accessorKey: "ultima_detencion",
      header: "Minutos Detenido",
      Cell: ({ cell }) => {
        const detenciones = cell.getValue();
        return (
          <div style={{ textAlign: "right", width: "100%" }}>
            {detenciones.length > 0 ? detenciones[0].minutos_detenido.toFixed(2) : "Sin datos"}
          </div>
        );
      },
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { isLoading: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      showProgressBars: isLoading,
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
    muiTableContainerProps: {
      sx: {
        borderRadius: '8px',
        overflow: 'hidden',
        maxHeight: 'calc(100vh)',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 200px)',
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
        <Button color='warning' className='text-white' onPress={() => getDetenciones()}>Actualizar</Button>
      </Box>
    )
  });

  return (
    <>
      <Modal isOpen={isOpen} size='5xl' onClose={close} scrollBehavior='outside'>
        <ModalContent style={{ maxWidth: "1700px", width: "120%" }}>
          {(onClose) => (
            <>
              <ModalHeader className='bg-warning'>
                <h1 className='text-white'>Tiempos de Detención</h1>
              </ModalHeader>
              <ModalBody>
                <MaterialReactTable table={table} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DetencionesViajesActivos;
