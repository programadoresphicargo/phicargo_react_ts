import {
  Button,
} from "@heroui/react"
import {
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import { DateRangePicker } from "rsuite";
import EstadiasForm from "./estadia_form";

export type Estadia = {
  travel_id: number;
  travel_name: string;
  cliente: string;
  x_horas_estadias: number;
  employee_name: string;
  x_horas_gracia: number;
  llegada_planta_programada: string;
  llegada_planta: string;
  salida_planta: string;
  diferencia_llegada_planta: string;
  horas_estadia_real: number;
  cortes_calculados: number;
  horas_planta: number;
}

const RegistrosEstadias = () => {

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [range, setRange] = useState<[Date, Date] | null>([firstDay, lastDay]);

  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<Estadia[]>([]);
  const [travel_id, setTravel] = useState<number | null>(null);

  const [filters, setFilters] =
    useState<MRT_ColumnFiltersState>([
      {
        id: 'genero_estadias',
        value: 'genero',
      },
    ]);


  useEffect(() => {
    fetchData();
  }, [range]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = (travel_id: number) => {
    setOpen(true);
    setTravel(travel_id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = async () => {
    if (!range) return;

    const startDate = range[0].toISOString().slice(0, 10);
    const endDate = range[1].toISOString().slice(0, 10);

    try {
      setLoading(true);
      const response = await odooApi.get('/tms_travel/reporte_estadias/', {
        params: { fecha_inicio: startDate, fecha_fin: endDate },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo<MRT_ColumnDef<Estadia>[]>(
    () => [
      { accessorKey: 'travel_name', header: 'Referencia' },
      { accessorKey: 'cliente', header: 'Cliente' },
      { accessorKey: 'x_horas_gracia', header: 'Horas iniciales gratis' },
      { accessorKey: 'x_horas_estadias', header: 'Horas estadias' },
      { accessorKey: 'llegada_planta_programada', header: 'Llegada planta programada' },
      { accessorKey: 'llegada_planta', header: 'Llegada planta' },
      { accessorKey: 'diferencia_llegada_planta', header: 'Diferencia' },
      { accessorKey: 'salida_planta', header: 'Salida planta' },
      { accessorKey: 'horas_planta', header: 'Tiempo en planta (horas)' },
      { accessorKey: 'horas_excedidas', header: 'Horas excedidas' },
      { accessorKey: 'cortes_calculados', header: 'Cortes calculados' },
      { accessorKey: 'genero_estadias', header: 'Genero estadias', filterVariant: 'select', filterValue: 'genero', },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableFacetedValues: true,
    onColumnFiltersChange: setFilters,
    state: { showProgressBars: isLoading, columnFilters: filters },
    localization: MRT_Localization_ES,
    initialState: {
      showColumnFilters: true,
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 80 },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        handleClickOpen(row.original.travel_id);
      },
      style: {
        cursor: 'pointer',
      },
    }),
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
        maxHeight: 'calc(100vh - 205px)',
      },
    },
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
          Control de estadías
        </h1>
        <DateRangePicker
          value={range}
          onChange={(value) => setRange(value)}
          placeholder="Selecciona un rango de fechas"
          format="yyyy-MM-dd"
          loading={isLoading}
        />
        <Button color="success" onPress={() => fetchData()} className="text-white" radius="full">
          Recargar
        </Button>
      </Box>
    ),
  });

  return (<>
    <MaterialReactTable table={table} />
    {travel_id && (
      <EstadiasForm open={open} handleClose={handleClose} travel_id={travel_id}></EstadiasForm>
    )}
  </>
  );
};

export default RegistrosEstadias;
