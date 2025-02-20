import {
  Stepper,
  Step,
  StepLabel,
  Box,
  DialogContent,
  Dialog,
} from '@mui/material';
import Swal from 'sweetalert2';
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Card, CardBody, CardFooter, Image, Button, CardHeader, Switch } from "@heroui/react";
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { ViajeContext } from '../context/viajeContext';
import { useJourneyDialogs } from '../seguimiento/funciones';
import ReactQuill from 'react-quill';
import { DialogTitle } from '@mui/material';
import { DialogActions } from '@mui/material';
import Slide from '@mui/material/Slide';
import 'react-quill/dist/quill.snow.css';
import { Progress } from "@heroui/react";
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import { DatePicker } from "@heroui/react";
import { now, getLocalTimeZone, today } from "@internationalized/date";
import { parseDate } from "@internationalized/date";
import { parseZonedDateTime, parseAbsoluteToLocal } from "@internationalized/date";
import { FormattedDate } from 'rsuite/esm/CustomProvider';
import { toast } from 'react-toastify';

const { VITE_PHIDES_API_URL } = import.meta.env;

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

  const [NuevaFecha, setNuevaFecha] = React.useState(now(getLocalTimeZone()));

  const [fileList, setFileList] = useState(archivos || []);

  const handleSelectCard = (id) => {
    setEstatusSeleccionado(id);
  };

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const [isSelected, setIsSelected] = React.useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState();

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      [{ align: [] }],
      ['clean'],
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'link', 'image', 'align',
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await odooApi.get('/estatus_operativos/monitoreo/');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
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
      imageUrl: VITE_PHIDES_API_URL + '/img/status/start.png',
      imageWidth: 150,
      imageHeight: 150,
      imageAlt: 'Imagen de confirmación',
    });

    if (result.isConfirmed) {
      try {
        setLoadingSE(true);
        const success = await enviar_estatus(id_viaje, estatus_seleccionado, fileList, comentarios, NuevaFecha);
        if (success) {
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
      imageUrl: VITE_PHIDES_API_URL + '/img/status/start.png',
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
                          src={VITE_PHIDES_API_URL + '/img/status/' + item.imagen}
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
                    <Switch isSelected={isSelected} onValueChange={setIsSelected}>
                    </Switch>
                    <div className="flex gap-3">
                      <div className="flex flex-col gap-1 items-start justify-center">
                        <p className="text-md font-bold">Cambiar horario</p>
                        <p className="text-small text-default-500 text-white">Seleccione una hora diferente en caso de que desee reportar un estatus de atención distinto al que se genera automáticamente por el sistema GPS.</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <DatePicker
                      hideTimeZone
                      showMonthAndYearPickers
                      defaultValue={now(getLocalTimeZone())}
                      label="Nueva hora"
                      variant="bordered"
                      isDisabled={!isSelected}
                      onChange={setNuevaFecha}
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
                    <div class="quill-custom">
                      <ReactQuill
                        class="js-quill"
                        value={comentarios}
                        onChange={setContenido}
                        modules={modules}
                        formats={formats}
                        placeholder="Escribe aquí el contenido..."
                      />
                    </div>
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
                        <InboxOutlined />
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
                <Button variant="contained" color="success" onPress={confirmar_reenvio}>
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
