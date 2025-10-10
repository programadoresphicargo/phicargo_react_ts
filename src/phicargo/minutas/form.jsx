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
import { Autocomplete, Button, Card, CardBody, CardHeader, Progress, Textarea } from '@heroui/react';
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

const Transition = React.forwardRef(function Transition(props, ref) {
 return <Slide direction="up" ref={ref} {...props} />;
});

export default function MinutaForm({ open, handleClose, id_minuta }) {

 const [id_solicitante, setSolicitante] = useState(null);
 const [puntos, setPuntos] = useState("");
 const [desarrollo, setDesarrollo] = useState("");
 const [isLoading, setLoading] = useState();
 const { selectedRows, setSelectedRows, isEditing, setIsEditing, tareas, setRecords, nuevas_tareas, setNuevasTareas, actualizadas_tareas, setActualizadasTareas, eliminadas_tareas, setEliminadasTareas, eliminados_participantes, setEliminadosParticipantes, participantes_nuevos, setParticipantesNuevos, } = useMinutas();

 const fetchData = async () => {

  if (id_minuta == null) {
   setSolicitante(null);
   setPuntos("");
   setDesarrollo("");
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
   setSolicitante(response.data.id_solicitante);
   setPuntos(response.data.puntos_discusion);
   setDesarrollo(response.data.desarrollo_reunion);
   setSelectedRows(response.data.participantes);
   setRecords(response.data.tareas);
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

  if (id_solicitante == null) {
   toast.error('El solicitante es obligatorio.')
   return;
  }

  if (selectedRows.length <= 0) {
   toast.error('Deben existir participantes a esta minuta.')
   return;
  }

  if (puntos == "") {
   toast.error('Puntos de discución es obligatorio.')
   return;
  }

  if (desarrollo == "") {
   toast.error('Desarrollo de reunión es obligatorio.')
   return;
  }

  try {
   const payload = {
    data: {
     id_solicitante: id_solicitante,
     puntos_discusion: puntos,
     desarrollo_reunion: desarrollo
    },
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
   // Obtenemos la URL completa que Odoo usaría
   const url = `/minutas/formato/${id_minuta}`;

   // Si solo necesitas abrirla, sin descargar ni procesar:
   const fullUrl = odooApi.defaults.baseURL + url; // 👈 combina el baseURL del axios
   window.open(fullUrl, "_blank"); // abre en nueva pestaña sin cerrar la actual

  } catch (error) {
   toast.error("Error al abrir formato: " + error);
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
        <h1 className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text">
         M-{id_minuta}
        </h1>
       )}

       {!id_minuta && (
        <Button color="success" onPress={handleSubmit} className="text-white" radius='full'>
         Registrar
        </Button>
       )}

       {!isEditing && id_minuta && (
        <Button
         color="primary"
         onPress={() => setIsEditing(true)}
         className="text-white"
         radius='full'
        >
         Editar
        </Button>
       )}

       {isEditing && id_minuta && (
        <Button
         color="success"
         onPress={handleSubmit}
         className="text-white"
         radius='full'
        >
         Actualizar
        </Button>
       )}

       {!isEditing && id_minuta && (
        <Button
         color="success"
         onPress={ImprimirFormato}
         className="text-white"
         radius='full'
        >
         Imprimir formato
        </Button>
       )}

      </Stack>
     </Grid>
     {/* Primer componente (4 columnas) */}
     <Grid item xs={5}>
      <div className="w-full flex flex-col gap-4">
       <SolicitanteMinuta id_solicitante={id_solicitante} setSolicitante={setSolicitante}></SolicitanteMinuta>
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
          value={puntos}
          onChange={setPuntos}
          isDisabled={!isEditing}
          isInvalid={puntos === ""}
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
          value={desarrollo}
          onChange={setDesarrollo}
          isDisabled={!isEditing}
          isInvalid={desarrollo === ""}
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