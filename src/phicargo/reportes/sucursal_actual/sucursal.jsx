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

const SucursalActual = () => {

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
      // Validar fechas
      if (!fechaInicio || !fechaFin) {
        throw new Error('Las fechas de inicio y fin son obligatorias.');
      }

      setisLoading(true);
      const response = await odooApi.get(`/tms_travel/sucursal_actual/`);
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };


  const columns = [
    { accessorKey: 'vehiculo', header: 'Vehiculo', },
    {
      accessorKey: 'sucursal_nombre', header: 'Sucursal', Cell: ({ cell }) => {
        const valor = cell.getValue() || '';
        var clase;

        if (valor === 'Manzanillo (Sucursal)') {
          clase = 'danger';
        } else if (valor === 'Veracruz (Matriz)') {
          clase = 'success';
        } else if (valor === 'Llegó temprano') {
          clase = 'primary';
        } else {
          clase = 'primary';
        }

        return (
          <Chip color={clase} className="text-white">
            {valor}
          </Chip>
        );
      },
    },
    { accessorKey: 'operador_asignado', header: 'Operador asignado', },
    {
      accessorKey: 'dias_en_sucursal', header: 'Días en sucursal'
    },
    { accessorKey: 'fecha_primer_viaje', header: 'Desde' },
    { accessorKey: 'primer_viaje', header: 'Primer viaje' },
    { accessorKey: 'ultimo_viaje', header: 'Último viaje' },
  ];

  const table = useMaterialReactTable({
    columns,
    data,
    state: { showProgressBars: isLoading },
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    enableGrouping: true,
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
        maxHeight: 'calc(100vh - 167px)',
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

        <h1>Ubicación de unidades</h1>

      </Box >
    ),
  });

  return (
    <>
      <MaterialReactTable
        table={table}
      />;
    </>
  );
};

export default SucursalActual;
