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
import { exportToCSV } from '../../utils/export';

const UltimosUsosUnidades = () => {

  const [value, setValue] = React.useState(5);
  const [isLoading, setisLoading] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [value]);

  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await odooApi.get(`/vehicles/ultimos_usos/${value}`);
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
      const response = await odooApi.get(`/vehicles/ultimos_usos_correo/${value}`);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const columns = [
    { accessorKey: 'vehiculo', header: 'Vehiculo', },
    { accessorKey: 'tipo_vehiculo', header: 'Tipo' },
    { accessorKey: 'sucursal', header: 'Sucursal' },
    { accessorKey: 'tipo_uso', header: 'Último uso' },
    { accessorKey: 'ultima_fecha_uso', header: 'Última fecha' },
    { accessorKey: 'dias_sin_uso', header: 'Días sin usar' },
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
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Últimos usos
        </h1>
        <NumberInput
          label="Días sin usar"
          placeholder="Días sin usar"
          value={value}
          onValueChange={setValue}
        />
        <Button
          onPress={() => EnviarCorreo()}
          color="primary"
          radius="full"
          fullWidth>
          Enviar correo
        </Button>
        <Button
          onPress={() => exportToCSV(data, columns, "equipos.csv")}
          color="success"
          className="text-white"
          radius="full"
          fullWidth>
          Exportar
        </Button>
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

export default UltimosUsosUnidades;
