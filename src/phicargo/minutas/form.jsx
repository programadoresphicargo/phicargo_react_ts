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
import { Button, Card, CardBody, Progress, Textarea } from '@heroui/react';
import ParticipantesMinutas from './participantes';
import { Grid } from "@mui/material";
import Stack from '@mui/material/Stack';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';
import { useMinutas } from './context';

const Transition = React.forwardRef(function Transition(props, ref) {
 return <Slide direction="up" ref={ref} {...props} />;
});

export default function MinutaForm({ open, handleClose, id_minuta }) {

 const [puntos, setPuntos] = useState("");
 const [desarrollo, setDesarrollo] = useState("");
 const [isLoading, setLoading] = useState();
 const { selectedRows, setSelectedRows, isEditing, setIsEditing } = useMinutas();

 const fetchData = async () => {

  if (!id_minuta) {
   setPuntos("");
   setDesarrollo("");
   setSelectedRows([]);
   setIsEditing(false);
  }

  try {
   setLoading(true);
   const response = await odooApi.get('/minutas/' + id_minuta);
   setPuntos(response.data.puntos_discusion);
   setDesarrollo(response.data.desarrollo_reunion);
   setSelectedRows(response.data.participantes);
   setLoading(false);
  } catch (error) {
   setLoading(false);
   console.error('Error al obtener los datos:', error);
  }
 };

 useEffect(() => {
  fetchData();
  setIsEditing(false);
 }, [open]);

 const handleSubmit = async () => {

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
     puntos_discusion: puntos,
     desarrollo_reunion: desarrollo
    },
    participantes: selectedRows
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
        <h1>Minuta No.{id_minuta}</h1>
       )}

       {!id_minuta && (
        <Button color="success" onPress={handleSubmit} className="text-white" radius='full'>
         Registrar
        </Button>
       )}

       {!isEditing && (
        <Button
         color="primary"
         onPress={() => setIsEditing(true)}
         className="text-white"
         radius='full'
        >
         Editar
        </Button>
       )}

       {isEditing && (
        <Button
         color="success"
         onPress={handleSubmit}
         className="text-white"
         radius='full'
        >
         Actualizar
        </Button>
       )}

       <Button
        color="success"
        onPress={ImprimirFormato}
        className="text-white"
        radius='full'
       >
        Imprimir formato
       </Button>

      </Stack>
     </Grid>
     {/* Primer componente (4 columnas) */}
     <Grid item xs={5}>
      <ParticipantesMinutas />
     </Grid>

     {/* Segundo componente (8 columnas) */}
     <Grid item xs={7}>
      <Card>
       <CardBody>
        <Textarea
         variant="bordered"
         label="PUNTOS DE DISCUSIÓN / TEMAS A TRATAR"
         value={puntos}            // ✅ valor controlado
         isDisabled={!isEditing}
         onChange={(e) => setPuntos(e.target.value)}  // ✅ actualizar estado
         isInvalid={puntos == "" ? true : false}
         errorMessage="Campo obligatorio"
        />

        <Textarea
         variant="bordered"
         label="DESARROLLO DE LA REUNIÓN"
         value={desarrollo}        // ✅ valor controlado
         isDisabled={!isEditing}
         onChange={(e) => setDesarrollo(e.target.value)} // ✅ actualizar estado
         isInvalid={desarrollo == "" ? true : false}
         errorMessage="Campo obligatorio"
        />
       </CardBody>
      </Card>
     </Grid>
    </Grid>

   </Dialog>
  </React.Fragment>
 );
}