import { Button } from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { ManiobraProvider } from '../context/viajeContext';
import { exportToCSV } from '../../utils/export';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { DateRangePicker } from 'rsuite';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import CustomNavbar from "@/pages/CustomNavbar";
import { pages } from '../pages';
import ReeferYardForm from "./dialog";
import * as React from 'react';

export type Contenedor = {
  id: number;
  id_cp: number;
  id_cliente: number;
  sucursal?: string;
  date_order?: string;
  carta_porte?: string;
  cliente?: string;
  x_reference?: string;
  x_status_bel?: string;
  estado_eir?: string;
  x_ejecutivo_viaje_bel?: string;
  state?: string;
  x_modo_bel?: string;
};

const ContenedoresRefrigerados = () => {

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [range, setRange] = useState<[Date, Date] | null>([firstDay, lastDay]);

  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<Contenedor[]>([]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [dataCP, setDataCP] = useState<Contenedor | null>(null);

  const fetchData = async () => {
    if (!range) return;
    setLoading(true);
    try {
      const response = await odooApi.get('/reefer_yard_stays/',
        {
          params: {
            start_date: range[0].toISOString().slice(0, 10),
            end_date: range[1].toISOString().slice(0, 10),
          }
        });
      setData(response.data);
    } catch (error) {
      toast.error('Error al obtener los datos:' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'date_order',
        header: 'Fecha',
      },
      {
        accessorKey: 'viaje',
        header: 'Viaje',
      },
      {
        accessorKey: 'carta_porte',
        header: 'Carta porte',
      },
      {
        accessorKey: 'cliente',
        header: 'Cliente',
      },
      {
        accessorKey: 'x_reference',
        header: 'Contenedor',
        size: 150,
      },
      {
        accessorKey: 'arrival_date_formatted',
        header: 'Llegada',
      },
      {
        accessorKey: 'stay_cutoff_date_formatted',
        header: 'Salida',
      },
      {
        accessorKey: 'status',
        header: 'Estado',
      },
      {
        accessorKey: 'maneuver_id',
        header: 'Maniobra',
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableColumnPinning: true,
    enableStickyHeader: true,
    localization: MRT_Localization_ES,
    positionToolbarAlertBanner: "bottom",
    positionGlobalFilter: "right",
    muiSearchTextFieldProps: {
      placeholder: `Buscador global`,
      sx: { minWidth: '300px' },
      variant: 'outlined',
    },
    initialState: {
      showColumnFilters: true,
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 80 },
      showGlobalFilter: true,
    },
    state: { showProgressBars: isLoading },
    muiCircularProgressProps: {
      color: 'primary',
      thickness: 5,
      size: 45,
    },
    muiSkeletonProps: {
      animation: 'pulse',
      height: 28,
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        if (row.subRows?.length) {
        } else {
          if (!row.original.id) return;
          handleClickOpen();
          setDataCP(row.original);
        }
      },
      style: {
        cursor: 'pointer',
      },
    }),
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
          alignItems: 'center',
        }}
      >
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Contenedores refrigerados
        </h1>
        <DateRangePicker
          style={{ minWidth: "250px" }}
          value={range}
          onChange={(value) => setRange(value)}
          placeholder="Selecciona un rango de fechas"
          format="yyyy-MM-dd"
        />
        <Button
          color='success'
          className='text-white'
          startContent={<i className="bi bi-file-earmark-excel"></i>}
          onPress={() => exportToCSV(data, columns, "contenedores.csv")}
          radius="full"
        >Exportar
        </Button>
        <Button
          color='danger'
          className='text-white'
          startContent={<i className="bi bi-arrow-clockwise"></i>}
          onPress={() => fetchData()}
          radius="full"
        >Recargar
        </Button>
      </Box>
    ),
  });

  return (
    <>
      <ManiobraProvider>
        <CustomNavbar pages={pages}></CustomNavbar>
        <MaterialReactTable table={table} />
        {dataCP && (
          <ReeferYardForm open={open} handleClose={handleClose} id={dataCP.id} />
        )}
      </ManiobraProvider>
    </>
  );
};

export default ContenedoresRefrigerados;
