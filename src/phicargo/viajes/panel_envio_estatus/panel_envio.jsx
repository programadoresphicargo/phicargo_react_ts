import 'react-quill/dist/quill.snow.css';

import {
  Box,
  Dialog,
  DialogContent,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';
import { Button, Card, CardBody, CardFooter, CardHeader, Image, Input, Switch, Textarea } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Upload, message } from 'antd';
import { getLocalTimeZone, now, today } from "@internationalized/date";
import { parseAbsoluteToLocal, parseZonedDateTime } from "@internationalized/date";
import { parseDate, parseDateTime } from "@internationalized/date";
import { DatePicker } from "@heroui/react";
import { DialogActions } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { Progress } from "@heroui/react";
import ReactQuill from 'react-quill';
import Slide from '@mui/material/Slide';
import Swal from 'sweetalert2';
import { ViajeContext } from '../context/viajeContext';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useJourneyDialogs } from '../seguimiento/funciones';
const { VITE_ODOO_API_URL } = import.meta.env;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const { Dragger } = Upload;

const steps = ['Seleccion de estatus', 'Anexar comentarios o evidencias'];

function PanelEnvio({ open, cerrar, id_reporte }) {

  const [data, setData] = useState([]);

  const [isLoadingSendEstatus, setLoadingSE] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter(item =>
    item.nombre_estatus.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const getEstatusReenvio = async () => {
    if (!id_reporte) {
      return;
    }
    toast.info('Obteniendo estatus...');
    try {
      setLoadingSE(true);
      const response = await odooApi.get('/tms_travel/reportes_estatus_viajes/id_reporte/' + id_reporte);
      setEstatusSeleccionado(response.data.id_estatus);
      setEstatusSeleccionadoNombre(response.data.nombre_estatus);
      setEstatusSeleccionadoImagen(response.data.imagen);
      setContenido(response.data.comentarios_estatus);
      setLoadingSE(false);
    } catch (error) {
      setLoadingSE(false);
      toast.error('Error al obtener los datos:' + error);
    }
  };

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setActiveStep(id_reporte ? 1 : 0);
    getEstatusReenvio();
  }, [id_reporte, open]);

  const { enviar_estatus, reenviar_estatus } = useJourneyDialogs();
  const { id_viaje, viaje } = useContext(ViajeContext);
  const [estatus_seleccionado, setEstatusSeleccionado] = useState('');
  const [estatus_seleccionado_nombre, setEstatusSeleccionadoNombre] = useState('');
  const [estatus_seleccionado_imagen, setEstatusSeleccionadoImagen] = useState('');
  const [comentarios, setContenido] = useState('');

  function getLocalISOString() {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 19);
  }

  const [FechaModificada, setFechaModificada] = React.useState(getLocalISOString());
  const updateFecha = (newValue) => {
    const date = newValue.toDate(getLocalTimeZone());
    const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    setFechaModificada(formatted);
  };

  const handleSwitchChange = (value) => {
    setIsSelected(value);
    if (!value) {
      setFechaModificada(null);
    } else {
      setFechaModificada(getLocalISOString());
    }
  };

  const [fileList, setFileList] = useState([]);

  const handleSelectCard = (estatus) => {
    setEstatusSeleccionado(estatus.id_estatus);
    setEstatusSeleccionadoNombre(estatus.nombre_estatus);
    setEstatusSeleccionadoImagen(estatus.imagen);
  };

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const [isSelected, setIsSelected] = React.useState(false);
  const [isLoading, setLoading] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await odooApi.get('/estatus_operativos/tipo/viaje/monitoreo');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [open]);

  useEffect(() => {
    if (!open) {
      setIsSelected(false);
      setEstatusSeleccionado("");
      setContenido("");
      setFileList([]);
      setActiveStep(0);
    }
  }, [open]);

  const props = {
    name: 'file',
    multiple: true,
    onChange(info) {
      setFileList(info.fileList);
    },
    beforeUpload: (file) => {
      setFileList((prevFileList) => [...prevFileList, file]);
      return false;
    },
    fileList,
    onRemove: (file) => {
      setFileList((prevFileList) => prevFileList.filter((f) => f.uid !== file.uid));
    },
  };

  const confirmar_envio = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas enviar este estatus?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
      imageUrl: VITE_ODOO_API_URL + '/assets/trafico/estatus_operativos/start.png',
      imageWidth: 150,
      imageHeight: 150,
      imageAlt: 'Imagen de confirmación',
    });

    if (result.isConfirmed) {
      try {
        setLoadingSE(true);
        const success = await enviar_estatus(id_viaje, estatus_seleccionado, fileList, comentarios, FechaModificada);
        if (success) {
          setEstatusSeleccionado("");
          setContenido("");
          setFileList([]);
          setActiveStep(0);
          cerrar();
        } else {
          toast.error("El envío del estatus falló.");
        }
        setLoadingSE(false);
      } catch (error) {
        console.error("Error al enviar el estatus:", error);
        toast.error("Ocurrió un error al intentar enviar el estatus.");
        setLoadingSE(false);
      }
    }
  };

  const confirmar_reenvio = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas enviar este estatus?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
      imageUrl: VITE_ODOO_API_URL + '/assets/trafico/estatus_operativos/start.png',
      imageWidth: 150,
      imageHeight: 150,
      imageAlt: 'Imagen de confirmación',
    }).then((result) => {
      if (result.isConfirmed) {
        reenviar_estatus(id_viaje, id_reporte, estatus_seleccionado, fileList, comentarios);
        setFileList([]);
        cerrar();
      }
    });
  };

  const sugerencias = [
    "Unidad liberada",
    "Unidad ya con papeles para la salida",
    "Operador reporta trafico",
    "Operador en toma de alimentos",
    "Operador reporta llegada a planta",
    "Operador reporta accidente",
    "Motivo de detención:"
  ];

  const seleccionarOpcion = (opcion) => {
    setContenido((contenidoAnterior) => `${contenidoAnterior} ${opcion}`);
  };

  return (
    <Dialog
      fullWidth="lg"
      maxWidth="lg"
      open={open}
      onClose={cerrar}
      TransitionComponent={Transition}
      keepMounted
      sx={{
        '& .MuiPaper-root': {
          borderRadius: '25px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.0)',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <DialogTitle>Nuevo estatus</DialogTitle>
      {isLoadingSendEstatus && <Progress isIndeterminate aria-label="Loading..." size='sm' />}

      <DialogContent>
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel style={{ fontFamily: 'Inter' }}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 3 }}>
            {activeStep === 0 && (
              <Box>

                <Input
                  value={searchTerm}
                  color='primary'
                  label='Buscar estatus'
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='mb-4'
                  isClearable
                  onClear={() => setSearchTerm('')}>
                </Input>

                <div className="gap-4 grid grid-cols-2 sm:grid-cols-4">
                  {filteredData.map((item, index) => (
                    <Card
                      shadow="sm"
                      key={index}
                      isPressable
                      onPress={() => handleSelectCard(item)}
                      style={{
                        border: estatus_seleccionado === item.id_estatus ? '2px solid blue' : 'none',
                      }}>
                      <CardBody className="overflow-visible flex items-center justify-center">
                        <Image
                          isBlurred
                          isZoomed
                          src={VITE_ODOO_API_URL + '/assets/trafico/estatus_operativos/' + item.imagen}
                          style={{ width: '80px' }}
                        />
                      </CardBody>
                      <CardFooter className="text-small justify-center">
                        <b>{item.nombre_estatus}</b>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <div className='mb-5'>
                  <h1 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                  }}>
                    Estatus seleccionado:
                  </h1>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px' // espacio entre texto e imagen
                  }}>
                    <Image
                      isZoomed
                      src={`${VITE_ODOO_API_URL}/assets/trafico/estatus_operativos/${estatus_seleccionado_imagen}`}
                      style={{ width: '80px' }}
                    />
                    <h1 style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#066ee8',
                      padding: '5px 10px',
                      borderLeft: '5px solid #066ee8',
                      margin: 0 // quitar margen para mejor alineación
                    }}>
                      {'(' + estatus_seleccionado + ')  ' + estatus_seleccionado_nombre}
                    </h1>
                  </div>
                </div>


                <Card className='mb-5'>
                  <CardHeader className="justify-between bg-warning">
                    <Switch isSelected={isSelected} onValueChange={handleSwitchChange}>
                      Habilitar cambio de hora
                    </Switch>
                    <div className="flex gap-3">
                      <div className="flex flex-col gap-1 items-start justify-center">
                        <p className="text-md font-bold">Cambiar horario</p>
                        <p className="text-small text-white">Seleccione una hora diferente en caso de que desee reportar un estatus de atención distinto al que se genera automáticamente por el sistema GPS.</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <DatePicker
                      firstDayOfWeek="mon"
                      hideTimeZone
                      showMonthAndYearPickers
                      defaultValue={FechaModificada ? parseDateTime(FechaModificada) : undefined}
                      label="Nueva hora"
                      variant="bordered"
                      isDisabled={!isSelected}
                      onChange={updateFecha}
                      maxValue={today(getLocalTimeZone())}
                    />
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader className='bg-success'>
                    <div className="flex flex-col">
                      <p className="text-md font-bold text-white">Añadir comentarios</p>
                    </div>
                  </CardHeader>
                  <CardBody>

                    <h1
                      style={{
                        fontSize: '25px',
                        fontWeight: 'bold',
                      }}>
                      Opciones predefinidas a comentar
                    </h1>

                    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 mt-3 mb-3">
                      {sugerencias.map((opcion, index) => (
                        <>
                          <Card
                            isBlurred
                            isPressable
                            onPress={() => seleccionarOpcion(opcion)}
                            style={{ backgroundColor: '#25D366' }} // Aquí defines el color
                          >
                            <CardBody>
                              <span style={{ color: 'white' }}>{opcion}</span>
                            </CardBody>
                          </Card>
                        </>
                      ))}
                    </div>

                    <Textarea
                      label="Comentarios"
                      variant='bordered'
                      value={comentarios}
                      onValueChange={setContenido}
                      onClear={() => setContenido("")}>
                    </Textarea>

                  </CardBody>
                </Card>

                <Card className='mt-5'>
                  <CardHeader className='bg-primary'>
                    <div className="flex flex-col">
                      <p className="text-md font-bold text-white">Añadir evidencias</p>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Dragger {...props} style={{ fontFamily: 'Inter' }}>
                      <p className="ant-upload-drag-icon">
                        {/* <InboxOutlined /> */}
                      </p>
                      <p className="ant-upload-text">Haz clic o arrastra el archivo aquí para subirlo</p>
                      <p className="ant-upload-hint">Soporta múltiples archivos</p>
                    </Dragger>
                  </CardBody>
                </Card>
              </Box>
            )}

          </Box>
        </Box>
      </DialogContent>
      <DialogActions>

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 1, gap: 1 }}>
          <Button disabled={activeStep === 0} onPress={handleBack} sx={{ ml: 3 }}>
            Atrás
          </Button>

          {activeStep != 1 ? (
            <Button
              color="primary"
              onPress={handleNext}
              isDisabled={estatus_seleccionado == '' ? true : false}
            >
              Siguiente
            </Button>
          ) : (
            <>
              {id_reporte == null ? (
                <Button
                  color="success"
                  className="text-white"
                  onPress={confirmar_envio}
                  isLoading={isLoadingSendEstatus}
                >
                  <i class="bi bi-send"></i> Enviar estatus
                </Button>
              ) : (
                <Button color="success" onPress={() => confirmar_reenvio()} className='text-white' isDisabled={isLoadingSendEstatus}>
                  <i class="bi bi-send"></i> Reenviar estatus
                </Button>
              )}
            </>
          )}
        </Box>

      </DialogActions>
    </Dialog >
  );
}

export default PanelEnvio;
