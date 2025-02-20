import { Card, CardBody, CardHeader, Modal, ModalContent, ModalBody, ModalHeader } from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { Chip } from "@heroui/react";
import { Link } from "@heroui/react";
import Slide from '@mui/material/Slide';
import { Typography } from '@mui/material';
import odooApi from '@/phicargo/modules/core/api/odoo-api';

const DetencionesViajesActivos = ({ isOpen, close }) => {

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = React.useState(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  const getDetenciones = async () => {
    const ahora = new Date().toLocaleTimeString();
    try {
      setLoading(true);
      addToast({
        title: "Obteniendo detenciones, espere un segundo...",
        color: 'success',
        variant: 'solid',
        style: { zIndex: 9999 }
      });
      const response = await odooApi.get("/detenciones/detenciones_viajes_activos/");
      setData(response.data);
      setUltimaActualizacion(ahora);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getDetenciones();
    }
  }, [isOpen]);

  const columns = [
    {
      accessorKey: "name",
      header: "Referencia viaje",
    },
    {
      accessorKey: "vehiculo",
      header: "Vehículo",
    },
    {
      accessorKey: "operador",
      header: "Operador",
    },
    {
      accessorKey: "x_status_viaje",
      header: "Estado",
      Cell: ({ cell }) => {
        const estatus_viaje = cell.getValue();
        let badgeClass = '';

        if (estatus_viaje === 'ruta') {
          badgeClass = 'primary';
        } else if (estatus_viaje === 'planta') {
          badgeClass = 'success';
        } else if (estatus_viaje === 'retorno') {
          badgeClass = 'warning';
        } else if (estatus_viaje === 'resguardo') {
          badgeClass = 'secondary';
        }

        return (
          <Chip
            color={badgeClass}
            size="sm"
            className="text-white"
          >
            {estatus_viaje.charAt(0).toUpperCase() + estatus_viaje.slice(1)}
          </Chip>
        );
      },
    },
    {
      accessorKey: "recorded_at_inicio",
      header: "Inicio Detención",
      Cell: ({ cell }) => {
        const fecha = cell.getValue();
        return fecha
          ? new Date(fecha).toLocaleString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
          : "Sin datos";
      },
    },
    {
      accessorKey: "latitude",
      header: "Latitud",
    },
    {
      accessorKey: "longitude",
      header: "Longitud",
    },
    {
      accessorKey: "tiempo_detenido",
      header: "Tiempo detenido HHH:mm",
    },
    {
      header: "Mapa",
      Cell: ({ row }) => {
        const lat = row.original.latitude;
        const lng = row.original.longitude;

        return lat && lng ? (
          <a
            href={`https://www.google.com/maps?q=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Ver en Mapa
            </button>
          </a>
        ) : (
          "Sin datos"
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
        maxHeight: 'calc(100vh - 300px)',
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
        <div>
          <Button color="danger" className="text-white" onPress={getDetenciones} startContent={<i class="bi bi-arrow-clockwise"></i>}>
            Actualizar detenciones
          </Button>
          {ultimaActualizacion && (
            <p className='mt-3'>Última actualización: {ultimaActualizacion}</p>
          )}
        </div>
      </Box>
    )
  });

  return (
    <>
      <Modal isOpen={isOpen} size='5xl' onClose={close} scrollBehavior='outside'>
        <ModalContent style={{ maxWidth: "1700px", width: "120%" }}>
          {(onClose) => (
            <>
              <ModalHeader className='bg-danger'>
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
