import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  DialogContent,
  Dialog,
} from '@mui/material';
import Swal from 'sweetalert2';
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { ViajeContext } from '../context/viajeContext';
import { useJourneyDialogs } from '../seguimiento/funciones';
import ReactQuill from 'react-quill';
import { DialogTitle } from '@mui/material';
import { DialogActions } from '@mui/material';
import Slide from '@mui/material/Slide';
import 'react-quill/dist/quill.snow.css';
import { Progress } from "@nextui-org/react";
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

  const [activeStep, setActiveStep] = useState(0);

  const [estatus_seleccionado, setEstatusSeleccionado] = useState(
    estatusSeleccionado || ''
  );
  const [comentarios, setContenido] = useState(
    comentariosEstatus || ''
  );

  const [fileList, setFileList] = useState(archivos || []);

  const handleSelectCard = (id) => {
    setEstatusSeleccionado(id);
  };

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

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
        const response = await fetch(VITE_PHIDES_API_URL + '/viajes/panel_envio_estatus/getEstatus.php', {
          method: 'POST',
          body: new URLSearchParams({
            estado: viaje.estado
          }),
        });
        const jsonData = await response.json();
        setData(jsonData);
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

  const confirmar_envio = () => {
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
        enviar_estatus(id_viaje, estatus_seleccionado, fileList, comentarios);
        cerrar();
      }
    });
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

      <DialogContent>
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
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
                        <img
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

                <h2>Añadir comentarios</h2>
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

                <h2 className='mt-5'>Añadir evidencias</h2>
                <Dragger {...props} style={{ fontFamily: 'Inter' }}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Haz clic o arrastra el archivo aquí para subirlo</p>
                  <p className="ant-upload-hint">Soporta múltiples archivos</p>
                </Dragger>
              </Box>
            )}

          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Atrás
            </Button>

            {activeStep != 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={estatus_seleccionado == null}
              >
                Siguiente
              </Button>
            ) : (
              <>
                {id_reporte == null ? (
                  <>
                    <Button variant="contained" onClick={confirmar_envio}>
                      Enviar estatus
                    </Button>
                  </>
                ) : (
                  <Button variant="contained" color="success" onClick={confirmar_reenvio}>
                    Reenviar estatus
                  </Button>
                )}
              </>
            )}

          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <button onClick={cerrar}>Close</button>
      </DialogActions>
    </Dialog >
  );
}

export default PanelEnvio;
