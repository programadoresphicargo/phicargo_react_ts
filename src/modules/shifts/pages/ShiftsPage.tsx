import { ExportConfig, ExportToExcel } from '@/utilities';
import { IconButton, Tooltip } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@heroui/react';
import ExportExcelButton from '@/components/ui/buttons/ExportExcelButton';
import { HiQueueList } from 'react-icons/hi2';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { Shift } from '../models/shift-model';
import { useReorderShifts } from '../hooks/useReorderShifts';
import { useShiftColumns } from '../hooks/useShiftColumns';
import { useShiftQueries } from '../hooks/useShiftQueries';
import { useEffect, useState } from 'react';
import odooApi from '@/api/odoo-api';
import { DateRangePicker } from 'rsuite';

const ShiftsPage = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [range, setRange] = useState<[Date, Date]>([firstDay, lastDay]);

  type KmData = {
    total_km: number | null;
  };

  const [kmByKey, setKmByKey] = useState<Record<string, KmData>>({});

  const navigate = useNavigate();
  const { columns } = useShiftColumns(kmByKey);
  const {
    shiftQuery: { data: shifts, isFetching, refetch },
  } = useShiftQueries();

  const shiftsData = shifts ?? [];
  const { data, handleRowOrderChange, saveChanges } = useReorderShifts(
    shiftsData,
  );

  const location = useLocation();
  const isCrearOpen = location.pathname.startsWith('/turnos/crear');
  const isDetailsOpen = location.pathname.startsWith('/turnos/detalles');
  const isHistoryOpen = location.pathname.startsWith('/turnos/historial-asignado');

  useEffect(() => {
    if (!isDetailsOpen || !isHistoryOpen || !isCrearOpen) {
      refetch();
    }
  }, [isDetailsOpen, isHistoryOpen, isCrearOpen]);


  const onOpenDetails = (id: number) => {
    navigate(`/turnos/detalles/${id}`);
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const payload = data.map(s => ({
      shift: s.shift,
      driver_id: s.driver.id,
    }));

    console.log(range[0].toISOString().slice(0, 10));

    const fetchKmBatch = async () => {
      try {
        const res = await odooApi.post(
          '/shifts/km-batch',
          payload, // 👈 el BODY ES SOLO la lista
          {
            params: {
              date_start: range[0].toISOString().slice(0, 10),
              date_end: range[1].toISOString().slice(0, 10),
            },
          }
        );
        const result = await res.data;
        setKmByKey(result);
      } catch (error) {
        console.error('Error obteniendo km batch', error);
      }
    };

    fetchKmBatch();
  }, [data]);

  const table = useMaterialReactTable<Shift>({
    // DATA
    columns,
    data: data,
    localization: MRT_Localization_ES,
    enableStickyHeader: true,
    autoResetPageIndex: false,
    // PAGINATION, FILTERS, SORTING
    enableRowActions: false,
    enableRowOrdering: true,
    enableSorting: false,
    enableGrouping: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    columnFilterDisplayMode: 'subheader',
    getRowId: (row) => String(row.id),
    // STATE
    initialState: {
      showColumnFilters: false,
      density: 'compact',
      pagination: { pageSize: 100, pageIndex: 0 },
      columnPinning: {
        right: ['mrt-row-actions'],
      },
    },
    state: {
      showProgressBars: isFetching,
    },
    // CUSTOMIZATIONS
    // renderRowActionMenuItems: ({ row }) =>
    //   getRowActionMenuItems(row.original),
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => onOpenDetails(row.original.id),
      sx: { cursor: 'pointer' },
    }),
    muiRowDragHandleProps: ({ table, row }) => ({
      disabled: row.original.locked,
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.getState();
        handleRowOrderChange(draggingRow, hoveredRow);
        saveChanges();
      },
    }),
    renderTopToolbarCustomActions: () => (
      <div className="flex items-center gap-4">
        <h1 className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text">
          Control de turnos
        </h1>
        <Button
          color='primary'
          onPress={() => navigate('/turnos/crear')}
          radius='full'
          size='sm'
          startContent={<i className="bi bi-plus-circle"></i>}>
          Ingresar turno
        </Button>
        <Button
          radius="full"
          size='sm'
          color="secondary"
          startContent={<HiQueueList />}
          onPress={() => navigate('/turnos/cola')}
        >
          Operadores en cola
        </Button>
        <Button
          radius="full"
          size='sm'
          color="success"
          className='text-white'
          startContent={<HiQueueList />}
          onPress={() => navigate('/turnos/historial-asignado')}
        >
          Historial
        </Button>
        <ExportExcelButton
          size="small"
          onClick={() => exportTo.exportData(data)}
        />
        <Tooltip arrow title="Refrescar">
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        <div style={{ display: 'flex', flexDirection: 'row', gap: 6, alignItems: 'center', }}>
          <label style={{ fontWeight: 600 }}>
            Rango km recorridos
          </label>

          <DateRangePicker
            value={range}
            onChange={(value) => {
              if (value && value.length === 2) {
                setRange(value as [Date, Date]);
                refetch();
              }
            }}
            placeholder="Selecciona un rango de fechas"
            format="yyyy-MM-dd"
          />
        </div>
      </div>
    ),
    muiTableContainerProps: {
      sx: {
        height: 'calc(100vh - 212px)',
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    defaultColumn: {
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
          fontSize: '12px',
          padding: '2px'
        },
      },
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <Outlet />
    </>
  );
};

export default ShiftsPage;

const exportConf: ExportConfig<Shift> = {
  fileName: 'Turnos',
  withDate: true,
  columns: [
    { accessorFn: (data) => data.shift, header: 'Turno', columnWidth: 50 },
    { accessorFn: (data) => data.driver.name, header: 'Operador' },
    { accessorFn: (data) => data.driver.modality, header: 'Licencia' },
    {
      accessorFn: (data) => (data.driver.isDangerous ? 'SI' : 'NO'),
      header: 'Peligroso',
    },
    { accessorFn: (data) => data.vehicle.name, header: 'Unidad' },
    {
      accessorFn: (data) => data.arrivalAt.format('DD/MM/YYYY hh:mm A'),
      header: 'Llegada',
    },
    { accessorFn: (data) => data.maneuver1, header: 'Maniobra #1' },
    { accessorFn: (data) => data.maneuver2, header: 'Maniobra #2' },
    { accessorFn: (data) => data.comments, header: 'Comentarios' },
  ],
};

const exportTo = new ExportToExcel(exportConf);

