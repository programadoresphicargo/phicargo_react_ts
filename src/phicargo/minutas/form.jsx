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
import { Button, Card, CardBody, Textarea } from '@heroui/react';
import ParticipantesMinutas from './participantes';
import { Grid } from "@mui/material";
import Stack from '@mui/material/Stack';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';

const Transition = React.forwardRef(function Transition(props, ref) {
 return <Slide direction="up" ref={ref} {...props} />;
});

export default function MinutaForm() {
 const [open, setOpen] = React.useState(false);

 const [puntos, setPuntos] = useState("");
 const [desarrollo, setDesarrollo] = useState("");

 const handleClickOpen = () => {
  setOpen(true);
 };

 const handleClose = () => {
  setOpen(false);
 };

 const handleSubmit = async () => {
  try {
   const payload = {
    puntos_discusion: puntos,
    desarrollo_reunion: desarrollo,
   };

   const response = await odooApi.post('/minutas/', payload);
   if (response.data.state == "success") {
    toast.success(response.data.message);
    handleClose();
   } else {
    toast.error(response.data.message);
   }
  } catch (error) {
   toast.error("Error al enviar datos:" + error);
  }
 };

 return (
  <React.Fragment>
   <Button color='primary' onPress={handleClickOpen} radius='full'>
    Nuevo
   </Button>
   <Dialog
    fullScreen
    open={open}
    onClose={handleClose}
    slots={{
     transition: Transition,
    }}
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
      <Button autoFocus color="inherit" onClick={handleClose}>
       save
      </Button>
     </Toolbar>
    </AppBar>

    <Stack spacing={2} direction="row">
     <Button color='success' onPress={() => handleSubmit()} className='text-white'>Registrar</Button>
    </Stack>

    <Grid container spacing={2}>
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
         onChange={(e) => setPuntos(e.target.value)}  // ✅ actualizar estado
        />

        <Textarea
         variant="bordered"
         label="DESARROLLO DE LA REUNIÓN"
         value={desarrollo}        // ✅ valor controlado
         onChange={(e) => setDesarrollo(e.target.value)} // ✅ actualizar estado
        />
       </CardBody>
      </Card>
     </Grid>
    </Grid>

   </Dialog>
  </React.Fragment>
 );
}