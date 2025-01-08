import React, { useState, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import axios from 'axios';
import Badge from 'react-bootstrap/Badge';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { Box } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Component } from "react";
import { Button, DatePicker } from '@nextui-org/react';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import ResponsiveAppBar from '@/phicargo/saldos_contabilidad/Navbar';
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

const DetencionesTable = () => {

  const [isLoading, setisLoading] = useState('');
  const [fechaInicio, setFechaInicio] = React.useState(parseDate(new Date().toISOString().split('T')[0]));
  const [fechaFin, setFechaFin] = React.useState(parseDate(new Date().toISOString().split('T')[0]));

  const handleFechaInicioChange = (event) => {
    setFechaInicio(event.target.value);
  };

  const handleFechaFinChange = (event) => {
    setFechaFin(event.target.value);
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fechaInicio, fechaFin]);

  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await odooApi.get(`/tms_travel/salidas_llegadas/${fechaInicio}/${fechaFin}/`);
      setData(response.data);
      setisLoading(false);
      console.log(response.data);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  const columns = [
    { accessorKey: 'travel_name', header: 'Referencia' },
    { accessorKey: 'route_name', header: 'Ruta' },
    { accessorKey: 'employee_name', header: 'Operador' },
    { accessorKey: 'x_ejecutivo_viaje_bel', header: 'Ejecutivo' },
    { accessorKey: 'inicio_programado', header: 'Inicio programado' ,},
    { accessorKey: 'fecha_inicio', header: 'Fecha inicio' },
    { accessorKey: 'diferencia_tiempo', header: 'Diferencia tiempo salida' },
    { accessorKey: 'llegada_planta_programada', header: 'Llegada a planta programada' },
    { accessorKey: 'llegada_planta', header: 'Llegada a planta reportada' },
    { accessorKey: 'diferencia_llegada_planta', header: 'Diferencia tiempo planta' },
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
    state: { showProgressBars: isLoading },
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    initialState: {
      density: 'compact',
      expanded: false,
      pagination: { pageIndex: 0, pageSize: 100 },
      showColumnFilters: true,
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
          flexWrap: 'nowrap',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <DatePicker
          variant='bordered'
          label="Fecha inicio"
          value={fechaInicio}
          onChange={setFechaInicio}>
        </DatePicker>

        <DatePicker
          variant='bordered'
          label="Fecha fin"
          value={fechaFin}
          onChange={setFechaFin}>
        </DatePicker>

        <Button
          fullWidth={true}
          color='primary'
          onClick={handleExportData}
          startContent={<FileDownloadIcon />}
        >
          Exportar todo
        </Button>

        <Button
          fullWidth={true}
          color='primary'
          isDisabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startContent={<FileDownloadIcon />}
        >
          Exportar seleccionado
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
