import { Button } from "@heroui/react";
import { MRT_Cell, MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { exportToCSV } from '../utils/export';
import { DateRangePicker } from 'rsuite';
import CustomNavbar from "@/pages/CustomNavbar";

type Viaje = {
  periodo: string;
  year: number;
  sencillo: number;
  sencillo_pct: number;
  full: number;
  full_pct: number;
  sin_especificar: number;
  sin_especificar_pct: number;
  total: number;
}

const ViajesTipoArmado = () => {

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), 0, 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [range, setRange] = useState<[Date, Date] | null>([firstDay, lastDay]);

  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState<Viaje[]>([]);

  useEffect(() => {
    fetchData();
  }, [range]);

  const fetchData = async () => {
    if (!range) return;
    try {
      setisLoading(true);
      const response = await odooApi.get(`/tms_waybill/viajes_tipo_armado/?date_start=${range[0].toISOString().slice(0, 10)}&date_end=${range[1].toISOString().slice(0, 10)}`);
      setData(response.data);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const EnviarCorreo = async () => {
    if (!range) return;
    try {
      setisLoading(true);
      const response = await odooApi.get(`/drivers/correo_viajes_tipo_armado/?date_start=${range[0].toISOString().slice(0, 10)}&date_end=${range[1].toISOString().slice(0, 10)}`);
      console.log(response.data);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const columns: MRT_ColumnDef<Viaje>[] = [
    { accessorKey: 'periodo', header: 'Periodo' },
    { accessorKey: 'year', header: 'Año' },
    {
      accessorKey: 'sencillo',
      header: 'Sencillos',
      aggregationFn: 'sum' as const,
      AggregatedCell: ({ cell }: { cell: MRT_Cell<Viaje> }) => (
        <strong>{cell.getValue<number>()}</strong>
      ),
      muiTableBodyCellProps: {
        align: 'right',
      },
    },
    {
      accessorKey: 'sencillo_pct', header: '%', muiTableBodyCellProps: {
        align: 'right',
      },
    },
    {
      accessorKey: 'full',
      header: 'Full',
      aggregationFn: 'sum' as const,
      AggregatedCell: ({ cell }: { cell: MRT_Cell<Viaje> }) => (
        <strong>{cell.getValue<number>()}</strong>
      ),
      muiTableBodyCellProps: {
        align: 'right',
      },
    },
    {
      accessorKey: 'full_pct', header: '%', muiTableBodyCellProps: {
        align: 'right',
      },
    },
    {
      accessorKey: 'sin_especificar',
      header: 'Sin tipo',
      aggregationFn: 'sum' as const,
      AggregatedCell: ({ cell }: { cell: MRT_Cell<Viaje> }) => (
        <strong>{cell.getValue<number>()}</strong>
      ),
      muiTableBodyCellProps: {
        align: 'right',
      },
    },
    {
      accessorKey: 'sin_especificar_pct', header: '%', muiTableBodyCellProps: {
        align: 'right',
      },
    },
    {
      accessorKey: 'total',
      header: 'Total',
      aggregationFn: 'sum' as const,
      AggregatedCell: ({ cell }: { cell: MRT_Cell<Viaje> }) => (
        <strong>{cell.getValue<number>()}</strong>
      ),
      muiTableBodyCellProps: {
        align: 'right',
      },
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data,
    state: { showProgressBars: isLoading },
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableBottomToolbar: true,
    localization: MRT_Localization_ES,
    positionToolbarAlertBanner: "bottom",
    columnResizeMode: "onEnd",
    initialState: {
      grouping: ["year"],
      density: 'compact',
      expanded: true,
      pagination: { pageIndex: 0, pageSize: 80 },
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
        maxHeight: 'calc(100vh - 220px)',
      },
    },
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
          alignItems: 'center',
        }}
      >
        <h1
          style={{ flex: 1 }}
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Viajes por tipo armado
        </h1>

        <DateRangePicker
          value={range}
          onChange={(value) => setRange(value)}
          placeholder="Selecciona un rango de fechas"
          format="yyyy-MM-dd"
          loading={isLoading}
        />

        <Button
          onPress={() => EnviarCorreo()}
          color="primary"
          radius="full"
        >
          Enviar correo
        </Button>

        <Button
          onPress={() => exportToCSV(data, columns, "tipo_armado.csv")}
          color="success"
          className="text-white"
          radius="full"
        >
          Exportar
        </Button>

        <Button
          onPress={() => fetchData()}
          color="warning"
          className="text-white"
          radius="full"
        >
          Recargar
        </Button>
      </Box>
    ),
  })

  return (
    <>
      <CustomNavbar></CustomNavbar>
      <MaterialReactTable
        table={table}
      />
    </>
  );
};

export default ViajesTipoArmado;
