import React, { useEffect, useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@heroui/react';
import {
 MaterialReactTable,
 useMaterialReactTable,
} from 'material-react-table';
import odooApi from '@/api/odoo-api';
import { Box } from '@mui/material';
import { useMinutas } from './context';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form';
import { Minuta } from './minutas';
import { Empleado } from '../accesos/types/types';

type Props = {
 fields: FieldArrayWithId<Minuta, "participantes", "fieldId">[];
 append: UseFieldArrayAppend<Minuta, "participantes">;
 remove: UseFieldArrayRemove;
};

export const AñadirParticipantes = ({
 fields,
 append,
 remove,
}: Props) => {

 const [open, setOpen] = useState(false);
 const [data, setData] = useState<Empleado[]>([]);
 const [isLoading2, setLoading] = useState(false);
 const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
 const { isEditing } = useMinutas();

 const handleClickOpen = () => {

  const selectedIds = fields.map((p) => p.id_empleado);
  const newSelection: Record<string, boolean> = {};

  data.forEach((row) => {
   if (selectedIds.includes(row.id_empleado)) {
    newSelection[row.id_empleado.toString()] = true;
   }
  });

  setRowSelection(newSelection);
  setOpen(true);
 };

 const handleClose = () => {
  setOpen(false);
 };

 const fetchData = async () => {
  try {
   setLoading(true);
   const response = await odooApi.get('/drivers/employees/');
   setData(response.data);
   setLoading(false);
  } catch (error) {
   setLoading(false);
   console.error('Error al obtener los datos:', error);
  }
 };

 useEffect(() => {
  fetchData();
 }, []);

 const columns = useMemo(
  () => [
   {
    accessorKey: 'empleado',
    header: 'Empleado',
   },
   {
    accessorKey: 'puesto',
    header: 'Puesto',
   },
  ],
  []
 );

 const table = useMaterialReactTable({
  columns,
  data,
  getRowId: (row) => row.id_empleado.toString(),
  enableRowSelection: true,
  enableMultiRowSelection: true,
  onRowSelectionChange: setRowSelection, // controlamos selección manualmente
  localization: MRT_Localization_ES,
  state: {
   rowSelection, // ✅ muestra los seleccionados previos
   showProgressBars: isLoading2,
  },
  enableGrouping: true,
  enableGlobalFilter: true,
  enableFilters: true,
  enableColumnPinning: true,
  enableStickyHeader: true,
  columnResizeMode: 'onEnd',
  initialState: {
   density: 'compact',
   pagination: { pageIndex: 0, pageSize: 80 },
  },
  muiTablePaperProps: {
   elevation: 0,
   sx: { borderRadius: '0' },
  },
  muiTableContainerProps: {
   sx: { maxHeight: 'calc(100vh - 210px)' },
  },
  renderTopToolbarCustomActions: () => (
   <Box sx={{ display: 'flex', gap: '16px', padding: '8px' }}>
    Empleados
   </Box>
  ),
 });

 // 👉 función que toma los seleccionados
 const handleAñadir = () => {
  const seleccionados = table
   .getSelectedRowModel()
   .rows
   .map((row) => row.original);

  // IDs actuales en el form
  const idsActuales = fields.map((f) => f.id_empleado);

  // 1. Agregar nuevos
  seleccionados.forEach((emp) => {
   if (!idsActuales.includes(emp.id_empleado)) {
    append({
     id_empleado: emp.id_empleado,
     empleado: emp.empleado,
     puesto: emp.puesto,
    });
   }
  });

  // 2. Eliminar los que ya no están seleccionados
  fields.forEach((field, index) => {
   const stillSelected = seleccionados.some(
    (e) => e.id_empleado === field.id_empleado
   );

   if (!stillSelected) {
    remove(index);
   }
  });

  handleClose();
 };

 return (
  <React.Fragment>
   <Button
    color="primary"
    onPress={handleClickOpen}
    radius="full"
    isDisabled={!isEditing}
   >
    <i className="bi bi-pencil-square"></i> Editar participantes
   </Button>

   <Dialog
    open={open}
    onClose={handleClose}
    fullWidth
    maxWidth="md"
   >
    <AppBar sx={{ position: 'relative' }} elevation={0}>
     <Toolbar>
      <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
       <CloseIcon />
      </IconButton>
      <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
       Minuta
      </Typography>
      <Button autoFocus color="success" onPress={handleAñadir} className="text-white" radius="full">
       Guardar cambios
      </Button>
     </Toolbar>
    </AppBar>

    <MaterialReactTable table={table} />
   </Dialog>
  </React.Fragment>
 );
}
