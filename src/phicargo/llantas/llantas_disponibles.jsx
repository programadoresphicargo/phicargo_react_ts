import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Input, Popover, PopoverContent, PopoverTrigger, User, useDisclosure } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import { Avatar } from "@heroui/react";
import { Box } from '@mui/material';
import { Button } from "@heroui/react"
import { Chip } from "@heroui/react";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Image } from 'antd';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import odooApi from '@/api/odoo-api';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSolicitudesLlantas } from './contexto';

const LlantasDisponibles = ({ onClose }) => {
  const { data, setData, lineasGlobales, setLineasGlobales } = useSolicitudesLlantas();

  const [dataEquipos, setDataEquipo] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [rowSelection, setRowSelection] = useState({}); 

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/fleet_tires/');
      setDataEquipo(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: 'name', header: 'Llantas' },
      { accessorKey: 'marca', header: 'Marca' },
      { accessorKey: 'modelo', header: 'Modelo' },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: dataEquipos,
    enableRowSelection: true, // 👈 habilitar checkboxes
    onRowSelectionChange: setRowSelection,
    state: { showProgressBars: isLoading, rowSelection }, // 👈 conectar estado
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionGlobalFilter: "right",
    localization: MRT_Localization_ES,
    columnResizeMode: "onEnd",
    initialState: {
      showGlobalFilter: true,
      density: 'compact',
      expanded: true,
      showColumnFilters: true,
      pagination: { pageSize: 80 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: { borderRadius: '0' },
    },
    muiTableHeadCellProps: {
      sx: { fontFamily: 'Inter', fontWeight: 'Bold', fontSize: '14px' },
    },
    muiTableContainerProps: {
      sx: { maxHeight: 'calc(100vh - 300px)' },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: { fontFamily: 'Inter', fontWeight: 'normal', fontSize: '12px' },
    }),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{ display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap' }}
      >
        <h1
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Llantas disponibles
        </h1>

        <Button
          radius='full'
          className="text-white"
          startContent={<i className="bi bi-arrow-clockwise"></i>}
          color="primary"
          onPress={() => fetchData()}
        >
          Actualizar
        </Button>

        <Button
          radius='full'
          className="text-white"
          color="secondary"
          isDisabled={Object.keys(rowSelection).length === 0} // deshabilitado si no hay selección
          onPress={() => {
            const selectedRows = table.getSelectedRowModel().rows;
            const nuevas = selectedRows.map((row) => ({
              id: -(Date.now() + Math.floor(Math.random() * 1000)),
              x_solicitud_id: data.id,
              x_tire_id: row.original.id,
              name: row.original.name,
              marca: row.original.marca,
              modelo: row.original.modelo,
            }));

            setLineasGlobales((prev) => [...prev, ...nuevas]);
            setRowSelection({}); // limpiar selección
            onClose(); // cerrar modal si quieres
          }}
        >
          Agregar a solicitud
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default LlantasDisponibles;
