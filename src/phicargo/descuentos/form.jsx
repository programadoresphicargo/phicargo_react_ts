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
import { Autocomplete, Button, Card, CardBody, CardHeader, Chip, NumberInput, Progress, Textarea } from '@heroui/react';
import { Grid } from "@mui/material";
import Stack from '@mui/material/Stack';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';
import { useDescuentos } from './context';
import SolicitanteMinuta from './solicitante';
import Swal from "sweetalert2";
import { DatePicker } from '@heroui/react';
import { parseDate } from "@internationalized/date";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MinutaForm({ open, handleClose, id_minuta }) {

  const [data, setData] = useState({});

  const [isLoading, setLoading] = useState();
  const { isEditing, setIsEditing, tareas, setRecords, setNuevasTareas, setActualizadasTareas, setEliminadasTareas, setEliminadosParticipantes, setParticipantesNuevos, } = useDescuentos();

  const handleChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const fetchData = async () => {

    if (id_minuta == null) {
      setData({});
      setIsEditing(true);
      return;
    } else {
      setIsEditing(false);
    }

    try {
      setLoading(true);
      const response = await odooApi.get('/descuentos/' + id_minuta);
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

    if (data?.id_empleado == null) {
      toast.error('El empleado es obligatorio.')
      return;
    }

    if (data?.monto == "") {
      toast.error('Monto es obligatorio.')
      return;
    }

    if (data?.fecha == null) {
      toast.error('Fecha es obligatorio.')
      return;
    }

    try {
      let response;

      if (id_minuta) {
        response = await odooApi.patch(`/descuentos/${id_minuta}/`, data);
      } else {
        response = await odooApi.post('/descuentos/', data);
      }

      if (response.data.status === "success") {
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
      const url = `/descuentos/formato/${id_minuta}`;
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
        fullWidth
        maxWidth="sm"
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
              Descuentos
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

          <Grid item xs={12} md={12}>
            <Stack spacing={2} direction="row">

              {id_minuta && (
                <>
                  <h1 className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text">
                    D-{id_minuta}
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
          <Grid item xs={12}>
            <div className="w-full flex flex-col gap-4">
              <DatePicker
                variant={isEditing ? "bordered" : "bordered"}
                hideTimeZone
                showMonthAndYearPickers
                label="Fecha de minuta"
                fullWidth
                value={
                  data?.fecha
                    ? parseDate(data.fecha.split('T')[0])
                    : null
                }
                isDisabled={!isEditing}
                onChange={(date) => {
                  if (!date) return;
                  const formattedDate = date.toString();
                  setData((prev) => ({ ...prev, fecha: formattedDate }));
                }}
                isInvalid={!data?.fecha}
                errorMessage={!data.fecha && "La fecha es obligatoria"}
              />
              <SolicitanteMinuta id_solicitante={data?.id_empleado} setSolicitante={handleChange}></SolicitanteMinuta>

              <NumberInput
                value={data?.monto}
                variant='bordered' isDisabled={!isEditing}
                onValueChange={(e) => handleChange('monto', e)}
                isInvalid={!data?.monto}
                errorMessage={!data.fecha && "Monto es obligatorio"}>
              </NumberInput>

              <Textarea value={data?.descripcion}
                variant='bordered'
                isDisabled={!isEditing} onValueChange={(e) => handleChange('descripcion', e)}
                isInvalid={!data?.fecha}
                errorMessage={!data.fecha && "Descripción obligatoria"}>
              </Textarea>

            </div>
          </Grid>
        </Grid>
      </Dialog>
    </React.Fragment>
  );
}
