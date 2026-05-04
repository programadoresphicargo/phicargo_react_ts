import {
  MRT_Cell,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button } from "@heroui/react"
import { Chip } from "@heroui/react";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { exportToCSV } from '../utils/export';
import odooApi from '@/api/odoo-api';
import { useSolicitudesLlantas } from './contexto';
import SolicitudForm from '../almacen/solicitud/form';

type Solicitudes = {
  id: number;
  operador: string;
  x_studio_status: string;
};

type SolicitudesLlantasProps = {
  vista?: string;
  travel_id?: number;
};

const SolicitudesLlantas: React.FC<SolicitudesLlantasProps> = ({
  vista,
  travel_id
}) => {

  const [id_solicitud, setIDSolicitud] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState(false);
  const { setModoEdicion } = useSolicitudesLlantas();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const [dataSolicitudes, setDataSolicitudes] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      let url = `/solicitudes_llantas/`;

      if (travel_id) {
        url += `?travel_id=${travel_id}`;
      }
      const response = await odooApi.get(url);
      setDataSolicitudes(response.data);
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
        accessorKey: 'id',
        header: 'Solicitud',
        Cell: ({ cell }: { cell: MRT_Cell<Solicitudes> }) => {
          const ID = cell.getValue() as number;
          return (
            <h1>
              SL-{ID}
            </h1>
          );
        },
      },
      {
        accessorKey: 'create_date',
        header: 'Fecha de solicitud',
      },
      {
        accessorKey: 'carta_porte',
        header: 'Carta porte',
      },
      {
        accessorKey: 'operador',
        header: 'Operador',
        Cell: ({ cell }: { cell: MRT_Cell<Solicitudes> }) => {
          const estatus_viaje = cell.getValue() as string;

          if (!estatus_viaje) return;

          return (
            <Chip
              size="sm"
              color="primary"
              className="text-white"
            >
              {estatus_viaje}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'vehiculo',
        header: 'Vehiculo',
      },
      {
        accessorKey: 'ruta',
        header: 'Ruta',
      },
      {
        accessorKey: 'x_studio_status',
        header: 'Estado',
        Cell: ({ cell }: { cell: MRT_Cell<Solicitudes> }) => {
          const estatus = cell.getValue() as string;
          let badgeClass = "";

          if (estatus === "entregado") {
            badgeClass = "primary";
          } else if (estatus === "confirmado") {
            badgeClass = "success";
          } else if (estatus === "borrador") {
            badgeClass = "warning";
          } else if (estatus === "cerrado") {
            badgeClass = "success";
          } else if (estatus === "cancelado") {
            badgeClass = "danger";
          } else {
            badgeClass = "secondary";
          }

          return (
            <Chip
              size="sm"
              color={badgeClass as any}
              className="text-white"
            >
              {estatus}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'x_cantidad_solicitada',
        header: 'Cantidad solicitada',
      },
      {
        accessorKey: 'llantas',
        header: 'Llantas asignadas',
      },
      {
        accessorKey: 'usuario',
        header: 'Solicitado por',
      },
      {
        accessorKey: 'referencia_viaje',
        header: 'Viaje',
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: dataSolicitudes,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionGlobalFilter: "right",
    localization: MRT_Localization_ES,
    muiSearchTextFieldProps: {
      placeholder: `Buscar en ${dataSolicitudes.length} solicitud`,
      sx: { minWidth: '300px' },
      variant: 'outlined',
    },
    columnResizeMode: "onEnd",
    initialState: {
      showGlobalFilter: true,
      density: 'compact',
      expanded: true,
      showColumnFilters: true,
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
        maxHeight: 'calc(100vh - 240px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        setIDSolicitud(row.original.id);
        setModoEdicion(false);
        handleClickOpen();
      },
    }),
    muiTableBodyCellProps: () => ({
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
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
        <h2
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          {vista?.toUpperCase()}
        </h2>

        <Button
          radius="full"
          className='text-white'
          startContent={<i className="bi bi-plus-lg"></i>}
          color='primary'
          size='sm'
          onPress={() => {
            setIDSolicitud(null);
            setModoEdicion(true);
            handleClickOpen();
          }}
        >
          Nueva solicitud
        </Button>

        <Button
          radius="full"
          className='text-white'
          startContent={<i className="bi bi-arrow-clockwise"></i>}
          color='secondary'
          onPress={() => fetchData()}
          size='sm'
        >Actualizar
        </Button>

        <Button
          radius="full"
          color='success'
          className='text-white'
          startContent={<i className="bi bi-file-earmark-excel"></i>}
          size='sm'
          onPress={() => exportToCSV(dataSolicitudes, columns, "solicitudes.csv")}>
          Exportar
        </Button>

      </Box >
    ),
  });

  return (
    <>
      <MaterialReactTable
        table={table}
      />

      <SolicitudForm id_solicitud={id_solicitud} open={open} handleClose={handleClose} setID={setIDSolicitud} travel_id={travel_id} onSaveSuccess={undefined} x_tipo={undefined} vista={undefined}></SolicitudForm>
    </>
  );
};

export default SolicitudesLlantas;
