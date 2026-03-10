import { Button, Chip, DatePicker, NumberInput } from "@heroui/react";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import React, { useEffect, useState } from 'react';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import { DateRangePicker } from 'rsuite';
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

const KMRecorridosOperadores = ({ tipo_reporte }) => {

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
      let url;
      setisLoading(true);
      if (tipo_reporte == "operadores") {
        url = `/drivers/stats/?start_date=${range[0].toISOString().slice(0, 10)}&end_date=${range[1].toISOString().slice(0, 10)}`;
        const response = await odooApi.get(url);
        setData(response.data.distance_and_revenue_by_driver);
      } else if (tipo_reporte == "vehiculos") {
        url = `/vehicles/stats/?start_date=${range[0].toISOString().slice(0, 10)}&end_date=${range[1].toISOString().slice(0, 10)}`;
        const response = await odooApi.get(url);
        setData(response.data.distance_and_revenue_by_vehicle);
      } else if (tipo_reporte == "sucursal") {
        url = `/tms_waybill/km_recorridos_sucursal/?start_date=${range[0].toISOString().slice(0, 10)}&end_date=${range[1].toISOString().slice(0, 10)}`;
        const response = await odooApi.get(url);
        setData(response.data);
      }
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const EnviarCorreo = async () => {
    try {
      setisLoading(true);
      const response = await odooApi.get(`/drivers/correo_km_recorridos/`);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  let columnasExtra = [];

  if (tipo_reporte === 'operadores') {
    columnasExtra = [
      { accessorKey: 'driver', header: 'Operador' },
    ];
  }

  if (tipo_reporte === 'vehiculos') {
    columnasExtra = [
      { accessorKey: 'vehicle', header: 'Vehiculo' },
    ];
  }

  if (tipo_reporte === 'sucursal') {
    columnasExtra = [
      { accessorKey: 'sucursal', header: 'Sucursal' },
    ];
  }

  const columns = [
    ...columnasExtra,
    { accessorKey: 'year', header: 'Año' },
    { accessorKey: 'month', header: 'Periodo' },
    { accessorKey: 'distance', header: 'Distancia' },
    { accessorKey: 'travels_single', header: 'Viajes sencillos' },
    { accessorKey: 'travels_full', header: 'Viajes full' },
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
      grouping: ["year", "month"],
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
        maxHeight: 'calc(100vh - 240px)',
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length
          ? '#0456cf'
          : '#FFFFFF',

        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',

        color: row.subRows?.length
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
          alignItems: 'center',
        }}
      >
        <h1
          style={{ flex: 1 }}
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          {tipo_reporte}
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
          onPress={() => exportToCSV(data, columns, `${tipo_reporte}.csv`)}
          color="success"
          className="text-white"
          radius="full"
        >
          Exportar
        </Button>

        <Button
          onPress={() => fetchData()}
          color="danger"
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
      <MaterialReactTable
        table={table}
      />
    </>
  );
};

export default KMRecorridosOperadores;
