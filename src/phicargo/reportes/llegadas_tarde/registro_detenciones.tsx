import { Button, Chip } from "@heroui/react";
import { MRT_Cell, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { DateRangePicker } from 'rsuite';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import CustomNavbar from "@/pages/CustomNavbar";
import { pages } from './pages';
import DetencionDetail from "./form";

interface DepartureArrival {
  referencia: string;
  sucursal: string;
  x_status_viaje: string;
  ruta: string;
  driver: string;
  departure_status: string;
  arrival_status: string;
  [key: string]: any;
}

const DetencionesTable = () => {

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [range, setRange] = useState<[Date, Date]>([firstDay, lastDay]);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<DepartureArrival[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [id_detencion, setDetencion] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, [range, open]);

  const fetchData = async () => {
    try {
      if (!range) {
        throw new Error('Las fechas de inicio y fin son obligatorias.');
      }

      setLoading(true);
      const response = await odooApi.get('/tms_travel/reportes_estatus_viajes/travel_detentions/', {
        params: {
          fecha_inicio: range[0].toISOString().slice(0, 10),
          fecha_fin: range[1].toISOString().slice(0, 10),
        },
      });
      setData(response.data);
    } catch (error: any) {
      const errorMessage = error.response
        ? `Error: ${error.response.status} - ${error.response.data.message}`
        : error.message;

      toast.error('Error al enviar los datos: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'viaje', header: 'Viaje' },
    { accessorKey: 'start_date', header: 'Inicio' },
    { accessorKey: 'end_date', header: 'Fin' },
    { accessorKey: 'usuario_creacion', header: 'Usuario creación' },
    {
      accessorKey: 'approved',
      header: 'Aprobado',
      Cell: ({ cell }: { cell: MRT_Cell<DepartureArrival> }) => {
        const valor = cell.getValue<boolean | null>() ?? null;

        return (
          <Chip
            color={valor === null ? "default" : valor ? "success" : "danger"}
            size="sm"
            className="text-white"
          >
            {valor === null
              ? "Pendiente"
              : valor
                ? "Aprobado"
                : "Rechazado"}
          </Chip>
        );
      },
    },
    { accessorKey: 'usuario_aprobo', header: 'Usuario aprobó/rechazo' },
    { accessorKey: 'approved_date', header: 'Fecha aprobación/rechazo' },
  ];

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading },
    positionToolbarAlertBanner: 'bottom',
    localization: MRT_Localization_ES,
    initialState: {
      showGlobalFilter: true,
      density: 'compact',
      expanded: true,
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
        maxHeight: 'calc(100vh - 200px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        setDetencion(row.original.id)
        setOpen(true);
      },
    }),
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length ? '#0456cf' : '#FFFFFF',
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
        <h1
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Reporte de detenciones
        </h1>
        <DateRangePicker
          value={range}
          onChange={(value) => {
            if (value) {
              setRange(value as [Date, Date]);
            }
          }}
          placeholder="Selecciona un rango de fechas"
          format="yyyy-MM-dd"
        />

        <Button
          color='success'
          className="text-white"
          startContent={<FileDownloadIcon />}
          radius="full"
        >
          Exportar
        </Button>

        <Button
          color='secondary'
          onPress={() => fetchData()}
          radius="full"
        >
          Refrescar
        </Button>
      </Box >
    ),
  });

  return (
    <>
      <CustomNavbar pages={pages}></CustomNavbar>
      <MaterialReactTable
        table={table}
      />
      {id_detencion && (
        <DetencionDetail open={open} onClose={() => setOpen(false)} id_detencion={id_detencion}></DetencionDetail>
      )}
    </>
  );
};

export default DetencionesTable;
