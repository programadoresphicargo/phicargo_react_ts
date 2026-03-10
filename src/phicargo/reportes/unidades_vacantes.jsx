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
import CustomNavbar from "@/pages/CustomNavbar";

const VehiculosSinOperadorAsignado = () => {

  const [isLoading, setisLoading] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await odooApi.get(`/vehicles/vacantes/`);
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
      const response = await odooApi.get(`/vehicles/unidades_vacantes/`);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const columns = [
    { accessorKey: 'res_store.name', header: 'Sucursal', },
    { accessorKey: 'name2', header: 'Vehiculo' },
    { accessorKey: 'x_tipo_vehiculo', header: 'Tipo' },
    { accessorKey: 'x_tipo_carga', header: 'Tipo de carga' },
    { accessorKey: 'x_modalidad', header: 'Modalidad' },
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
      grouping: ["res_store.name"],
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
        <h1 style={{ flex: 1 }}
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Unidades vacantes
        </h1>

        <Button
          onPress={() => EnviarCorreo()}
          color="primary"
          radius="full"
        >
          Enviar correo
        </Button>

        <Button
          onPress={() => exportToCSV(data, columns, "unidades_vacantes.csv")}
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

export default VehiculosSinOperadorAsignado;
