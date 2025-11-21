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

  const [idCP, setIdCP] = useState(null);
  const [idPreAsignacion, setIdPreAsignacion] = useState(null);

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

  const columns = useMemo(() => [
    { accessorKey: 'id_cp', header: 'CP' },
    { accessorKey: 'carta_porte', header: 'Carta Porte' },
    { accessorKey: 'vehiculo_programado', header: 'Vehículo' },
    { accessorKey: 'operador_programado', header: 'Operador' },
    { accessorKey: 'x_reference', header: 'Contenedor' },

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
    { accessorKey: 'trailer1', header: 'Remolque 1' },
    { accessorKey: 'trailer2', header: 'Remolque 2' },
    { accessorKey: 'dolly', header: 'Dolly' },
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
    muiTablePaperProps: { elevation: 0, sx: { borderRadius: '0', }, },
    muiTableContainerProps: { sx: { maxHeight: 'calc(100vh - 200px)', }, },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        setIdCP(row.original.id_cp);
        setIdPreAsignacion(row.original.id_pre_asignacion);
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

    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr auto auto',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <h1 className="font-semibold lg:text-2xl">Asignación de equipo</h1>

        <Select
          className="max-w-xs"
          label="Sucursal"
          selectedKeys={storeValue}
          onSelectionChange={setStoreValue}
          size="sm"
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
      </Box>
    ),
  });

  return (
    <>
      <CustomNavbar />

      <MaterialReactTable table={table} />

      <FormularioAsignacionEquipo
        id_cp={idCP}
        id_pre_asignacion={idPreAsignacion}
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
