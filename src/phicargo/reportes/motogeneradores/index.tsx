import {
  MRT_Cell,
  MRT_ColumnDef,
  MRT_ExpandAllButton,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Button, Tooltip } from '@heroui/react';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { exportToCSV } from '../../utils/export';
import odooApi from '@/api/odoo-api';
import { DateRangePicker } from 'rsuite';
import { Stack } from '@mui/material';
import AsignacionMG from './asignacion_mg';

type PDV = {
  id_viaje: number;
  x_comentarios_maniobra?: string;
  date_order: string;
};

const PDVMaintenance = ({ }) => {

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [range, setRange] = useState<[Date, Date] | null>([firstDay, lastDay]);
  const [grouping, setGrouping] = useState(['sucursal', 'date_order']);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!range) return;
    try {
      setLoading(true);
      const response = await odooApi.get('/tms_waybill/pdv/', {
        params: {
          date_start: range[0].toISOString().slice(0, 10),
          date_end: range[1].toISOString().slice(0, 10),
          refrigerado: true,
        }
      });

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const filteredData = response.data.filter((item: any) => {
        const dateOrder = new Date(item.date_order);
        return dateOrder >= yesterday;
      });

      setData(filteredData);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  const columns: MRT_ColumnDef<PDV>[] = [
    {
      accessorKey: 'vehiculo',
      header: 'Vehiculo programado',
    },
    {
      accessorKey: 'operador',
      header: 'Operador programado',
    },
    {
      accessorKey: 'x_comentarios_maniobra',
      header: 'Comentarios maniobra',
      Cell: ({ cell }: { cell: MRT_Cell<PDV> }) => {

        const value = cell.getValue<string>();

        return (
          <Tooltip
            color="foreground"
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">Comentarios</div>
                <div className="text-tiny">{value}</div>
              </div>
            }>
            <span className="truncate block max-w-xs cursor-pointer">
              {value}
            </span>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'date_order',
      header: 'Fecha',
    },
    {
      accessorKey: 'sucursal',
      header: 'Sucursal',
    },
    {
      accessorKey: 'terminal',
      header: 'Terminal',
    },
    {
      accessorKey: 'operador_maniobra',
      header: 'Operador maniobra',
    },
    {
      accessorKey: 'vehiculo_maniobra',
      header: 'Vehiculo maniobra',
    },
    {
      accessorKey: 'referencias',
      header: 'Contenedores',
    },
    {
      accessorKey: 'categoria',
      header: 'Categoria',
    },
    {
      accessorKey: 'cliente',
      header: 'Cliente',
    },
    {
      accessorKey: 'client_order_ref',
      header: 'Referencia cliente',
    },
    {
      accessorKey: 'x_ruta_bel',
      header: 'Ruta',
    },
    {
      accessorKey: 'x_tipo_bel',
      header: 'Tipo armado',
    },
    {
      accessorKey: 'x_modo_bel',
      header: 'Modo',
    },
    {
      accessorKey: 'ip',
      header: 'Inicio programado',
    },
    {
      accessorKey: 'lpp',
      header: 'Llegada a planta',
    },
    {
      accessorKey: 'cartas_porte',
      header: 'Carta porte',
    },
    {
      accessorKey: 'referencia_viaje',
      header: 'Viaje',
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: {
      grouping,
      showProgressBars: isLoading,
    },
    onGroupingChange: setGrouping,
    groupedColumnMode: "remove",
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionToolbarAlertBanner: "bottom",
    localization: MRT_Localization_ES,
    columnResizeMode: "onEnd",
    initialState: {
      grouping: ['sucursal', 'date_order'],
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
    displayColumnDefOptions: {
      'mrt-row-expand': {
        Header: () => (
          <Stack direction="row" alignItems="center">
            <MRT_ExpandAllButton table={table} />
            <Box>Grupos</Box>
          </Stack>
        ),
        GroupedCell: ({ row, table }) => {
          const { grouping } = table.getState();

          return grouping.map((col) => {
            const value = row.getValue<string>(col);

            return (
              <span key={col}>
                <strong>{value}</strong>{' '}
              </span>
            );
          });
        },
      },
    },
    muiTableBodyRowProps: ({ row }) => {
      const isGrouped = row.getIsGrouped();

      return {
        onClick: () => {
          if (isGrouped) return;

          const selection = window.getSelection()?.toString();
          if (selection) return;

          handleClickOpen();
        },
        style: {
          color: '#ffcccc',
          cursor: 'pointer',
        },
      };
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 200px)',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTopToolbarProps: {
      sx: {
        background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
        color: 'white',
        '& .MuiSvgIcon-root': {
          color: 'white',   // 🎨 iconos en blanco
        },
        '& .MuiButton-root': {
          color: 'white',   // texto de botones en blanco
        },
        '& .MuiInputBase-root': {
          color: 'white',   // texto del buscador
        },
        '& .MuiInputBase-root .MuiSvgIcon-root': {
          color: 'white',   // icono de lupa en blanco
        },
      },
    },
    muiTableBodyCellProps: ({ row }) => {

      const date_order = row.original.date_order;
      const hoy = new Date();
      const fecha = hoy.toISOString().split('T')[0];

      let backgroundColor = '';
      let ColorText = '';

      if (date_order === fecha) {
        backgroundColor = '#FFDE21';
        ColorText = '#000000';
      } else {
        backgroundColor = '#0456cf';
        ColorText = '#FFFFFF';
      }

      return {
        sx: {
          backgroundColor: row.subRows?.length ? backgroundColor : '#FFFFFF',
          color: row.subRows?.length ? ColorText : '#000000',
          fontFamily: 'Inter',
          fontWeight: 'normal',
          fontSize: '12px',
          padding: '2px 8px'
        },
      }
    },
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
          className="font-semibold lg:text-2xl"
        >
          Plan de viaje
        </h1>
        <DateRangePicker
          value={range}
          onChange={(value) => setRange(value)}
          placeholder="Selecciona un rango de fechas"
          format="yyyy-MM-dd"
          loading={isLoading}
        />
        <Button color='primary' startContent={<i className="bi bi-arrow-clockwise"></i>} onPress={() => fetchData()} radius='md' size='sm'>Actualizar</Button>
        <Button color='success' size='sm' className='text-white' startContent={<i className="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, "programacion_viajes.csv")} radius='md'>Exportar</Button>
      </Box >
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <AsignacionMG open={open} handleClose={handleClose}></AsignacionMG>
    </>
  );
};

export default PDVMaintenance;
