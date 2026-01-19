import {
 MaterialReactTable,
 useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
 Button,
 Card,
 CardBody,
 CardHeader,
 Divider,
 useDisclosure,
} from "@heroui/react";
import { Box } from '@mui/material';
import odooApi from '@/api/odoo-api';
import Swal from 'sweetalert2';
import { Chip } from '@heroui/react';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@heroui/react';
import { parseDate, getLocalTimeZone } from "@internationalized/date";

const Transition = React.forwardRef(function Transition(props, ref) {
 return <Slide direction="up" ref={ref} {...props} />;
});

export default function ResponsiveDialog({ open, setOpen, shift }) {

 const navigate = useNavigate();
 const theme = useTheme();
 const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));
 const [data, setData] = useState([]);
 const [isLoading, setLoading] = useState(false);

 function formatDateToYYYYMMDD(date) {
  return date.toISOString().slice(0, 10);
 }

 const now = new Date();
 const first = formatDateToYYYYMMDD(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
 const [value, setValue] = React.useState(parseDate(first));

 const fetchData = async () => {

  try {
   setLoading(true);
   const response = await odooApi.get('/tms_waybill/plan_viaje_asignacion', {
    params: {
     date_order: value,
     operador_asignado: false
    },
   });
   setData(response.data);
   setLoading(false);
  } catch (error) {
   console.error('Error al obtener los datos:', error);
  }
 };

 useEffect(() => {
  fetchData();
 }, [value]);

 useEffect(() => {
  if (open) {
   fetchData();
  }
 }, [open]);

 const irTurnos = () => {
  navigate('/turnos');
 };

 const asignar_viaje = async (id_cp) => {
  const result = await Swal.fire({
   title: '¿Asignar viaje?',
   text: '¿Estás seguro de asignar este viaje?',
   icon: 'warning',
   showCancelButton: true,
   confirmButtonText: 'Sí, asignar',
   cancelButtonText: 'Cancelar',
   confirmButtonColor: '#3085d6',
   cancelButtonColor: '#d33',
  });

  if (!result.isConfirmed) return;

  try {
   setLoading(true);

   const response = await odooApi.put(
    `/shifts/${shift?.id}/assign-travel/${id_cp}`
   );

   setLoading(false);

   Swal.fire({
    icon: 'success',
    title: 'Viaje asignado',
    text: 'El viaje fue asignado correctamente',
    timer: 2000,
    showConfirmButton: false,
   });

   irTurnos();

  } catch (error) {
   setLoading(false);

   const message =
    error?.response?.data?.detail ||
    'No se pudo asignar el viaje';

   console.error('Error al obtener los datos:', error);

   Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
   });
  }
 };

 const columns = useMemo(
  () => [
   {
    accessorKey: 'sucursal',
    header: 'Sucursal',
   },
   {
    accessorKey: 'date_order',
    header: 'Fecha',
   },
   {
    accessorKey: 'carta_porte',
    header: 'Carta porte',
   },
   {
    accessorKey: 'cliente',
    header: 'Cliente',
   },
   {
    accessorKey: 'x_ruta_bel',
    header: 'Ruta',
   },
   {
    accessorKey: 'x_reference',
    header: 'Contenedor',
   },
   {
    accessorKey: 'x_tipo_bel',
    header: 'Tipo de armado',
    Cell: ({ cell }) => {
     const value = cell.getValue();

     return (
      <Chip color={value == 'single' ? 'warning' : 'danger'} size='sm' className='text-white'>{value}</Chip>
     );
    },
   },
   {
    accessorKey: 'x_modo_bel',
    header: 'Modo',
    Cell: ({ cell }) => {
     const value = cell.getValue();

     return (
      <Chip color={value == 'imp' ? 'success' : 'primary'} size='sm' className='text-white'>{value}</Chip>
     );
    },
   },
   {
    accessorKey: 'x_clase_bel',
    header: 'Clase',
   },
   {
    accessorKey: 'x_custodia_bel',
    header: 'Custodia',
   },
   {
    accessorKey: 'dangerous_cargo',
    header: 'Peligroso',
    Cell: ({ cell }) => {
     const value = cell.getValue();
     if (!value) return;

     return (
      <Chip color='success' size='sm' className='text-white'>Peligroso</Chip>
     );
    },
   },
   {
    accessorKey: 'travel_id',
    header: 'Viaje',
   },
   {
    accessorKey: 'x_operador_bel_id',
    header: 'Operador',
   },
  ],
  [],
 );

 const table = useMaterialReactTable({
  columns,
  data,
  localization: MRT_Localization_ES,
  enableGrouping: true,
  enableGlobalFilter: true,
  enableFilters: true,
  state: { showProgressBars: isLoading },
  enableColumnPinning: true,
  enableStickyHeader: true,
  columnResizeMode: "onEnd",
  initialState: {
   showGlobalFilter: true,
   density: 'compact',
   expanded: true,
   showColumnFilters: true,
   pagination: { pageSize: 80, pageIndex: 0 },
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
  muiTableBodyCellProps: {
   sx: {
    fontFamily: 'Inter',
    fontWeight: 'normal',
    fontSize: '14px',
   },
  },
  muiTableContainerProps: {
   sx: {
    borderRadius: '8px',
    maxHeight: 'calc(100vh - 350px)',
   },
  },
  muiTableBodyRowProps: ({ row }) => ({
   onClick: ({ }) => {
    asignar_viaje(row.original.id);
   },
  }),
  renderTopToolbarCustomActions: ({ table }) => (
   <Box
    sx={{
     display: 'flex',
     alignItems: 'center',
     gap: 2,
    }}
   >
    <Card>
     <CardHeader>
      <h2 className="text-lg font-semibold text-gray-800">
       Operador
      </h2>
     </CardHeader>
     <Divider></Divider>
     <CardBody>

      <div className="grid grid-cols-4 gap-x-6 gap-y-2 text-sm">

       {/* IZQUIERDA */}
       <span className="text-gray-500">Nombre</span>
       <span className="font-medium text-gray-900">
        {shift?.driver.name}
       </span>

       <span className="text-gray-500">Modalidad</span>
       <span className="font-medium text-gray-900">
        {shift?.driver.modality}
       </span>

       <span className="text-gray-500">Licencia</span>
       <span className="font-medium text-gray-900">
        {shift?.driver.license}
       </span>

       <span className="text-gray-500">Peligroso</span>
       <span className="font-medium text-gray-900">
        {shift?.driver.dangerous ? 'Sí' : 'No'}
       </span>

       <span className="text-gray-500">Vencimiento</span>
       <span className="font-medium text-gray-900">
        {shift?.driver.licenseExpiration}
       </span>

       {/* Relleno para cuadrar la grilla */}
       <span />
       <span />

      </div>

     </CardBody>
    </Card>

    <DatePicker
     label="Fecha prevista"
     format="yyyy-MM-dd"
     placeholder="Selecciona una fecha"
     value={value}
     onChange={setValue}
     isLoading={isLoading}
    />
    <Button onPress={() => fetchData()} color='success' className='text-white' radius='full'>Recargar</Button>

   </Box>
  )
 });

 return (<>
  <Dialog
   open={open}
   onClose={(event, reason) => {
    if (reason === 'backdropClick') return;
    setOpen();
   }}
   fullScreen
   slots={{
    transition: Transition,
   }}>
   <AppBar sx={{
    position: 'relative',
    background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
    color: 'white',
   }} elevation={0}>
    <Toolbar>
     <IconButton
      edge="start"
      color="inherit"
      onClick={() => setOpen()}
      aria-label="close"
     >
      <CloseIcon />
     </IconButton>
     <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
      Asignación de viajes
     </Typography>
     <Button autoFocus color="inherit" onPress={() => setOpen()}>
      Cancelar
     </Button>
    </Toolbar>
   </AppBar>
   <DialogContent>
    <MaterialReactTable table={table}></MaterialReactTable>
   </DialogContent>
  </Dialog>
 </>
 );
}
