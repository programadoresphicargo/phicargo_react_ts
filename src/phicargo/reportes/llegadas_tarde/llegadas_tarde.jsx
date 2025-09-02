import { Button, Chip, DatePicker } from "@heroui/react";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import React, { useEffect, useState } from 'react';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import Badge from 'react-bootstrap/Badge';
import { Box } from '@mui/material';
import { Component } from "react";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ResponsiveAppBar from '@/phicargo/saldos_contabilidad/Navbar';
import axios from 'axios';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { useDateFormatter } from "@react-aria/i18n";
import { DateRangePicker } from 'rsuite';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

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
    { accessorKey: 'travel_name', header: 'Referencia' },
    { accessorKey: 'sucursal', header: 'Sucursal' },
    { accessorKey: 'x_status_viaje', header: 'Estado del viaje' },
    { accessorKey: 'route_name', header: 'Ruta' },
    { accessorKey: 'employee_name', header: 'Operador' },
    { accessorKey: 'x_ejecutivo_viaje_bel', header: 'Ejecutivo' },
    { accessorKey: 'inicio_programado', header: 'Inicio programado', },
    { accessorKey: 'fecha_inicio', header: 'Fecha inicio' },
    { accessorKey: 'diferencia_tiempo', header: 'Diferencia tiempo salida' },
    {
      accessorKey: 'mensaje1', header: 'Mensaje', Cell: ({ cell }) => {
        const valor = cell.getValue() || '';
        var clase;

        if (valor === 'Salio tarde') {
          clase = 'danger';
        } else if (valor === 'Va tarde') {
          clase = 'warning';
        } else if (valor === 'Llegó temprano') {
          clase = 'primary';
        } else {
          clase = 'primary';
        }

        return (
          <Chip color={clase} size='sm'>
            {valor}
          </Chip>
        );
      },
    },
    { accessorKey: 'llegada_planta_programada', header: 'Llegada a planta programada' },
    { accessorKey: 'llegada_planta', header: 'Llegada a planta reportada' },
    { accessorKey: 'diferencia_llegada_planta', header: 'Diferencia tiempo planta' },
    {
      accessorKey: 'mensaje2', header: 'Mensaje', Cell: ({ cell }) => {
        const valor = cell.getValue() || '';
        var clase;

        if (valor === 'Llegó tarde') {
          clase = 'danger';
        } else if (valor === 'Va tarde') {
          clase = 'warning';
        } else if (valor === 'Llegó temprano') {
          clase = 'primary';
        } else {
          clase = 'primary';
        }

        return (
          <Chip color={clase} size='sm'>
            {valor}
          </Chip>
        );
      },
    },
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
        maxHeight: 'calc(100vh - 230px)',
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
        >
          Exportar seleccionado
        </Button>

        <Button
          color='danger'
          onPress={() => fetchData()}
        >
          Refrescar
        </Button>
      </Box >
    ),
  });

  return (
    <>
      <ResponsiveAppBar></ResponsiveAppBar>
      <MaterialReactTable
        table={table}
      />;
    </>
  );
};

export default DetencionesTable;
