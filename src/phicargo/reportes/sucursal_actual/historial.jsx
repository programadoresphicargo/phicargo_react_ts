import React, { useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button, Divider } from "@heroui/react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

export default function OperadoresDialogPage({ open, setOpen, data = [] }) {

 return (
  <div className="min-h-screen flex items-center justify-center">
   <Dialog open={open} onClose={setOpen} fullWidth maxWidth="md">

    <AppBar sx={{ position: 'relative' }} elevation={0}>
     <Toolbar>
      <IconButton
       edge="start"
       color="inherit"
       onClick={setOpen}
       aria-label="close"
      >
       <CloseIcon />
      </IconButton>
      <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
       Historial
      </Typography>
      <Button autoFocus color="inherit" onPress={() => setOpen(false)}>
       Cerrar
      </Button>
     </Toolbar>
    </AppBar>

    <DialogContent className="max-w-4xl">


     <ul className="mt-4 divide-y divide-gray-200">
      {data.map((item) => (
       <Card key={item.driver_id} className="rounded-2xl shadow-md mt-2">
        <CardHeader>
         {item.operador}
        </CardHeader>
        <Divider></Divider>
        <CardBody className="space-y-1">
         <p><strong>Sucursal:</strong> {item.sucursal}</p>
         <p><strong>Desde:</strong> {item.fecha_inicio}</p>
         <p><strong>Hasta:</strong> {item.fecha_fin}</p>
         <p><strong>Vehiculo:</strong> {item.vehiculo}</p>
        </CardBody>
       </Card>
      ))}
     </ul>

     <div className="flex justify-end mt-6">
      <Button variant="outline" onPress={() => setOpen(false)}>
       Cerrar
      </Button>
     </div>
    </DialogContent>
   </Dialog>
  </div>
 );
}
