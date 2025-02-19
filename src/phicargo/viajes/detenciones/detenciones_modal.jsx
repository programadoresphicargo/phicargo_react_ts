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

  const [data2, setData2] = useState([]);
  const [isLoading3, setLoading3] = React.useState(false);

  const getEstatus = async () => {
    try {
      setLoading3(true);
      const response = await odooApi.get('/detenciones/detenciones_viajes_activos/');
      setData2(response.data);
      setLoading3(false);
    } catch (error) {
      setLoading3(false);
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    getEstatus();
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
      header: "Velocidad Inicio",
      Cell: ({ cell }) => {
        const detenciones = cell.getValue();
        return detenciones.length > 0 ? `${detenciones[0].speed_inicio_detenido} km/h` : "Sin datos";
      },
    },
    {
      accessorKey: "ultima_detencion",
      header: "Reinicio Detención",
      Cell: ({ cell }) => {
        const detenciones = cell.getValue();
        return detenciones.length > 0
          ? new Date(detenciones[0].recorded_at_reinicio).toLocaleString("es-MX")
          : "Sin datos";
      },
    },
    {
      accessorKey: "ultima_detencion",
      header: "Velocidad Reinicio",
      Cell: ({ cell }) => {
        const detenciones = cell.getValue();
        return detenciones.length > 0 ? `${detenciones[0].speed_reinicio} km/h` : "Sin datos";
      },
    },
    {
      accessorKey: "ultima_detencion",
      header: "Minutos Detenido",
      Cell: ({ cell }) => {
        const detenciones = cell.getValue();
        return detenciones.length > 0 ? detenciones[0].minutos_detenido.toFixed(2) : "Sin datos";
      },
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: data2,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { isLoading: isLoading3 },
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
      <Modal isOpen={isOpen} size='5xl' onClose={close} scrollBehavior='outside'>
        <ModalContent>
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
