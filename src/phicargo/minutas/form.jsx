import React, { useEffect, useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Autocomplete, Button, Card, CardBody, CardHeader, Chip, Progress, Textarea } from '@heroui/react';
import ParticipantesMinutas from './participantes';
import { Grid } from "@mui/material";
import Stack from '@mui/material/Stack';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';
import { useMinutas } from './context';
import TareasMinutas from './tareas';
import ExampleWithProviders from './tareas';
import SolicitanteMinuta from './solicitante';
import VoiceTextarea from './VoiceTextarea';
import Swal from "sweetalert2";

const Transition = React.forwardRef(function Transition(props, ref) {
 return <Slide direction="up" ref={ref} {...props} />;
});

export default function MinutaForm({ open, handleClose, id_minuta }) {

 const [data, setData] = useState({});

 const [isLoading, setLoading] = useState();
 const { selectedRows, setSelectedRows, isEditing, setIsEditing, tareas, setRecords, nuevas_tareas, setNuevasTareas, actualizadas_tareas, setActualizadasTareas, eliminadas_tareas, setEliminadasTareas, eliminados_participantes, setEliminadosParticipantes, participantes_nuevos, setParticipantesNuevos, } = useMinutas();

 const handleChange = (key, value) => {
  setData((prev) => ({
   ...prev,
   [key]: value,
  }));
 };

 const fetchData = async () => {

  if (id_minuta == null) {
   setData({});

   setSelectedRows([]);
   setRecords([]);
   setIsEditing(true);

   setNuevasTareas([]);
   setActualizadasTareas([]);
   setEliminadasTareas([]);

   setParticipantesNuevos([]);
   setEliminadosParticipantes([]);
   return;
  } else {
   setIsEditing(false);
  }

  try {
   setLoading(true);
   const response = await odooApi.get('/minutas/' + id_minuta);
   setSelectedRows(response.data.participantes);
   setRecords(response.data.tareas);
   setData(response.data);
   console.log(response.data);
   setLoading(false);
  } catch (error) {
   setLoading(false);
   console.error('Error al obtener los datos:', error);
  }
 };

 useEffect(() => {
  fetchData();
 }, [open]);

 const handleSubmit = async () => {

  if (data?.id_solicitante == null) {
   toast.error('El solicitante es obligatorio.')
   return;
  }

  if (selectedRows.length <= 0) {
   toast.error('Deben existir participantes a esta minuta.')
   return;
  }

  if (data?.puntos_discusion == "") {
   toast.error('Puntos de discución es obligatorio.')
   return;
  }

  if (data?.desarrollo_reunion == "") {
   toast.error('Desarrollo de reunión es obligatorio.')
   return;
  }

  try {
   const payload = {
    data: data,
    participantes_nuevos: participantes_nuevos,
    participantes_eliminados: eliminados_participantes,
    tareas_nuevas: nuevas_tareas,
    tareas_actualizadas: actualizadas_tareas,
    tareas_eliminadas: eliminadas_tareas
   };

   let response;

   if (id_minuta) {
    response = await odooApi.patch(`/minutas/${id_minuta}/`, payload);
   } else {
    response = await odooApi.post('/minutas/', payload);
   }

   if (response.data.state === "success") {
    toast.success(response.data.message);
    handleClose();
    setIsEditing(false);
   } else {
    toast.error(response.data.message);
   }

  } catch (error) {
   toast.error("Error al enviar datos: " + error);
  }
 };

 const ImprimirFormato = async () => {
  try {
   const url = `/minutas/formato/${id_minuta}`;
   const fullUrl = odooApi.defaults.baseURL + url;
   window.open(fullUrl, "_blank");
  } catch (error) {
   toast.error("Error al abrir formato: " + error);
  }
 };

 const ejecutarAccion = async () => {
  let response = await odooApi.patch(`/minutas/estado/${id_minuta}/confirmado`);
  if (response.data.state === "success") {
   toast.success(response.data.message);
   handleClose();
   setIsEditing(false);
  } else {
   toast.error(response.data.message);
  }
 };

 const Confirmar = async () => {
  const result = await Swal.fire({
   title: "¿Estás seguro?",
   text: "Esta acción no se puede deshacer.",
   icon: "warning",
   showCancelButton: true,
   confirmButtonText: "Sí, continuar",
   cancelButtonText: "Cancelar",
   confirmButtonColor: "#3085d6",
   cancelButtonColor: "#d33",
  });

  if (result.isConfirmed) {
   ejecutarAccion();
  }
 };

 return (
  <React.Fragment>
   <Dialog
    fullScreen
    open={open}
    onClose={handleClose}
    slots={{
     transition: Transition,
    }}
   >
    <AppBar
     elevation={0}
     position="static"
     sx={{
      background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
      padding: '0 16px',
     }}>
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
      <Button autoFocus color="inherit" onClick={handleClose}>
       Cerrar
      </Button>
     </Toolbar>
    </AppBar>

    {isLoading && (
     <Progress isIndeterminate size='sm'></Progress>
    )}

    <Grid container spacing={2} sx={{ p: 2 }}>

     <Grid item xs={12}>
      <Stack spacing={2} direction="row">

       {id_minuta && (
        <>
         <h1 className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text">
          M-{id_minuta}
         </h1>
         <Chip color='warning' className='text-white'>{data?.estado}</Chip>
        </>
       )}

       {!id_minuta && (
        <Button color="success" onPress={handleSubmit} className="text-white" radius='full'>
         Registrar
        </Button>
       )}

       {!isEditing && id_minuta && data?.estado !== 'confirmado' && (
        <Button
         color="primary"
         onPress={() => setIsEditing(true)}
         className="text-white"
         isLoading={isLoading}
         radius="full"
        >
         <i className="bi bi-pencil-square"></i> Editar
        </Button>
       )}

       {isEditing && id_minuta && (
        <Button
         color="success"
         onPress={handleSubmit}
         className="text-white"
         radius='full'
         isLoading={isLoading}
        >
         <i class="bi bi-floppy-fill"></i> Actualizar
        </Button>
       )}

       {!isEditing && id_minuta && (
        <>
         <Button
          color="success"
          onPress={ImprimirFormato}
          className="text-white"
          radius='full'
          isLoading={isLoading}
         >
          <i class="bi bi-printer"></i> Imprimir formato
         </Button>
         {data?.estado != 'confirmado' && (
          <Button color='success' className='text-white' radius='full' onPress={() => Confirmar()} isLoading={isLoading}
          >Confirmar</Button>
         )}
        </>
       )}

      </Stack>
     </Grid>
     {/* Primer componente (4 columnas) */}
     <Grid item xs={5}>
      <div className="w-full flex flex-col gap-4">
       <SolicitanteMinuta id_solicitante={data?.id_solicitante} setSolicitante={handleChange}></SolicitanteMinuta>
       <ParticipantesMinutas />
      </div>
     </Grid>

     {/* Segundo componente (8 columnas) */}
     <Grid item xs={7}>
      <div className="w-full flex flex-col gap-4">

       <Card>
        <CardHeader
         style={{
          background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
          color: 'white',
          fontWeight: 'bold'
         }}>
         Puntos de discusión / Temas a tratar
        </CardHeader>
        <Divider></Divider>
        <CardBody>
         <VoiceTextarea
          label="PUNTOS DE DISCUSIÓN / TEMAS A TRATAR"
          name={"puntos_discusion"}
          value={data?.puntos_discusion}
          onChange={handleChange}
          isDisabled={!isEditing}
          isInvalid={data?.puntos_discusion === ""}
          errorMessage="Campo obligatorio"
          lang="es-MX"
         />
        </CardBody>
       </Card>

       <Card>
        <CardHeader
         style={{
          background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
          color: 'white',
          fontWeight: 'bold'
         }}>
         Desarrollo de la reunión
        </CardHeader>
        <Divider></Divider>
        <CardBody>
         <VoiceTextarea
          label="DESARROLLO DE LA REUNIÓN"
          name={"desarrollo_reunion"}
          value={data?.desarrollo_reunion}
          onChange={handleChange}
          isDisabled={!isEditing}
          isInvalid={data?.desarrollo_reunion === ""}
          errorMessage="Campo obligatorio"
          lang="es-MX"
         />
        </CardBody>
       </Card>
      </div>
     </Grid>
     <Grid item xs={12}>
      <Card>
       <CardHeader
        style={{
         background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
         color: 'white',
         fontWeight: 'bold'
        }}>
        Tareas
       </CardHeader>
       <Divider></Divider>
       <CardBody>
        <ExampleWithProviders></ExampleWithProviders>
       </CardBody>
      </Card>
     </Grid>
    </Grid>
   </Dialog>
  </React.Fragment>
 );
}
