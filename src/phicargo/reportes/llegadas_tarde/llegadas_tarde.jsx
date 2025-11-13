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
  function formatDateToYYYYMMDD(date) {
    return date.toISOString().slice(0, 10);
  }

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [range, setRange] = useState([firstDay, lastDay]);

  const [isLoading, setisLoading] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [range]);

  const fetchData = async () => {
    try {
      if (!range) {
        throw new Error('Las fechas de inicio y fin son obligatorias.');
      }

      setisLoading(true);
      const response = await odooApi.get(`/tms_travel/salidas_llegadas/${range[0].toISOString().slice(0, 10)}/${range[1].toISOString().slice(0, 10)}`);
      setData(response.data);
    } catch (error) {
      const errorMessage = error.response
        ? `Error: ${error.response.status} - ${error.response.data.message}`
        : error.message;

      toast.error('Error al enviar los datos: ' + errorMessage);
    } finally {
      setisLoading(false);
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
      accessorKey: 'departure_status', header: 'SALIDA', Cell: ({ cell }) => {
        const valor = cell.getValue() || '';
        var clase;

        if (valor === 'Salió tarde PERO tiene justificación') {
          clase = 'success';
        } else if (valor === 'Salió tarde SIN justificación') {
          clase = 'danger';
        } else if (valor === 'Va tarde') {
          clase = 'warning';
        } else if (valor === 'Llegó temprano') {
          clase = 'success';
        } else {
          clase = 'primary';
        }

        return (
          <Chip className="text-white" color={clase} size='sm'>
            {valor}
          </Chip>
        );
      },
    },
    { accessorKey: 'nombre_justificacion_salida', header: 'Estatus justificante' },
    { accessorKey: 'llegada_planta_programada', header: 'Llegada a planta programada' },
    { accessorKey: 'llegada_planta', header: 'Llegada a planta reportada' },
    { accessorKey: 'diferencia_tiempo_llegada', header: 'Diferencia tiempo planta' },
    {
      accessorKey: 'arrival_status', header: 'LLEGADA', Cell: ({ cell }) => {
        const valor = cell.getValue() || '';
        var clase;

        if (valor === 'Llegó tarde SIN justificación') {
          clase = 'danger';
        } else if (valor === 'Llegó tarde PERO tiene justificación') {
          clase = 'success';
        } else if (valor === 'Va tarde') {
          clase = 'warning';
        } else if (valor === 'Llegó temprano') {
          clase = 'success';
        } else {
          clase = 'primary';
        }

        return (
          <Chip color={clase} size='sm' className="text-white">
            {valor}
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

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };


  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading },
    enableRowSelection: true,
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
        Salidas y llegadas
        <DateRangePicker
          value={range}
          onChange={(value) => setRange(value)}
          placeholder="Selecciona un rango de fechas"
          format="yyyy-MM-dd"
        />

        <Button
          color='primary'
          onPress={handleExportData}
          startContent={<FileDownloadIcon />}
          radius="full"
        >
          Exportar todo
        </Button>

        <Button
          color='primary'
          isDisabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onPress={() => handleExportRows(table.getSelectedRowModel().rows)}
          startContent={<FileDownloadIcon />}
          radius="full"
        >
          Exportar seleccionado
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
