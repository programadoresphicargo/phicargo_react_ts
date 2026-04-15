import { Button, Chip, DatePicker, NumberInput } from "@heroui/react";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import React, { useEffect, useState } from 'react';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import Badge from 'react-bootstrap/Badge';
import { Box } from '@mui/material';
import { Component } from "react";
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { useDateFormatter } from "@react-aria/i18n";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { exportToCSV } from '../utils/export';
import { DateRangePicker } from 'rsuite';
import CustomNavbar from "@/pages/CustomNavbar";

const DisponibilidadDiariaFlota = () => {

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [range, setRange] = useState([firstDay, lastDay]);

  const [isLoading, setisLoading] = useState('');
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);


  useEffect(() => {
    fetchData();
  }, [range]);

  const generateColumns = (data) => {
    if (!data || data.length === 0) return [];

    // columnas fijas
    const baseColumns = [
      { accessorKey: 'name2', header: 'Vehículo' },
    ];

    // obtener todas las fechas (keys dinámicas)
    const dateKeys = Object.keys(data[0]).filter(
      (key) => key !== 'name2'
    );

    // crear columnas dinámicas
    const dynamicColumns = dateKeys.map((date) => ({
      accessorKey: date,
      header: date.split('-')[2], // solo día (01, 02, etc)
      size: 50,

      Cell: ({ cell }) => {
        const estado = cell.getValue();

        if (!estado) return null;

        return (
          <Chip
            className="text-white"
            size="sm"
            color={
              estado === 'V/T'
                ? 'primary'
                : estado === 'V'
                  ? 'success'
                  : estado === 'T'
                    ? 'warning'
                    : estado === 'LIBRE'
                      ? 'default'
                      : 'default'
            }
          >
            {estado}
          </Chip>
        );
      },
    }));

    return [...baseColumns, ...dynamicColumns];
  };

  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await odooApi.get(`/vehicles/disponibilidad_diaria/`,
        {
          params: {
            fecha_inicio: range[0].toISOString().slice(0, 10),
            fecha_fin: range[1].toISOString().slice(0, 10),
          },
        });
      setData(response.data);

      const cols = generateColumns(response.data);
      setColumns(cols);

    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const EnviarCorreo = async () => {
    try {
      setisLoading(true);
      const response = await odooApi.get(`/maintenance-record/email_unidades_taller/`);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data,
    state: { showProgressBars: isLoading },
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableBottomToolbar: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    localization: MRT_Localization_ES,
    enableColumnAggregations: true,
    columnResizeMode: "onEnd",
    enableColumnPinning: "true",
    initialState: {
      columnPinning: { left: ['name2'] },
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
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length ? '#0456cf' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
        padding: '0 !important',
      },
    }),
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 190px)',
        overflowX: 'auto',
      },
    },
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
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Disponibilidad Diaria
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
          isDisabled
          size="sm"
        >
          Enviar correo
        </Button>

        <Button
          onPress={() => exportToCSV(data, columns, "disponibilidad_flota.csv")}
          color="success"
          className="text-white"
          radius="full"
          size="sm"
        >
          Exportar
        </Button>

        <Button
          onPress={() => fetchData()}
          color="warning"
          className="text-white"
          radius="full"
          size="sm"
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

export default DisponibilidadDiariaFlota;
