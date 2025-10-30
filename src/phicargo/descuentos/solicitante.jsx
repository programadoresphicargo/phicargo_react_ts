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
import { Grid } from "@mui/material";
import Stack from '@mui/material/Stack';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';
import { useDescuentos } from './context';

export default function SelectEmpleado({ key_name, label, setSolicitante, value }) {

 const { selectedRows, setSelectedRows, isEditing, setIsEditing, tareas, setRecords, nuevas_tareas, setNuevasTareas, actualizadas_tareas, setActualizadasTareas, eliminadas_tareas, setEliminadasTareas, eliminados_participantes, setEliminadosParticipantes, participantes_nuevos, setParticipantesNuevos, } = useDescuentos();
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
   <Autocomplete
    variant="bordered"
    defaultItems={data}
    label={label}
    selectedKey={String(value) || null}
    onSelectionChange={(key) => setSolicitante(key_name, key)}
    isDisabled={!isEditing}
    isInvalid={!value}
    errorMessage="Campo obligatorio"
   >
    {(user) => (
     <AutocompleteItem key={user.id_empleado}>
      {user.empleado}
     </AutocompleteItem>
    )}
   </Autocomplete>
  </React.Fragment>
 );
}