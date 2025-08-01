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
import { MRT_Localization_ES } from 'material-react-table/locales/es';

const SucursalActualOperador = () => {

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
      const response = await odooApi.get(`/tms_travel/sucursal_actual_operadores/`);
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };


  const columns = [
    { accessorKey: 'operador', header: 'Operador', },
    {
      accessorKey: 'sucursal', header: 'Última sucursal', Cell: ({ cell }) => {
        const valor = cell.getValue() || '';
        var clase;

        if (valor === 'Manzanillo (Sucursal)') {
          clase = 'danger';
        } else if (valor === 'Veracruz (Matriz)') {
          clase = 'success';
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
    { accessorKey: 'dias_en_sucursal', header: 'Días en sucursal' },
    { accessorKey: 'dias_en_sucursal_actual', header: 'Días en sucursal' },
    { accessorKey: 'fecha_primer_viaje', header: 'Entrada a sucursal' },
    { accessorKey: 'primer_viaje', header: 'Primer viaje en sucursal' },
    { accessorKey: 'fecha_ultimo_viaje', header: 'Fecha último viaje' },
    { accessorKey: 'ultimo_viaje', header: 'Último viaje registrado' },
    { accessorKey: 'vehiculos_utilizados', header: 'Vehiculos utilizados' },
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
          flexWrap: 'nowrap',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >

        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Operadores
        </h1>

      </Box >
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

export default SucursalActualOperador;
