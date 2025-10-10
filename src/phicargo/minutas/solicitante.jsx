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
import { Autocomplete, AutocompleteItem, Button, Card, CardBody, CardHeader, Progress, Textarea } from '@heroui/react';
import ParticipantesMinutas from './participantes';
import { Grid } from "@mui/material";
import Stack from '@mui/material/Stack';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';
import { useMinutas } from './context';
import TareasMinutas from './tareas';
import ExampleWithProviders from './tareas';

export default function SolicitanteMinuta({ id_solicitante, setSolicitante }) {

 const { selectedRows, setSelectedRows, isEditing, setIsEditing, tareas, setRecords, nuevas_tareas, setNuevasTareas, actualizadas_tareas, setActualizadasTareas, eliminadas_tareas, setEliminadasTareas, eliminados_participantes, setEliminadosParticipantes, participantes_nuevos, setParticipantesNuevos, } = useMinutas();
 const [data, setData] = useState([]);
 const [isLoading, setLoading] = useState(false);

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

 return (
  <React.Fragment>
   <Card>
    <CardHeader
     style={{
      background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
      color: 'white',
      fontWeight: 'bold'
     }}>
     Datos de quien realiza la solicitud
    </CardHeader>
    <CardBody>

     <Autocomplete
      variant="bordered"
      defaultItems={data}
      label="Empleado solicitante"
      selectedKey={String(id_solicitante) || null}
      onSelectionChange={(key) => setSolicitante(key)}
      isDisabled={!isEditing}
      isInvalid={!id_solicitante}
      errorMessage="Campo obligatorio"
     >
      {(user) => (
       <AutocompleteItem key={user.id_empleado}>
        {user.empleado}
       </AutocompleteItem>
      )}
     </Autocomplete>

    </CardBody>
   </Card>
  </React.Fragment>
 );
}