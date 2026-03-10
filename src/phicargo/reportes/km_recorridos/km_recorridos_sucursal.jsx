import { Button, Chip, NumberInput } from "@heroui/react";
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
import { exportToCSV } from '../../utils/export';
import { DateRangePicker } from 'rsuite';

const KMRecorridosSucursal = () => {

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
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
      const response = await odooApi.get(`/tms_waybill/km_recorridos_sucursal/?date_start=${range[0].toISOString().slice(0, 10)}&date_end=${range[1].toISOString().slice(0, 10)}`);
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
      const response = await odooApi.get(`/drivers/correo_licencias_vencidas/`);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const columns = [
    { accessorKey: 'sucursal', header: 'Sucursal', },
    { accessorKey: 'year', header: 'Año' },
    { accessorKey: 'month', header: 'Periodo' },
    { accessorKey: 'distance', header: 'Distancia' },
    { accessorKey: 'travels_full', header: 'Viajes Full' },
    { accessorKey: 'travels_single', header: 'Viajes Sencillos' },
    { accessorKey: 'travels', header: 'Total viajes' },
  ];

  const table = useMaterialReactTable({
    columns,
    data,
    state: { showProgressBars: isLoading },
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      expanded: false,
      pagination: { pageSize: 80 },
      showColumnFilters: true,
      grouping: ["year", "month"]
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
        maxHeight: 'calc(100vh - 250px)',
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.original?.dias_restantes <= 0
          ? '#fa022f'
          : row.subRows?.length
            ? '#0456cf'
            : '#FFFFFF',

        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',

        color: row.original?.dias_restantes <= 0
          ? '#FFFFFF'
          : row.subRows?.length
            ? '#FFFFFF'
            : '#000000',
      }
    }),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'nowrap',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Sucursal
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
          style={{ flex: 1 }}
        >
          Enviar correo
        </Button>

        <Button
          onPress={() => exportToCSV(data, columns, "sucursal.csv")}
          color="success"
          className="text-white"
          radius="full"
          style={{ flex: 1 }}
        >
          Exportar
        </Button>

        <Button
          onPress={() => fetchData()}
          color="danger"
          className="text-white"
          radius="full"
          style={{ flex: 1 }}
        >
          Recargar
        </Button>
      </Box>
    ),
  })

  return (
    <>
      <MaterialReactTable
        table={table}
      />
    </>
  );
};

export default KMRecorridosSucursal;
