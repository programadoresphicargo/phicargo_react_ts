import { Button, Chip, DatePicker } from "@heroui/react";
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
import { DateRangePicker } from 'rsuite';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import CustomNavbar from "@/pages/CustomNavbar";

const DetencionesTable = () => {

  const departureTranslations = {
    no_info: 'Sin información',
    start_early: 'Salió temprano',
    start_late: 'Salió tarde SIN justificación',
    start_late_justified: 'Salió tarde PERO tiene justificación',
    in_time: 'A tiempo',
    late: 'Va tarde',
  };

  const arrivalTranslations = {
    arrived_late: 'Llegó tarde SIN justificación',
    arrived_late_justified: 'Llegó tarde PERO tiene justificación',
    arrived_early: 'Llegó temprano',
    no_info: 'Sin información',
    no_arrival_recorded: 'Sin registro de llegada',
  };

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [range, setRange] = useState([firstDay, lastDay]);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [range]);

  const fetchData = async () => {
    try {
      if (!range) {
        throw new Error('Las fechas de inicio y fin son obligatorias.');
      }

      setLoading(true);
      const response = await odooApi.get(`/tms_travel/salidas_llegadas/${range[0].toISOString().slice(0, 10)}/${range[1].toISOString().slice(0, 10)}`);
      setData(response.data);
    } catch (error) {
      const errorMessage = error.response
        ? `Error: ${error.response.status} - ${error.response.data.message}`
        : error.message;

      toast.error('Error al enviar los datos: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const columns = [
    { accessorKey: 'referencia', header: 'Referencia' },
    { accessorKey: 'sucursal', header: 'Sucursal' },
    { accessorKey: 'x_status_viaje', header: 'Estado del viaje' },
    { accessorKey: 'ruta', header: 'Ruta' },
    { accessorKey: 'driver', header: 'Operador' },
    { accessorKey: 'inicio_programado', header: 'Inicio programado', },
    { accessorKey: 'fecha_inicio', header: 'Fecha inicio' },
    { accessorKey: 'diferencia_tiempo_salida', header: 'Diferencia tiempo salida' },
    {
      accessorKey: 'departure_status',
      header: 'SALIDA',
      Cell: ({ cell }) => {
        const raw = cell.getValue() || '';

        // Colores del Chip según el estado traducido
        const colores = {
          'Salió tarde PERO tiene justificación': 'success',
          'Salió tarde SIN justificación': 'danger',
          'Va tarde': 'warning',
          'Llegó temprano': 'success',
          'Salió temprano': 'success',
          'A tiempo': 'primary',
          'Sin información': 'primary',
        };

        const valorTraducido = departureTranslations[raw] || raw;
        const colorChip = colores[valorTraducido] || 'primary';

        return (
          <Chip className="text-white" color={colorChip} size="sm">
            {valorTraducido}
          </Chip>
        );
      },
    },
    { accessorKey: 'nombre_justificacion_salida', header: 'Estatus justificante' },
    { accessorKey: 'llegada_planta_programada', header: 'Llegada a planta programada' },
    { accessorKey: 'llegada_planta', header: 'Llegada a planta reportada' },
    { accessorKey: 'diferencia_tiempo_llegada', header: 'Diferencia tiempo planta' },
    {
      accessorKey: 'arrival_status',
      header: 'LLEGADA',
      Cell: ({ cell }) => {
        const raw = cell.getValue() || '';

        const colores = {
          'Llegó tarde SIN justificación': 'danger',
          'Llegó tarde PERO tiene justificación': 'success',
          'Llegó temprano': 'success',
          'Sin información': 'primary',
          'Sin registro de llegada': 'primary'
        };

        const label = arrivalTranslations[raw] || raw; // si llega otro valor, lo mostramos tal cual
        const color = colores[label] || 'primary';

        return (
          <Chip color={color} size="sm" className="text-white">
            {label}
          </Chip>
        );
      },
    },
    { accessorKey: 'nombre_justificacion_llegada', header: 'Estatus justificante' },
    { accessorKey: 'fecha_finalizado', header: 'Fecha finalizado' },
  ];

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const handleExportData = () => {
    const formattedData = data.map((row) => ({
      ...row,
      departure_status:
        departureTranslations[row.departure_status] || row.departure_status,
      arrival_status:
        arrivalTranslations[row.arrival_status] || row.arrival_status,
    }));

    const csv = generateCsv(csvConfig)(formattedData);
    download(csvConfig)(csv);
  };

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
      pagination: { pageSize: 80 },
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
          flexWrap: 'wrap',
        }}
      >
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Salidas y llegadas tarde
        </h1>
        <DateRangePicker
          value={range}
          onChange={(value) => setRange(value)}
          placeholder="Selecciona un rango de fechas"
          format="yyyy-MM-dd"
        />

        <Button
          color='success'
          className="text-white"
          onPress={handleExportData}
          startContent={<FileDownloadIcon />}
          radius="full"
        >
          Exportar
        </Button>

        <Button
          color='danger'
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
      <CustomNavbar></CustomNavbar>
      <MaterialReactTable
        table={table}
      />
    </>
  );
};

export default DetencionesTable;
