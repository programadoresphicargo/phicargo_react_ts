import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button, Select, SelectItem, Chip, useDisclosure } from "@heroui/react";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Slide from '@mui/material/Slide';
import { DatePicker } from 'rsuite';
import CustomNavbar from '@/pages/CustomNavbar';
import FormularioAsignacionEquipo from './formulario';
import odooApi from '@/api/odoo-api';
import { exportToCSV } from '../../utils/export';

const ViajesProgramados = () => {

  const [date, setDate] = useState(new Date());
  const [storeValue, setStoreValue] = useState(new Set(["1"]));
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [Preasignacion, setPreasignacion] = useState(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchData = async () => {
    try {
      setLoading(true);

      const storeId = Array.from(storeValue)[0];
      const fecha = date.toISOString().slice(0, 10);

      const response = await odooApi.get('/tms_waybill/plan_viaje/', {
        params: {
          date_order: fecha,
          store_id: storeId,
        },
      });

      setData(response.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date, storeValue]);

  const handlePrint = () => {
    const tableElement = document.querySelector('.MuiTable-root');

    if (!tableElement) {
      console.error("No se encontró la tabla para imprimir");
      return;
    }

    const printWindow = window.open('', '', 'width=1200,height=900');

    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir tabla</title>
          <style>
            @page {
              size: landscape;
              margin: 10mm;
            }
  
            body {
              font-family: Arial, sans-serif;
              padding: 10px;
              zoom: 0.75; /* ESCALA */
            }
  
            table {
              border-collapse: collapse;
              width: 100%;
              font-size: 11px;
            }
  
            th, td {
              border: 1px solid black;
              padding: 4px 6px;
              text-align: left;
            }
  
            thead {
              background-color: #e5e5e5;
              font-weight: bold;
            }
  
            /* 🔥 OCULTAR FILTROS DE MATERIAL REACT TABLE */
            .Mui-TableHeadCell-FilterContainer,
            .MuiTableHeadCell-filterTextField,
            .MuiInputBase-root,
            .MuiFormControl-root,
            input {
              display: none !important;
              visibility: hidden !important;
            }
  
            /* 🔥 OCULTAR LOS ICONOS DE SORTING */
            .MuiTableSortLabel-root,
            .MuiTableSortLabel-icon,
            .MuiTableSortLabel-iconDirectionAsc,
            .MuiTableSortLabel-iconDirectionDesc,
            th svg {
              display: none !important;
              visibility: hidden !important;
            }
  
            /* Ocultar contenedor de flechitas */
            .MuiTableSortLabel-root * {
              display: none !important;
              visibility: hidden !important;
            }
          </style>
        </head>
        <body>
          ${tableElement.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const columns = useMemo(() => [
    { accessorKey: 'carta_porte', header: 'Carta Porte' },
    { accessorKey: 'vehiculo_programado', header: 'Vehículo' },
    { accessorKey: 'operador_programado', header: 'Operador' },
    { accessorKey: 'x_reference', header: 'Contenedor' },
    { accessorKey: 'estado', header: 'Estado' },
    {
      accessorKey: 'x_tipo_bel',
      header: 'Tipo',
      Cell: ({ cell }) => {
        const tipo = cell.getValue();
        let color = tipo === 'single' ? 'warning' :
          tipo === 'full' ? 'danger' :
            'default';
        return <Chip color={color} size="sm" className="text-white">{tipo}</Chip>;
      },
    },

    { accessorKey: 'x_medida_bel', header: 'Medida' },

    {
      accessorKey: 'x_modo_bel',
      header: 'Modo',
      Cell: ({ cell }) => {
        const tipo = cell.getValue();
        let color = tipo === 'exp' ? 'success' :
          tipo === 'imp' ? 'primary' :
            'default';
        return <Chip color={color} size="sm" className="text-white">{tipo}</Chip>;
      },
    },

    { accessorKey: 'x_ruta_bel', header: 'Ruta' },
    { accessorKey: 'x_clase_bel', header: 'Clase' },
    {
      accessorKey: 'trailer1',
      header: 'Remolque 1',
      Cell: ({ cell }) => {
        const val = cell.getValue();

        if (!val) {
          return null; // No renderizar nada si está vacío o nulo
        }

        return (
          <Chip color="primary" size="sm" className="text-white">
            {val}
          </Chip>
        );
      },
    },
    {
      accessorKey: 'trailer2',
      header: 'Remolque 2',
      Cell: ({ cell }) => {
        const val = cell.getValue();

        if (!val) {
          return null;
        }

        return (
          <Chip color="success" size="sm" className="text-white">
            {val}
          </Chip>
        );
      },
    },
    {
      accessorKey: 'dolly', header: 'Dolly',
      Cell: ({ cell }) => {
        const val = cell.getValue();

        if (!val) {
          return null;
        }

        return (
          <Chip color="warning" size="sm" className="text-white">
            {val}
          </Chip>
        );
      },
    },
    { accessorKey: 'waybill_category', header: 'Waybill category' },

  ], []);

  const table = useMaterialReactTable({
    columns,
    data,
    localization: MRT_Localization_ES,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableColumnPinning: true,
    layoutMode: 'grid-no-grow',
    state: { showProgressBars: isLoading },
    enableStickyHeader: true,
    columnResizeMode: "onEnd",

    initialState: {
      density: 'compact',
      showColumnFilters: true,
      pagination: { pageSize: 80 },
      columnPinning: { right: ['trailer1', 'trailer2', 'dolly'] },
    },
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '12px',
      },
    },
    muiTablePaperProps: { elevation: 0, sx: { borderRadius: '0', }, },
    muiTableContainerProps: { sx: { maxHeight: 'calc(100vh - 200px)', }, },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        setPreasignacion(row.original);
        onOpen(); // abrir modal
      },
      style: { cursor: 'pointer' },
    }),

    muiTopToolbarProps: {
      sx: {
        background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
        color: 'white',
        '& .MuiSvgIcon-root': { color: 'white' },
        '& .MuiButton-root': { color: 'white' },
        '& .MuiInputBase-root': { color: 'white' },
      },
    },

    muiTableBodyCellProps: ({ row }) => { return { sx: { fontFamily: 'Inter', fontWeight: 'normal', fontSize: '12px', }, } },

    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr auto auto',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <h1 className="font-semibold lg:text-2xl">Asignación de equipo</h1>

        <Select
          size="sm"
          label="Sucursal"
          selectedKeys={storeValue}
          onSelectionChange={setStoreValue}
          radius='full'
        >
          <SelectItem key="1">Veracruz</SelectItem>
          <SelectItem key="9">Manzanillo</SelectItem>
          <SelectItem key="2">México</SelectItem>
        </Select>

        <DatePicker
          value={date}
          onChange={setDate}
          format="yyyy-MM-dd"
          placeholder="Selecciona una fecha"
          size="lg"
          loading={isLoading}
        />

        <Button
          color="success"
          className="text-white"
          startContent={<i className="bi bi-file-earmark-excel"></i>}
          onPress={() => exportToCSV(data, columns, "plan_viaje.csv")}
          radius="full"
        >
          Exportar
        </Button>

        <Button
          color="primary"
          className="text-white"
          startContent={<i className="bi bi-printer"></i>}
          onPress={handlePrint}
          radius="full"
        >
          Imprimir
        </Button>

        <Button
          color="danger"
          className="text-white"
          startContent={<i className="bi bi-arrow-clockwise"></i>}
          onPress={fetchData}
          radius="full"
        >
          Recargar
        </Button>
      </Box>
    ),
  });

  return (
    <>
      <CustomNavbar />

      <MaterialReactTable table={table} />

      <FormularioAsignacionEquipo
        data={Preasignacion}
        isOpen={isOpen}
        onOpenChange={(open) => {
          onOpenChange(open);
          if (!open) fetchData(); // recargar al cerrar modal
        }}
      />
    </>
  );
};

export default ViajesProgramados;
