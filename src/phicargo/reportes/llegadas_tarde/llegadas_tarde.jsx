import React, { useState, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import axios from 'axios';
import Badge from 'react-bootstrap/Badge';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Component } from "react";

const DetencionesTable = () => {

  const [isLoading, setisLoading] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const handleFechaInicioChange = (event) => {
    setFechaInicio(event.target.value);
  };

  const handleFechaFinChange = (event) => {
    setFechaFin(event.target.value);
  };

  const generarReporte = () => {
    console.log('Fecha Inicio:', fechaInicio);
    console.log('Fecha Fin:', fechaFin);
    fetchData();
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await axios.get('/phicargo/reportes/llegadas_tarde/tabla1.php', {
        params: {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin
        }
      });
      setData(response.data);
      setisLoading(false);
      console.log(response.data); // Maneja la respuesta aquí
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  const columns = [
    {
      accessorKey: 'referencia_anterior',
      header: 'Viaje anterior / Finalización',
      Cell: ({ row }) => (
        `${row.original.referencia_anterior} - ${row.original.fecha_finalizado_anterior}`
      ),
    },
    { accessorKey: 'sucursal', header: 'Sucursal' },
    { accessorKey: 'referencia_actual', header: 'Referencia viaje' },
    { accessorKey: 'estado_actual', header: 'Estado viaje' },
    { accessorKey: 'nombre_operador_actual', header: 'Nombre operador' },
    { accessorKey: 'unidad_actual', header: 'Unidad' },
    { accessorKey: 'route_id_actual', header: 'Ruta' },
    { accessorKey: 'fecha_programada_actual', header: 'Inicio de ruta programado' },
    { accessorKey: 'fecha_inicio_actual', header: 'Inicio de ruta real' },
    {
      accessorKey: 'estado_salida',
      header: 'Estado de inicio de ruta',
      Cell: ({ row }) => {
        const estado = row.original.estado_salida;

        if (estado == 'Ya va tarde') {
          return <Badge className="badge bg-danger">Ya va tarde</Badge>;
        } else if (estado == 'Está en tiempo') {
          return <Badge className="badge bg-primary">Está en tiempo</Badge>;
        } else if (estado == 'Salió tarde') {
          return <Badge className="badge bg-danger">Salió tarde</Badge>;
        } else if (estado == 'Salió a tiempo') {
          return <Badge className="badge bg-success">Salió a tiempo</Badge>;
        }
        return null;
      },
    },
    { accessorKey: 'tiempo_diferencia_2_actual', header: 'Diferencia tiempo' },
    { accessorKey: 'fecha_planta_actual', header: 'Llegada a planta programada' },
    { accessorKey: 'fecha_envio_actual', header: 'Llegada a planta reportada' },
    {
      accessorKey: 'estado_llegada_planta',
      header: 'Estado llegada a planta',
      Cell: ({ row }) => {
        const estado = row.original.estado_llegada_planta;

        if (estado == 'Va a llegar tarde') {
          return <Badge className="badge bg-warning">Va a llegar tarde</Badge>;
        } else if (estado == 'Llego tarde') {
          return <Badge className="badge bg-danger">Llego tarde</Badge>;
        } else if (estado == 'Está en tiempo') {
          return <Badge className="badge bg-primary">Está en tiempo</Badge>;
        } else if (estado == 'Llego a tiempo') {
          return <Badge className="badge bg-success">Llego a tiempo</Badge>;
        }
        return null;
      },
    },
    { accessorKey: 'tiempo_diferencia_actual', header: 'Diferencia tiempo' },
    { accessorKey: 'fecha_salida_planta', header: 'Salida planta' },
    { accessorKey: 'detenciones_patio_planta', header: 'Minutos detenciones de patio a cliente' },
    { accessorKey: 'detenciones_planta', header: 'Minutos detenido en planta' },
    { accessorKey: 'detenciones_planta_patio', header: 'Minutos detenido planta a patio' },
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
    state: { isLoading: isLoading },
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    initialState: {
      pagination: { pageSize: 80 }
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          onClick={handleExportData}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          //only export selected rows
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>
      </Box >
    ),
  });

  return (<div>
    <div className='row'>
      <div className='col-2'>
        <input
          className='form-control'
          id="fechaInicio"
          type="date"
          onChange={handleFechaInicioChange}
        />
      </div>
      <div className='col-2'>
        <input
          className='form-control'
          id="fechaFin"
          type="date"
          onChange={handleFechaFinChange}
        />
      </div>
      <div className='col-3'>
        <button
          className="btn btn-primary"
          onClick={generarReporte}
        >
          Generar reporte
        </button>
      </div>
    </div>
    <MaterialReactTable
      table={table}
    />;
  </div>
  );
};

export default DetencionesTable;
