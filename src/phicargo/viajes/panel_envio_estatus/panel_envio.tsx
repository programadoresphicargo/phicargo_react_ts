import 'react-quill/dist/quill.snow.css';

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';

import {
  Button,
  Card,
  CardBody,
  Image,
  Input,
  Switch,
  Textarea,
  Progress,
  DatePicker,
} from '@heroui/react';

import React, { useContext, useEffect, useState } from 'react';

import {
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';

import {
  getLocalTimeZone,
  parseDateTime,
  today,
} from '@internationalized/date';

import Swal from 'sweetalert2';
import { ViajeContext } from '../context/viajeContext';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useJourneyDialogs } from '../seguimiento/funciones';

const { VITE_ODOO_API_URL } = import.meta.env;

type Estatus = {
  id_estatus: number;
  nombre_estatus: string;
  imagen: string;
};

const { Dragger } = Upload;

const steps = [
  'Selección de estatus',
  'Anexar comentarios o evidencias',
];

function PanelEnvio({
  open,
  cerrar,
  id_reporte,
}: {
  open: boolean;
  cerrar: () => void;
  id_reporte: number | null;
}) {
  const { enviar_estatus, reenviar_estatus } = useJourneyDialogs();
  const { id_viaje, viaje } = useContext(ViajeContext);

  const [data, setData] = useState<Estatus[]>([]);
  const [isLoadingSendEstatus, setLoadingSE] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const [estatusSeleccionado, setEstatusSeleccionado] =
    useState<Estatus | null>(null);

  const [comentarios, setContenido] = useState<string | null>(null);

  const [FechaModificada, setFechaModificada] =
    React.useState<string | null>(null);

  const [isSelected, setIsSelected] = React.useState(false);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const filteredData = data.filter((item) =>
    item.nombre_estatus
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // ---------------------------------------------------------
  // Obtener información del reporte cuando es reenvío
  // ---------------------------------------------------------

  const getEstatusReenvio = async () => {
    if (!id_reporte) {
      return;
    }

    try {
      setLoadingSE(true);

      const response = await odooApi.get(
        `/tms_travel/reportes_estatus_viajes/id_reporte/${id_reporte}`
      );

      setEstatusSeleccionado(response.data);
      setContenido(response.data.comentarios_estatus);

    } catch (error) {
      console.error(error);
      toast.error('Error al obtener los datos del reporte.');

    } finally {
      setLoadingSE(false);
    }
  };

  // ---------------------------------------------------------
  // Inicialización del modal
  // ---------------------------------------------------------

  useEffect(() => {
    if (!open) {
      return;
    }

    setActiveStep(id_reporte ? 1 : 0);

    getEstatusReenvio();
  }, [id_reporte, open]);

  // ---------------------------------------------------------
  // Obtener estatus disponibles
  // ---------------------------------------------------------

  useEffect(() => {
    if (!open || !id_viaje) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await odooApi.get(
          `/tms_travel/reportes_estatus_viajes/open_detention/${id_viaje}`
        );

        const response2 = await odooApi.get(
          '/estatus_operativos/tipo/viaje/monitoreo'
        );

        let estatus = response2.data;

        // Si existe una detención abierta,
        // únicamente permitir el estatus 17.
        if (response.data !== null) {
          estatus = estatus.filter(
            (item: Estatus) => item.id_estatus === 17
          );
        }

        // Si el viaje todavía no ha iniciado,
        // únicamente permitir el estatus 82.
        if (
          viaje?.x_status_viaje == null ||
          viaje?.x_status_viaje === 'disponible'
        ) {
          estatus = estatus.filter(
            (item: Estatus) => item.id_estatus === 82
          );
        }

        setData(estatus);

      } catch (error) {
        console.error(
          'Error al obtener los estatus:',
          error
        );
      }
    };

    fetchData();
  }, [open, id_viaje, viaje?.x_status_viaje]);

  // ---------------------------------------------------------
  // Reset al cerrar
  // ---------------------------------------------------------

  useEffect(() => {
    if (!open) {
      setIsSelected(false);
      setEstatusSeleccionado(null);
      setContenido('');
      setFileList([]);
      setActiveStep(0);
      setSearchTerm('');
      setFechaModificada(null);
    }
  }, [open]);

  // ---------------------------------------------------------
  // Fecha
  // ---------------------------------------------------------

  function getLocalISOString() {
    const now = new Date();
    const offset = now.getTimezoneOffset();

    const localDate = new Date(
      now.getTime() - offset * 60 * 1000
    );

    return localDate.toISOString().slice(0, 19);
  }

  const updateFecha = (newValue: any) => {
    if (!newValue) {
      setFechaModificada(null);
      return;
    }

    const date = newValue.toDate(getLocalTimeZone());

    const formatted =
      `${date.getFullYear()}-` +
      `${String(date.getMonth() + 1).padStart(2, '0')}-` +
      `${String(date.getDate()).padStart(2, '0')}T` +
      `${String(date.getHours()).padStart(2, '0')}:` +
      `${String(date.getMinutes()).padStart(2, '0')}:` +
      `${String(date.getSeconds()).padStart(2, '0')}`;

    setFechaModificada(formatted);
  };

  const handleSwitchChange = (value: boolean) => {
    setIsSelected(value);

    if (!value) {
      setFechaModificada(null);
    } else {
      setFechaModificada(getLocalISOString());
    }
  };

  // ---------------------------------------------------------
  // Selección de estatus
  // ---------------------------------------------------------

  const handleSelectCard = (estatus: Estatus) => {
    setEstatusSeleccionado(estatus);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // ---------------------------------------------------------
  // Archivos
  // ---------------------------------------------------------

  const props: UploadProps = {
    name: 'file',
    multiple: true,

    onChange(info) {
      setFileList(info.fileList);
    },

    beforeUpload: () => false,

    fileList,

    onRemove: (file) => {
      setFileList((prevFileList) =>
        prevFileList.filter(
          (f) => f.uid !== file.uid
        )
      );
    },
  };

  // ---------------------------------------------------------
  // Enviar estatus
  // ---------------------------------------------------------

  const confirmar_envio = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas enviar este estatus?',
      showCancelButton: true,
      confirmButtonColor: '#002887',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',

      imageUrl:
        VITE_ODOO_API_URL +
        '/assets/trafico/estatus_operativos/start.png',

      imageWidth: 150,
      imageHeight: 150,
      imageAlt: 'Imagen de confirmación',
    });

    if (
      result.isConfirmed &&
      estatusSeleccionado?.id_estatus
    ) {
      try {
        setLoadingSE(true);

        const success = await enviar_estatus(
          id_viaje,
          estatusSeleccionado.id_estatus,
          fileList,
          comentarios,
          FechaModificada
        );

        if (success) {
          setEstatusSeleccionado(null);
          setContenido('');
          setFileList([]);
          setActiveStep(0);

          cerrar();
        } else {
          toast.error(
            'El envío del estatus falló.'
          );
        }

      } catch (error) {
        console.error(
          'Error al enviar el estatus:',
          error
        );

        toast.error(
          'Ocurrió un error al intentar enviar el estatus.'
        );

      } finally {
        setLoadingSE(false);
      }
    }
  };

  // ---------------------------------------------------------
  // Reenviar estatus
  // ---------------------------------------------------------

  const confirmar_reenvio = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas reenviar este estatus?',
      showCancelButton: true,
      confirmButtonColor: '#002887',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',

      imageUrl:
        VITE_ODOO_API_URL +
        '/assets/trafico/estatus_operativos/start.png',

      imageWidth: 150,
      imageHeight: 150,
      imageAlt: 'Imagen de confirmación',
    });

    if (
      result.isConfirmed &&
      estatusSeleccionado?.id_estatus &&
      id_reporte
    ) {
      try {
        setLoadingSE(true);

        await reenviar_estatus(
          id_viaje,
          id_reporte,
          estatusSeleccionado.id_estatus,
          fileList,
          comentarios,
          FechaModificada
        );

        setFileList([]);

        cerrar();

      } catch (error) {
        console.error(
          'Error al reenviar el estatus:',
          error
        );

        toast.error(
          'Ocurrió un error al reenviar el estatus.'
        );

      } finally {
        setLoadingSE(false);
      }
    }
  };

  // ---------------------------------------------------------
  // Sugerencias
  // ---------------------------------------------------------

  const sugerencias = [
    'Unidad liberada',
    'Unidad ya con papeles para la salida',
    'Operador reporta trafico',
    'Operador en toma de alimentos',
    'Operador reporta llegada a planta',
    'Operador reporta accidente',
    'Motivo de detención:',
  ];

  const seleccionarOpcion = (opcion: string) => {
    setContenido(
      (prev) => `${prev ?? ''} ${opcion}`.trim()
    );
  };

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={cerrar}
      keepMounted
      sx={{
        '& .MuiPaper-root': {
          borderRadius: '20px',
          boxShadow:
            '0 10px 40px rgba(15, 23, 42, 0.12)',
          overflow: 'hidden',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor:
            'rgba(15, 23, 42, 0.35)',
        },
      }}
    >

      {/* -------------------------------------------------
                HEADER
            ------------------------------------------------- */}

      <DialogTitle className="border-b border-slate-200 bg-white px-6 py-4"
        sx={{
          fontFamily: 'Inter, sans-serif',
        }}>
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002887]/10">
            <i className="bi bi-send-plus-fill text-lg text-[#002887]" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-800">
              {id_reporte
                ? 'Reenviar estatus'
                : 'Nuevo estatus'}
            </h2>

            <p className="text-xs text-slate-500">
              Selecciona el estatus y agrega la
              información correspondiente
            </p>
          </div>

        </div>
      </DialogTitle>

      {/* Loading */}

      {isLoadingSendEstatus && (
        <Progress
          isIndeterminate
          aria-label="Procesando..."
          size="sm"
          className="absolute left-0 right-0 top-0 z-10"
        />
      )}

      {/* -------------------------------------------------
                CONTENT
            ------------------------------------------------- */}

      <DialogContent className="bg-[#f8fafc] px-6 py-5">

        <Box sx={{ width: '100%' }}>

          {/* STEPPER */}

          <div className="mb-5 rounded-xl border border-slate-200 bg-white px-4 py-3 mt-5">

            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

          </div>

          <Box sx={{ mt: 2 }}>

            {/* =====================================================
                            PASO 1
                        ===================================================== */}

            {activeStep === 0 && (
              <Box>

                {/* Buscador */}

                <div className="mb-4">
                  <Input
                    value={searchTerm}
                    color="primary"
                    label="Buscar estatus"
                    size="sm"
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                    isClearable
                    onClear={() =>
                      setSearchTerm('')
                    }
                  />
                </div>

                {/* Estatus */}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">

                  {filteredData.map(
                    (item) => {

                      const selected =
                        estatusSeleccionado?.id_estatus ===
                        item.id_estatus;

                      return (
                        <Card
                          key={
                            item.id_estatus
                          }
                          isPressable
                          shadow="none"
                          onPress={() =>
                            handleSelectCard(
                              item
                            )
                          }
                          className={`
                                                        border bg-white transition-all
                                                        ${selected
                              ? 'border-[#002887] ring-2 ring-[#002887]/10'
                              : 'border-slate-200 hover:border-slate-300'
                            }
                                                    `}
                        >

                          <CardBody className="flex min-h-[125px] items-center justify-center gap-2 p-3">

                            <Image
                              src={`${VITE_ODOO_API_URL}/assets/trafico/estatus_operativos/${item.imagen}`}
                              className="h-[65px] w-[65px] object-contain"
                            />

                            <span
                              className={`
                                                                text-center text-xs
                                                                ${selected
                                  ? 'font-semibold text-[#002887]'
                                  : 'font-medium text-slate-600'
                                }
                                                            `}
                            >
                              {
                                item.nombre_estatus
                              }
                            </span>

                          </CardBody>

                        </Card>
                      );
                    }
                  )}

                </div>

              </Box>
            )}

            {/* =====================================================
                            PASO 2
                        ===================================================== */}

            {activeStep === 1 && (
              <Box>

                {/* ESTATUS SELECCIONADO */}

                <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#002887]/20 bg-[#002887]/5 px-4 py-3">

                  <Image
                    src={`${VITE_ODOO_API_URL}/assets/trafico/estatus_operativos/${estatusSeleccionado?.imagen}`}
                    className="h-12 w-12 object-contain"
                  />

                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Estatus seleccionado
                    </p>

                    <p className="text-sm font-semibold text-[#002887]">
                      (
                      {
                        estatusSeleccionado?.id_estatus
                      }
                      ){' '}
                      {
                        estatusSeleccionado?.nombre_estatus
                      }
                    </p>
                  </div>

                </div>

                {/* =================================================
                                    CAMBIO DE HORA
                                ================================================= */}

                <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">

                  <div className="mb-3 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                        <i className="bi bi-clock text-amber-600" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Cambiar horario
                        </p>

                        <p className="text-xs text-slate-500">
                          Modifica la hora generada automáticamente por GPS.
                        </p>
                      </div>

                    </div>

                    <Switch
                      size="sm"
                      isSelected={
                        isSelected
                      }
                      onValueChange={
                        handleSwitchChange
                      }
                    >
                      <span className="text-xs font-medium text-slate-600">
                        Habilitar
                      </span>
                    </Switch>

                  </div>

                  <DatePicker
                    firstDayOfWeek="mon"
                    hideTimeZone
                    showMonthAndYearPickers
                    value={
                      FechaModificada
                        ? parseDateTime(
                          FechaModificada
                        )
                        : null
                    }
                    label="Nueva hora"
                    variant="bordered"
                    size="sm"
                    isDisabled={
                      !isSelected
                    }
                    onChange={
                      updateFecha
                    }
                    maxValue={today(
                      getLocalTimeZone()
                    )}
                  />

                </div>

                {/* =================================================
                                    COMENTARIOS
                                ================================================= */}

                <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">

                  <div className="mb-3 flex items-center gap-3">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                      <i className="bi bi-chat-left-text text-emerald-600" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Comentarios
                      </p>

                      <p className="text-xs text-slate-500">
                        Agrega información adicional al estatus.
                      </p>
                    </div>

                  </div>

                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Sugerencias rápidas
                  </p>

                  <div className="mb-3 flex flex-wrap gap-2">

                    {sugerencias.map(
                      (opcion) => (
                        <Button
                          key={opcion}
                          size="sm"
                          radius="md"
                          variant="bordered"
                          onPress={() =>
                            seleccionarOpcion(
                              opcion
                            )
                          }
                          className="border-slate-200 text-xs text-slate-600"
                        >
                          {opcion}
                        </Button>
                      )
                    )}

                  </div>

                  <Textarea
                    label="Comentarios"
                    variant="bordered"
                    size="sm"
                    value={
                      comentarios ?? ''
                    }
                    onValueChange={
                      setContenido
                    }
                    onClear={() =>
                      setContenido('')
                    }
                  />

                </div>

                {/* =================================================
                                    EVIDENCIAS
                                ================================================= */}

                <div className="rounded-xl border border-slate-200 bg-white p-4">

                  <div className="mb-3 flex items-center gap-3">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                      <i className="bi bi-paperclip text-[#002887]" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Evidencias
                      </p>

                      <p className="text-xs text-slate-500">
                        Adjunta fotografías o documentos relacionados.
                      </p>
                    </div>

                  </div>

                  <Dragger
                    {...props}
                    style={{
                      fontFamily:
                        'Inter',
                      borderRadius:
                        '12px',
                    }}
                  >

                    <p className="mb-1 text-sm font-medium text-slate-600">
                      Haz clic o arrastra archivos aquí
                    </p>

                    <p className="text-xs text-slate-400">
                      Puedes seleccionar múltiples archivos
                    </p>

                  </Dragger>

                </div>

              </Box>
            )}

          </Box>

        </Box>

      </DialogContent>

      {/* -------------------------------------------------
                FOOTER
            ------------------------------------------------- */}

      <DialogActions className="border-t border-slate-200 bg-white px-6 py-3">

        <Box className="flex w-full items-center justify-between">

          <Button
            isDisabled={activeStep === 0}
            onPress={handleBack}
            radius="md"
            size="sm"
            variant="bordered"
          >
            <i className="bi bi-arrow-left" />
            Atrás
          </Button>

          {activeStep !== 1 ? (

            <Button
              color="primary"
              onPress={handleNext}
              isDisabled={
                !estatusSeleccionado
              }
              radius="md"
              size="sm"
            >
              Siguiente
              <i className="bi bi-arrow-right" />
            </Button>

          ) : (

            <>
              {id_reporte == null ? (

                <Button
                  color="success"
                  onPress={
                    confirmar_envio
                  }
                  isLoading={
                    isLoadingSendEstatus
                  }
                  radius="md"
                  size="sm"
                  className="text-white"
                >
                  <i className="bi bi-send" />
                  Enviar estatus
                </Button>

              ) : (

                <Button
                  color="success"
                  onPress={
                    confirmar_reenvio
                  }
                  isDisabled={
                    isLoadingSendEstatus
                  }
                  radius="md"
                  size="sm"
                  className="text-white"
                >
                  <i className="bi bi-send" />
                  Reenviar estatus
                </Button>

              )}
            </>

          )}

        </Box>

      </DialogActions>

    </Dialog>
  );
}

export default PanelEnvio;