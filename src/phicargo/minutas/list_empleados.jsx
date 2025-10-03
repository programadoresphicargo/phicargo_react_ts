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

const Transition = React.forwardRef(function Transition(props, ref) {
 return <Slide direction="up" ref={ref} {...props} />;
});

export default function AñadirParticipantes() {
 const [open, setOpen] = React.useState(false);
 const [data, setData] = useState([]);
 const [isLoading2, setLoading] = useState(false);
 const { selectedRows, setSelectedRows } = useMinutas();

 const handleClickOpen = () => {
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
  enableRowSelection: true, // ✅ activa selección por checkbox
  enableMultiRowSelection: true, // ✅ permite seleccionar varios
  onRowSelectionChange: setSelectedRows, // ✅ guarda los seleccionados
  state: {
   rowSelection: selectedRows,
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
   sx: {
    borderRadius: '0',
   },
  },
  muiTableContainerProps: {
   sx: {
    maxHeight: 'calc(100vh - 210px)',
   },
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
  console.log("Participantes seleccionados:", seleccionados);
  setSelectedRows(seleccionados); // ✅ guardamos en el contexto
  handleClose();
  // aquí puedes guardarlos en un estado o enviarlos a otro componente
 };

 return (
  <React.Fragment>
   <Button color="primary" onPress={handleClickOpen} radius="full">
    Añadir participante
   </Button>
   <Dialog
    open={open}
    onClose={handleClose}
    slots={{
     transition: Transition,
    }}
    fullWidth
    maxWidth="md"
   >
    <AppBar sx={{ position: 'relative' }} elevation={0}>
     <Toolbar>
      <IconButton
       edge="start"
       color="inherit"
       onClick={handleClose}
       aria-label="close"
      >
       <CloseIcon />
      </IconButton>
      <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
       Minuta
      </Typography>
      <Button autoFocus color="success" onClick={handleAñadir} className='text-white'>
       Añadir
      </Button>
     </Toolbar>
    </AppBar>
    <MaterialReactTable table={table} />
   </Dialog>
  </React.Fragment>
 );
}
