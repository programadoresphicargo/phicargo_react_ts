import { Button, ButtonGroup, Chip, DatePicker, NumberInput } from "@heroui/react";
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

const Checklist = () => {

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), 0, 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [range, setRange] = useState([firstDay, lastDay]);

  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [range]);

  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await odooApi.get(`/tms_travel/checklist/?tipo_checklist=diario`);
      setData(response.data);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const OpenChecklist = async (id_checklist) => {
    const url = `${odooApi.defaults.baseURL}/tms_travel/checklist/export/${id_checklist}`;
    window.open(url, "_blank");
  };

  const columns = [
    { accessorKey: 'id_checklist', header: 'ID' },
    { accessorKey: 'equipo', header: 'Equipo' },
    { accessorKey: 'nombre', header: 'Usuario creacion' },
    { accessorKey: 'fecha_creacion', header: 'Fecha creacion' },
    { accessorKey: 'resultado', header: 'Resultado' },
    {
      accessorKey: 'id_checklist',
      header: 'Descargar',
      Cell: ({ cell, row }) => {
        const id = cell.getValue() || '';
        return (
          <Button className="text-white" size="sm" color="primary" radius="full" onPress={() => OpenChecklist(id)}>
            <i class="bi bi-file-pdf"></i>
            Descargar
          </Button>
        );
      },
    },
    { accessorKey: 'comentarios', header: 'Comentarios' },
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
          alignItems: 'center',
        }}
      >
        <h1
          style={{ flex: 1 }}
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Checklist
        </h1>

        <DateRangePicker
          value={range}
          onChange={(value) => setRange(value)}
          placeholder="Selecciona un rango de fechas"
          format="yyyy-MM-dd"
          loading={isLoading}
        />

        <Button
          onPress={() => exportToCSV(data, columns, "checklist.csv")}
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

export default Checklist;
