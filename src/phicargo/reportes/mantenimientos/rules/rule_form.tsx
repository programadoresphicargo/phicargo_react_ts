import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';

import { Button, Select, SelectItem } from '@heroui/react';
import {
  AutocompleteInput,
  NumberInput,
  SelectInput,
} from '@/components/inputs';

import { Controller, useForm, useWatch } from 'react-hook-form';
import odooApi from '@/api/odoo-api';
import { SelectItem as SelectItemType } from '@/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type UnidadIntervalo = 'km' | 'dias' | 'horas';

type Configuraciones = {
  model_id: number | null;
  task_id: number | null;
  intervalo: number | null;
  unidad_intervalo: UnidadIntervalo | '';
  prefixes: string[];
};

type Modelos = {
  id: number;
  modelo: string;
  marca: string;
};

type Task = {
  id: number;
  name: string;
};

export default function MaintenanceRuleForm({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number | null;
}) {
  const initialForm: Configuraciones = {
    model_id: null,
    intervalo: null,
    task_id: null,
    unidad_intervalo: '',
    prefixes: [],
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    clearErrors,
  } = useForm<Configuraciones>({
    defaultValues: initialForm,
  });

  const [modelos, setModelos] = useState<SelectItemType[]>([]);
  const [task, setTask] = useState<SelectItemType[]>([]);
  const [isLoading, setLoading] = useState(false);

  const selectedPrefixes = useWatch({
    control,
    name: 'prefixes',
  });

  const selectedModel = useWatch({
    control,
    name: 'model_id',
  });

  const hasPrefixes = (selectedPrefixes ?? []).length > 0;
  const hasModel =
    selectedModel !== null &&
    selectedModel !== undefined &&
    selectedModel !== ('' as unknown);

  // Si se selecciona un modelo, se eliminan los prefijos.
  useEffect(() => {
    if (hasModel && (selectedPrefixes ?? []).length > 0) {
      setValue('prefixes', [], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [hasModel, selectedPrefixes, setValue]);

  const obtenerModelos = async (): Promise<void> => {
    try {
      const response = await odooApi.get<Modelos[]>(
        '/vehicles/models/'
      );

      setModelos(
        response.data.map((registro) => ({
          key: registro.id,
          value: `${registro.marca} ${registro.modelo}`,
        }))
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail ||
        'No fue posible obtener los modelos.'
      );
    }
  };

  const getTask = async (): Promise<void> => {
    try {
      const response = await odooApi.get<Task[]>(
        '/maintenance-record/tasks/'
      );

      setTask(
        response.data.map((registro) => ({
          key: registro.id,
          value: registro.name,
        }))
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail ||
        'No fue posible obtener los tipos de servicio.'
      );
    }
  };

  const getMantenanceRule = async (
    ruleId: number
  ): Promise<void> => {
    try {
      const response = await odooApi.get<Configuraciones>(
        `/maintenances/rule/${ruleId}`
      );

      const data = response.data;

      // Normalizar datos que puedan venir nulos desde la API.
      const modelId = data.model_id ?? null;
      const prefixes = data.prefixes ?? [];

      reset({
        ...initialForm,
        ...data,
        model_id: modelId,
        prefixes: modelId !== null ? [] : prefixes,
        unidad_intervalo: data.unidad_intervalo ?? '',
      });
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail ||
        error.message ||
        'No fue posible obtener la regla.'
      );
    }
  };

  useEffect(() => {
    if (!open) return;

    obtenerModelos();
    getTask();

    if (id !== null) {
      getMantenanceRule(id);
    } else {
      reset(initialForm);
    }
    // Se ejecuta al abrir el formulario o cambiar la regla.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, id]);

  const onSubmit = async (data: Configuraciones) => {
    // Validación de seguridad antes de enviar al backend.
    const hasSelectedPrefixes = (data.prefixes ?? []).length > 0;
    const hasSelectedModel =
      data.model_id !== null &&
      data.model_id !== undefined;

    if (hasSelectedPrefixes && hasSelectedModel) {
      toast.error(
        'Selecciona un tipo de vehículo o un modelo, no ambos.'
      );
      return;
    }

    if (!hasSelectedPrefixes && !hasSelectedModel) {
      toast.error(
        'Selecciona un tipo de vehículo o un modelo para la regla.'
      );
      return;
    }

    const payload: Configuraciones = {
      ...data,
      model_id: hasSelectedModel ? data.model_id : null,
      prefixes: hasSelectedPrefixes ? data.prefixes : [],
    };

    try {
      setLoading(true);

      const res = await odooApi.post(
        '/maintenances/rule/',
        payload
      );

      if (res.data.status === 'success') {
        toast.success(res.data.message);
        setOpen(false);
        reset(initialForm);
      }
    } catch (error: any) {
      toast.error(
        'Error: ' +
        (error.response?.data?.detail ||
          error.message ||
          'Ocurrió un error al guardar la regla.')
      );
    } finally {
      setLoading(false);
    }
  };

  const Update = async (data: Configuraciones) => {
    if (id === null) return;

    const hasSelectedPrefixes = (data.prefixes ?? []).length > 0;
    const hasSelectedModel =
      data.model_id !== null &&
      data.model_id !== undefined;

    if (hasSelectedPrefixes && hasSelectedModel) {
      toast.error(
        'Selecciona un tipo de vehículo o un modelo, no ambos.'
      );
      return;
    }

    if (!hasSelectedPrefixes && !hasSelectedModel) {
      toast.error(
        'Selecciona un tipo de vehículo o un modelo para la regla.'
      );
      return;
    }

    const payload: Configuraciones = {
      ...data,
      model_id: hasSelectedModel ? data.model_id : null,
      prefixes: hasSelectedPrefixes ? data.prefixes : [],
    };

    try {
      setLoading(true);

      const res = await odooApi.patch(
        `/maintenances/rule/${id}`,
        payload
      );

      if (res.data.status === 'success') {
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error: any) {
      toast.error(
        'Error: ' +
        (error.response?.data?.detail ||
          error.message ||
          'Ocurrió un error al actualizar la regla.')
      );
    } finally {
      setLoading(false);
    }
  };

  const cerrarFormulario = () => {
    if (isLoading) return;
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={cerrarFormulario}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: '18px',
          overflow: 'hidden',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.20)',
          backgroundColor: '#f8fafc',
        },
      }}
    >
      <AppBar
        position="relative"
        elevation={0}
        sx={{
          background:
            'linear-gradient(135deg, #002887 0%, #0647a8 100%)',
        }}
      >
        <Toolbar
          sx={{
            minHeight: '76px !important',
            px: { xs: 2, sm: 3 },
          }}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10">
            <SettingsOutlinedIcon
              sx={{ color: 'white', fontSize: 24 }}
            />
          </div>

          <div className="ml-3 flex-1">
            <Typography
              sx={{
                color: 'white',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '17px',
                lineHeight: 1.2,
              }}
            >
              {id === null
                ? 'Nueva regla de mantenimiento'
                : 'Editar regla de mantenimiento'}
            </Typography>

            <Typography
              sx={{
                color: 'rgba(255,255,255,0.72)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                mt: 0.5,
              }}
            >
              Configuración de mantenimiento preventivo
            </Typography>
          </div>

          <IconButton
            onClick={cerrarFormulario}
            disabled={isLoading}
            sx={{
              color: 'white',
              width: 38,
              height: 38,
              borderRadius: '10px',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.12)',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <DialogContent
        sx={{
          p: { xs: 2, sm: 3 },
          backgroundColor: '#f8fafc',
        }}
      >
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <BuildOutlinedIcon
                sx={{ fontSize: 18, color: '#0456cf' }}
              />
            </div>

            <div>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#172033',
                }}
              >
                Parámetros de la regla
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: '#6b7280',
                  mt: 0.2,
                }}
              >
                Define a qué equipos aplica y cuándo debe realizarse
                el mantenimiento.
              </Typography>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Aviso de selección excluyente */}
            <div className="md:col-span-2">
              <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                  <SettingsOutlinedIcon
                    sx={{ fontSize: 17, color: '#0456cf' }}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Selecciona una sola forma de aplicación
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-800/90">
                    <strong>Tipo de vehículo:</strong> elige uno o
                    varios tipos de vehiculos para aplicar la regla a esos tipos
                    de equipo.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-800/90">
                    <strong>Modelo del vehículo:</strong> elige un
                    modelo para aplicar la regla específicamente a él.
                  </p>

                  <p className="mt-2 text-xs font-semibold text-blue-900">
                    No puedes usar ambas opciones al mismo tiempo.
                    La opción contraria se limpiará automáticamente.
                  </p>
                </div>
              </div>
            </div>

            {/* Tipo de vehículo / prefijos */}
            <div className="md:col-span-2">
              <div className="mb-2 flex items-center gap-2">
                <DirectionsCarOutlinedIcon
                  sx={{ fontSize: 18, color: '#64748b' }}
                />
                <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                  Tipo de vehículo
                </span>
              </div>

              <Controller
                control={control}
                name="prefixes"
                render={({ field, fieldState }) => (
                  <Select
                    size="sm"
                    selectionMode="multiple"
                    label="Tipo de vehículo"
                    placeholder="Selecciona uno o varios tipos"
                    selectedKeys={field.value ?? []}
                    onSelectionChange={(keys) => {
                      const prefixes = Array.from(keys).map(String);

                      field.onChange(prefixes);

                      // Al seleccionar prefijos, limpiar el modelo.
                      if (prefixes.length > 0) {
                        setValue('model_id', null, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        clearErrors('model_id');
                      }
                    }}
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    isDisabled={hasModel}
                  >
                    <SelectItem key="DL-">DOLLY</SelectItem>
                    <SelectItem key="MG-">
                      MOTOGENERADORES
                    </SelectItem>
                    <SelectItem key="SERVI/">SERVI</SelectItem>
                  </Select>
                )}
              />
            </div>

            {/* Modelo */}
            <div className="md:col-span-2">
              <div className="mb-2 flex items-center gap-2">
                <DirectionsCarOutlinedIcon
                  sx={{ fontSize: 18, color: '#64748b' }}
                />
                <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                  Modelo del vehículo
                </span>
              </div>

              <AutocompleteInput
                label="Modelo"
                control={control}
                name="model_id"
                items={modelos}
              />
            </div>

            {/* Intervalo */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <SpeedOutlinedIcon
                  sx={{ fontSize: 18, color: '#64748b' }}
                />
                <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                  Frecuencia
                </span>
              </div>

              <NumberInput
                label="Intervalo"
                control={control}
                name="intervalo"
                rules={{ required: 'Campo obligatorio' }}
              />

              <p className="mt-1.5 text-[11px] text-slate-400">
                Cantidad requerida para activar el mantenimiento.
              </p>
            </div>

            {/* Unidad */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <SpeedOutlinedIcon
                  sx={{ fontSize: 18, color: '#64748b' }}
                />
                <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                  Unidad
                </span>
              </div>

              <SelectInput
                control={control}
                name="unidad_intervalo"
                label="Unidad"
                items={[
                  { key: 'km', value: 'KM' },
                  { key: 'dias', value: 'Días' },
                  { key: 'horas', value: 'Horas' },
                ]}
                rules={{ required: 'Campo obligatorio' }}
              />

              <p className="mt-1.5 text-[11px] text-slate-400">
                Unidad de frecuencia del intervalo.
              </p>
            </div>

            {/* Servicio */}
            <div className="md:col-span-2">
              <div className="mb-2 flex items-center gap-2">
                <BuildOutlinedIcon
                  sx={{ fontSize: 18, color: '#64748b' }}
                />
                <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                  Mantenimiento
                </span>
              </div>

              <AutocompleteInput
                label="Tipo de servicio"
                control={control}
                name="task_id"
                items={task}
                rules={{ required: 'Campo obligatorio' }}
              />

              <p className="mt-1.5 text-[11px] text-slate-400">
                Servicio preventivo asociado a esta regla.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4">
        <div className="hidden sm:block">
          <span className="text-[11px] text-slate-400">
            Configuración de mantenimiento
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            onPress={cerrarFormulario}
            radius="full"
            size="sm"
            variant="flat"
            className="min-w-[90px] border border-slate-200 bg-white font-medium text-slate-600"
            isDisabled={isLoading}
          >
            Cancelar
          </Button>

          {id === null ? (
            <Button
              onPress={() => handleSubmit(onSubmit)()}
              color="primary"
              radius="full"
              size="sm"
              className="min-w-[105px] bg-[#0456cf] font-semibold text-white shadow-sm"
              isLoading={isLoading}
            >
              Guardar
            </Button>
          ) : (
            <Button
              onPress={() => handleSubmit(Update)()}
              color="warning"
              radius="full"
              size="sm"
              className="min-w-[110px] font-semibold text-white shadow-sm"
              isLoading={isLoading}
            >
              Actualizar
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
