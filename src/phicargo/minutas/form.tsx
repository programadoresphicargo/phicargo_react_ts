import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Card, CardBody, CardHeader, Chip, Progress } from '@heroui/react';
import ParticipantesMinutas from './participantes';
import { Grid } from "@mui/material";
import Stack from '@mui/material/Stack';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';
import Swal from "sweetalert2";
import { DatePicker } from '@heroui/react';
import { parseDate } from "@internationalized/date";
import { Minuta } from './minutas';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { AutocompleteInput, TextareaInput } from '@/components/inputs';
import dayjs from 'dayjs';
import { SelectItem } from '@/types';
import { Empleado } from '../accesos/types/types';
import TareasMinutas from './tareas';

const initialForm: Minuta = {
  id_solicitante: null,
  id_minuta: null,
  fecha: dayjs(),
  estado: "borrador",
  puntos_discusion: "",
  desarrollo_reunion: "",
  participantes: [],
  tareas: []
}

export default function MinutaForm({ open, handleClose, id_minuta }: { open: boolean, handleClose: () => void, id_minuta: number | null }) {

  const { control, handleSubmit, reset, watch } = useForm<Minuta>({
    defaultValues: initialForm,
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "participantes",
    keyName: "fieldId",
  });

  const {
    fields: tareas,
    append: appendTarea,
    remove: removeTarea,
    update: updateTarea
  } = useFieldArray({
    control,
    name: "tareas",
    keyName: "fieldId",
  });

  const [isLoading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = async () => {

    if (id_minuta == null) {
      setIsEditing(true);
      reset(initialForm);
      return;
    } else {
      setIsEditing(false);
    }

    try {
      setLoading(true);
      const response = await odooApi.get('/minutas/' + id_minuta);
      reset({
        ...response.data,
        fecha: response.data.fecha
          ? dayjs(response.data.fecha)
          : null,
      })
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [open]);

  const handleSave = async (data: Minuta) => {

    if (fields.length <= 0) {
      toast.error('Deben existir participantes a esta minuta.')
      return;
    }

    const sendData = {
      ...data,
      fecha: data.fecha?.format("YYYY-MM-DD"),
    };

    try {
      const payload = {
        data: sendData,
        participantes: fields,
        tareas: tareas,
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

  const ConfirmarMinuta = async () => {
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
      ConfirmarMinuta();
    }
  };

  const estado = watch("estado");

  const [empleados, setEmpleados] = useState<SelectItem[]>([]);

  const fetchEmpleados = () => {
    odooApi.get<Empleado[]>('/drivers/employees/')
      .then(response => {
        setLoading(true);
        const data = response.data.map(item => ({
          key: String(item.id_empleado),
          value: item.empleado,
        }));
        setEmpleados(data);
      })
      .catch(err => {
        console.error('Error al obtener la flota:', err);
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
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
          <Button autoFocus onPress={handleClose}>
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
                <Chip color='warning' className='text-white'>{estado.toUpperCase()}</Chip>
              </>
            )}

            {!id_minuta && (
              <Button color="success" onPress={() => handleSubmit(handleSave)()} className="text-white" radius='full'>
                Registrar
              </Button>
            )}

            {!isEditing && id_minuta && estado !== 'confirmado' && (
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
                onPress={() => handleSubmit(handleSave)()}
                className="text-white"
                radius='full'
                isLoading={isLoading}
              >
                <i className="bi bi-floppy-fill"></i> Actualizar
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
                  <i className="bi bi-printer"></i> Imprimir formato
                </Button>
                {estado != 'confirmado' && (
                  <Button color='success' className='text-white' radius='full' onPress={() => Confirmar()} isLoading={isLoading}
                  >Confirmar</Button>
                )}
              </>
            )}
          </Stack>
        </Grid>

        <Grid item xs={5}>
          <div className="w-full flex flex-col gap-4">
            <Controller
              control={control}
              name="fecha"
              rules={{ required: "Campo obligatorio" }}
              render={({ field, fieldState }) => {
                const calendarValue =
                  field.value
                    ? parseDate(dayjs(field.value).format('YYYY-MM-DD'))
                    : null;

                return (
                  <DatePicker
                    variant="flat"
                    label="Fecha"
                    isDisabled={!isEditing}
                    value={calendarValue}
                    onChange={(val) => {
                      field.onChange(val ? dayjs(val.toString()) : null);
                    }}
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                );
              }}
            />

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
                <AutocompleteInput
                  control={control}
                  rules={{ required: "Campo obligatorio" }}
                  label="Solicitante"
                  name="id_solicitante"
                  items={empleados}
                />
              </CardBody>
            </Card>
            <ParticipantesMinutas fields={fields} append={append} remove={remove} isEditing={isEditing} />
          </div>
        </Grid>

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
                <TextareaInput
                  control={control}
                  rules={{ required: "Campo obligatorio" }}
                  name="puntos_discusion"
                  label="Puntos de discusion"
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
                <TextareaInput
                  control={control}
                  rules={{ required: "Campo obligatorio" }}
                  label="Desarrollo de la reunion"
                  name="desarrollo_reunion" />
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
              <TareasMinutas fields={tareas} append={appendTarea} remove={removeTarea} update={updateTarea} isEditing={isEditing}></TareasMinutas>
            </CardBody>
          </Card>
        </Grid>
      </Grid>
    </Dialog>
  );
}
