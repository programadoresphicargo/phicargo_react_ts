import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import {
  MRT_Cell,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Button } from "@heroui/react";
import { Chip } from "@heroui/react";
import odooApi from '@/api/odoo-api';
import toast from "react-hot-toast";

const DetencionesViajesActivos = ({ isOpen, close }: { isOpen: boolean, close: () => void }) => {

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = React.useState(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string | null>(null);

  const getDetenciones = async () => {
    const ahora = new Date().toLocaleTimeString();
    try {
      setLoading(true);
      toast.success("Obteniendo detenciones, espere un segundo...");
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
      Cell: ({ cell }: { cell: MRT_Cell<any> }) => {
        const estatus = cell.getValue<string>();

        return (
          <Chip
            color={
              estatus === 'ruta'
                ? 'primary'
                : estatus === 'planta'
                  ? 'success'
                  : estatus === 'retorno'
                    ? 'warning'
                    : estatus === 'resguardo'
                      ? 'secondary'
                      : 'default'
            }
            size="sm"
            className="text-white"
          >
            {estatus.charAt(0).toUpperCase() + estatus.slice(1)}
          </Chip>
        );
      },
    },
    {
      accessorKey: "recorded_at_inicio",
      header: "Inicio Detención",
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
      Cell: ({ row }: { row: MRT_Row<any> }) => {

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
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      showProgressBars: isLoading,
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 80 },
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
        maxHeight: 'calc(100vh - 300px)'
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
        <Button color="danger" className="text-white" onPress={getDetenciones} startContent={<i className="bi bi-arrow-clockwise"></i>} radius="full">
          Actualizar detenciones
        </Button>
        {ultimaActualizacion && (
          <p className='mt-3'>Última actualización: {ultimaActualizacion}</p>
        )}
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
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DetencionesViajesActivos;
