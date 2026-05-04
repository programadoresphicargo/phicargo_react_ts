import {
  MRT_Cell,
  MRT_ExpandAllButton,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button, Tooltip } from '@heroui/react';
import { Chip } from "@heroui/react";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { exportToCSV } from '../../utils/export';
import odooApi from '@/api/odoo-api';
import { DateRangePicker } from 'rsuite';
import NavbarTravel from '../navbar_viajes';
import Travel from '../control/viaje';
import { Stack } from '@mui/material';

type PDV = {
  id_viaje: number;
  x_comentarios_maniobra?: string;
};

const PDV = ({ }) => {

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [range, setRange] = useState<[Date, Date] | null>([firstDay, lastDay]);
  const [grouping, setGrouping] = useState(['sucursal', 'date_order']);

  const [open, setOpen] = React.useState(false);
  const [idViaje, setIDViaje] = React.useState<number | null>(null);

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
          date_end: range[1].toISOString().slice(0, 10)
        }
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  const columns = useMemo(
    () => [
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
        accessorKey: "x_status_bel",
        header: "Estatus",
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();

          type StatusKey =
            | "sm"
            | "pm"
            | "P"
            | "V"
            | "Ing"
            | "PR"
            | "ER"
            | "PI"
            | "EI"
            | "T"
            | "ru"
            | "EV";

          type StatusConfig = {
            color: "secondary" | "primary" | "success" | "warning" | "danger" | "default";
            text: string;
          };

          const map: Record<StatusKey, StatusConfig> = {
            sm: { color: "secondary", text: "SIN MANIOBRA" },
            pm: { color: "primary", text: "PATIO MÉXICO" },
            P: { color: "primary", text: "EN PATIO" },
            V: { color: "success", text: "EN VIAJE" },
            Ing: { color: "warning", text: "INGRESADO" },
            PR: { color: "success", text: "PROGRAMADO PARA RETIRO" },
            ER: { color: "success", text: "EN PROCESO DE RETIRO" },
            PI: { color: "warning", text: "PROGRAMADO PARA INGRESO" },
            EI: { color: "warning", text: "EN PROCESO DE INGRESO" },
            T: { color: "danger", text: "EN TERRAPORTS" },
            ru: { color: "danger", text: "REUTILIZADO" },
            EV: { color: "secondary", text: "EN ESPERA DE VIAJE" },
          };

          const cfg: StatusConfig =
            value && value in map
              ? map[value as StatusKey]
              : { color: "default", text: value || "N/A" };

          return (
            <Chip
              color={cfg.color}
              size="sm"
              className="text-white"
              radius="full"
            >
              {cfg.text}
            </Chip>
          );
        }
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
    ],
    [],
  );

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
      return {
        onClick: () => {
          handleClickOpen();
          setIDViaje(row.original.id_viaje);
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
      return {
        sx: {
          backgroundColor: row.subRows?.length ? '#0456cf' : '#FFFFFF',
          color: row.subRows?.length ? '#FFFFFF' : '#000000',
          fontFamily: 'Inter',
          fontWeight: 'normal',
          fontSize: '12px',
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
          PDV
        </h1>
        <DateRangePicker
          value={range}
          onChange={(value) => setRange(value)}
          placeholder="Selecciona un rango de fechas"
          format="yyyy-MM-dd"
          loading={isLoading}
        />
        <Button color='primary' startContent={<i className="bi bi-arrow-clockwise"></i>} onPress={() => fetchData()} radius='full'>Actualizar</Button>
        <Button color='success' className='text-white' startContent={<i className="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, "programacion_viajes.csv")} radius='full'>Exportar</Button>
      </Box >
    ),
  });

  return (
    <>
      <NavbarTravel></NavbarTravel>
      <MaterialReactTable table={table} />
      <Travel idViaje={idViaje} open={open} handleClose={handleClose}></Travel>
    </>
  );
};

export default PDV;
