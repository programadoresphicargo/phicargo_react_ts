import React, { useEffect, useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Button } from '@heroui/react';
import {
 MaterialReactTable,
 useMaterialReactTable,
} from 'material-react-table';
import odooApi from '@/api/odoo-api';
import { Box } from '@mui/material';
import { useMinutas } from './context';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

const Transition = React.forwardRef(function Transition(props, ref) {
 return <Slide direction="up" ref={ref} {...props} />;
});

export default function AñadirParticipantes() {
 const [open, setOpen] = useState(false);
 const [data, setData] = useState([]);
 const [isLoading2, setLoading] = useState(false);
 const [rowSelection, setRowSelection] = useState({}); // ✅ para controlar la selección visible

 const {
  selectedRows,
  setSelectedRows,
  isEditing,
  participantes_nuevos, setParticipantesNuevos,
  eliminados_participantes, setEliminadosParticipantes
 } = useMinutas();

 const handleClickOpen = () => {
  // ✅ Cuando se abre el modal, sincronizamos los seleccionados previos
  const selectedIds = selectedRows.map((p) => p.id_empleado);
  const newSelection = {};

  data.forEach((row, index) => {
   if (selectedIds.includes(row.id_empleado)) {
    newSelection[index] = true; // Marca como seleccionado
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
   pagination: { pageSize: 80 },
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
  const seleccionados = table.getSelectedRowModel().rows.map((row) => row.original);

  // --- 🧠 Lógica para detectar nuevos registros ---
  const idsActuales = selectedRows.map((p) => p.id_empleado);
  const idsNuevos = seleccionados.map((p) => p.id_empleado);

  const nuevos = seleccionados.filter((p) => !idsActuales.includes(p.id_empleado));
  const eliminados = selectedRows.filter((p) => !idsNuevos.includes(p.id_empleado));

  console.log("✅ Participantes seleccionados:", seleccionados);
  console.log("🆕 Nuevos participantes:", nuevos);
  console.log("❌ Participantes eliminados:", eliminados);

  setParticipantesNuevos(nuevos);
  setEliminadosParticipantes(eliminados);
  setSelectedRows(seleccionados);

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
    <i class="bi bi-pencil-square"></i> Editar participantes
   </Button>

   <Dialog
    open={open}
    onClose={handleClose}
    slots={{ transition: Transition }}
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
