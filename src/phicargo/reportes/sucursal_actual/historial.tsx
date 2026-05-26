import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button, Divider } from "@heroui/react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Historial } from './operadores';

export default function OperadoresDialogPage({ open, setOpen, data = [] }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, data: Historial[] }) {

 return (
  <div className="min-h-screen flex items-center justify-center">
   <Dialog open={open} onClose={setOpen} fullWidth maxWidth="md">

    <AppBar sx={{ position: 'relative' }} elevation={0}>
     <Toolbar>
      <IconButton
       edge="start"
       color="inherit"
       onClick={() => setOpen(false)}
       aria-label="close"
      >
       <CloseIcon />
      </IconButton>
      <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
       Historial
      </Typography>
      <Button autoFocus onPress={() => setOpen(false)}>
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
      <Button onPress={() => setOpen(false)}>
       Cerrar
      </Button>
     </div>
    </DialogContent>
   </Dialog>
  </div>
 );
}
