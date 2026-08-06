import {
  MRT_Cell,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button, Chip } from "@heroui/react"
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import { exportToCSV } from '@/phicargo/utils/export';
import SolicitudForm from '../../solicitud/form';

type Unidad = {
  x_solicitud_id: number;
  fecha_limite: string;
  vencido: boolean;
}

const TablaPrestamo = ({ }) => {

  const [open, setOpen] = React.useState(false);

  const [id_solicitud, setIDSolicitud] = React.useState<number | null>(null);

  const handleClickOpen = (id: number) => {
    setOpen(true);
    setIDSolicitud(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [dataEquipos, setDataEquipo] = useState<Unidad[]>([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/tms_travel/unidades_equipo/prestamos/');
      setDataEquipo(response.data);
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
        accessorKey: 'unidades',
        header: 'Folios Artículo',
      },
      {
        accessorKey: 'producto',
        header: 'Equipo / Artículo',
      },
      {
        accessorKey: 'x_tipo',
        header: 'Tipo',
        Cell: ({ cell }: { cell: MRT_Cell<Unidad> }) => {
          const estado = cell.getValue<string>();
          if (!estado) return null;
          return (
            <Chip
              size="sm"
              color={
                estado == "amarre" ? "success" :
                  estado == "epp" ? "primary" :
                    estado == "herramienta" ? "warning" : "default"
              }
              className="text-white"
            >
              {estado.toUpperCase() || "SIN ESTADO"}
            </Chip >
          );
        },
      },
      {
        accessorKey: 'x_solicitud_id',
        header: 'Solicitud Origen',
        Cell: ({ cell }: { cell: MRT_Cell<Unidad> }) => {
          const solicitud = cell.getValue<number>();

          return (
            <Chip
              size="sm"
              color="success"
              className="text-white"
            >
              {solicitud}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'fecha_solicitud',
        header: 'Fecha solicitud',
      },
      {
        accessorKey: 'empleado',
        header: 'Empleado',
      },
      {
        accessorKey: 'fecha_prestamo',
        header: 'Fecha prestamo',
      },
      {
        accessorKey: 'fecha_limite',
        header: 'Fecha limite',
        Cell: ({ row }: { row: MRT_Row<Unidad> }) => {
          const fecha_limite = row.original.fecha_limite;
          const vencido = row.original.vencido;

          if (!fecha_limite) return;

          return (
            <Chip
              size="sm"
              color={vencido ? "danger" : "success"}
              className="text-white"
            >
              {fecha_limite}
            </Chip>
          );
        },
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: dataEquipos,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionGlobalFilter: "right",
    localization: MRT_Localization_ES,
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      placeholder: `Buscar`,
      sx: { minWidth: '400px' },
      variant: 'outlined',
    },
    columnResizeMode: "onEnd",
    initialState: {
      showGlobalFilter: true,
      density: 'compact',
      showColumnFilters: true,
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
        maxHeight: 'calc(100vh - 240px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        handleClickOpen(row.original.x_solicitud_id);
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
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Registro de prestamos
        </h1>

        <Button
          className='text-white'
          radius='full'
          startContent={<i className="bi bi-arrow-clockwise"></i>}
          color='primary'
          isDisabled={false}
          onPress={() => fetchData()}
          size='sm'
        >Actualizar
        </Button>

        <Button
          radius='full'
          color='success'
          className='text-white'
          startContent={<i className="bi bi-file-earmark-excel"></i>}
          size='sm'
          onPress={() => exportToCSV(dataEquipos, columns, "inventario.csv")}>
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

      <SolicitudForm id_solicitud={id_solicitud} open={open} handleClose={handleClose} x_tipo={"epp"} setID={setIDSolicitud} vista={'solicitudes'} travel_id={null}></SolicitudForm>

    </>
  );
};

export default TablaPrestamo;
