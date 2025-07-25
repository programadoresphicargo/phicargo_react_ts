import 'react-quill/dist/quill.snow.css';

import {
  Box,
  Dialog,
  DialogContent,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';
import { Button, Card, CardBody, CardFooter, CardHeader, Image, Switch, Textarea } from "@heroui/react";
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

function PanelEnvio({ open, cerrar, id_reporte, estatusSeleccionado, comentariosEstatus, archivos }) {

  useEffect(() => {
    setEstatusSeleccionado(estatusSeleccionado || '');
    setContenido(comentariosEstatus || '');
    setActiveStep(0);
  }, [estatusSeleccionado, comentariosEstatus]);

  const { enviar_estatus, reenviar_estatus } = useJourneyDialogs();
  const { id_viaje, viaje } = useContext(ViajeContext);

  const [isLoadingSendEstatus, setLoadingSE] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [estatus_seleccionado, setEstatusSeleccionado] = useState(
    estatusSeleccionado || ''
  );
  const [comentarios, setContenido] = useState(
    comentariosEstatus || ''
  );

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

  const [fileList, setFileList] = useState(archivos || []);

  const handleSelectCard = (id) => {
    setEstatusSeleccionado(id);
  };

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const [isSelected, setIsSelected] = React.useState(false);
  const [data, setData] = useState([]);
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
                <div className="gap-4 grid grid-cols-2 sm:grid-cols-4 p-4">
                  {data.map((item, index) => (
                    <Card shadow="sm" key={index} isPressable
                      onPress={() => handleSelectCard(item.id_estatus)}
                      style={{
                        border: estatus_seleccionado === item.id_estatus ? '2px solid blue' : 'none',
                      }}>
                      <CardBody className="overflow-visible flex items-center justify-center">
                        <Image
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

                <Card className='mb-5'>
                  <CardHeader className="justify-between bg-danger">
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
                    <Textarea
                      label="Comentarios"
                      variant='bordered'
                      value={comentarios}
                      onValueChange={setContenido}>
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
                  Enviar estatus
                </Button>
              ) : (
                <Button color="success" onPress={confirmar_reenvio} className='text-white'>
                  Reenviar estatus
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
