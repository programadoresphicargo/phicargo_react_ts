import { Button, Chip, DatePicker, NumberInput } from "@heroui/react";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import React, { useEffect, useState } from 'react';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { getLocalTimeZone, parseDate } from "@internationalized/date";

import Badge from 'react-bootstrap/Badge';
import { Box } from '@mui/material';
import { Component } from "react";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from 'axios';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { useDateFormatter } from "@react-aria/i18n";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { exportToCSV } from '../utils/export';
import { DateRangePicker } from 'rsuite';
import CustomNavbar from "@/pages/CustomNavbar";

const ViajesTipoArmado = () => {

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), 0, 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [range, setRange] = useState([firstDay, lastDay]);

  const [isLoading, setisLoading] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [range]);

  const fetchData = async () => {
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
    try {
      setisLoading(true);
      const response = await odooApi.get(`/drivers/correo_viajes_tipo_armado/?date_start=${range[0].toISOString().slice(0, 10)}&date_end=${range[1].toISOString().slice(0, 10)}`);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const columns = [
    { accessorKey: 'periodo', header: 'Periodo' },
    { accessorKey: 'year', header: 'Año' },

    {
      accessorKey: 'sencillo',
      header: 'Sencillos',
      aggregationFn: 'sum',
      AggregatedCell: ({ cell }) => (
        <strong>{cell.getValue()}</strong>
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
      aggregationFn: 'sum',
      AggregatedCell: ({ cell }) => (
        <strong>{cell.getValue()}</strong>
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
      aggregationFn: 'sum',
      AggregatedCell: ({ cell }) => (
        <strong>{cell.getValue()}</strong>
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
      aggregationFn: 'sum',
      AggregatedCell: ({ cell }) => (
        <strong>{cell.getValue()}</strong>
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
    enableColumnAggregations: true,
    columnResizeMode: "onEnd",
    initialState: {
      grouping: ["year"],
      density: 'compact',
      expanded: true,
      pagination: { pageSize: 80 },
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
    renderTopToolbarCustomActions: ({ table }) => (
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
