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

import { Button } from '@heroui/react';

import { AutocompleteInput, NumberInput } from '@/components/inputs';
import { useForm } from 'react-hook-form';
import odooApi from '@/api/odoo-api';
import { SelectItem } from '@/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Configuraciones = {
  model_id: number | null;
  task_id: number | null;
  intervalo_km: number | null;
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
    intervalo_km: null,
    task_id: null,
  };

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<Configuraciones>({
    defaultValues: initialForm,
  });

  const [modelos, setModelos] = useState<SelectItem[]>([]);
  const [task, setTask] = useState<SelectItem[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const obtenerModelos = async (): Promise<void> => {
    try {
      const response = await odooApi.get<Modelos[]>(
        `/vehicles/models/ `
      );

      setModelos(
        response.data.map((registro) => ({
          key: registro.id,
          value: `${registro.marca} ${registro.modelo} `,
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
        `/maintenance-record/tasks/ `
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

  const getMantenanceRule = async (ruleId: number): Promise<void> => {
    try {
      const response = await odooApi.get<Configuraciones>(
        `/ maintenances / rule / ${ruleId} `
      );

      reset(response.data);
    } catch (error: any) {
      const detail =
        error.response?.data?.detail ||
        error.message ||
        'No fue posible obtener la regla.';

      toast.error(detail);
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
  }, [open, id]);

  const onSubmit = async (data: Configuraciones) => {
    try {
      setLoading(true);

      const res = await odooApi.post(
        '/maintenances/rule/',
        data
      );

      if (res.data.status === 'success') {
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error: any) {
      const detail =
        error.response?.data?.detail ||
        error.message ||
        'Ocurrió un error al guardar la regla.';

      toast.error('Error: ' + detail);
    } finally {
      setLoading(false);
    }
  };

  const Update = async (data: Configuraciones) => {
    try {
      setLoading(true);

      const res = await odooApi.patch(
        `/maintenances/rule/${id} `,
        data
      );

      if (res.data.status === 'success') {
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error: any) {
      const detail =
        error.response?.data?.detail ||
        error.message ||
        'Ocurrió un error al actualizar la regla.';

      toast.error('Error: ' + detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !isLoading && setOpen(false)}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: '18px',
          overflow: 'hidden',
          boxShadow:
            '0 24px 70px rgba(0, 0, 0, 0.20)',
          backgroundColor: '#f8fafc',
        },
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
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
            px: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          {/* Icono */}
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-white/10
              border
              border-white/15
            "
          >
            <SettingsOutlinedIcon
              sx={{
                color: 'white',
                fontSize: 24,
              }}
            />
          </div>

          {/* Título */}
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

          {/* Cerrar */}
          <IconButton
            onClick={() => setOpen(false)}
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

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <DialogContent
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
          backgroundColor: '#f8fafc',
        }}
      >
        {/* Descripción */}
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-blue-50
              "
            >
              <BuildOutlinedIcon
                sx={{
                  fontSize: 18,
                  color: '#0456cf',
                }}
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
                Define cuándo debe generarse el mantenimiento
                preventivo.
              </Typography>
            </div>
          </div>
        </div>

        {/* =====================================================
            FORM CARD
        ====================================================== */}
        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Modelo */}
            <div className="md:col-span-2">
              <div className="mb-2 flex items-center gap-2">
                <DirectionsCarOutlinedIcon
                  sx={{
                    fontSize: 18,
                    color: '#64748b',
                  }}
                />

                <span
                  className="
                    text-[12px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
                  Vehículo
                </span>
              </div>

              <AutocompleteInput
                label="Modelo"
                control={control}
                name="model_id"
                items={modelos}
                rules={{ required: 'Campo obligatorio' }}
              />
            </div>

            {/* Intervalo */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <SpeedOutlinedIcon
                  sx={{
                    fontSize: 18,
                    color: '#64748b',
                  }}
                />

                <span
                  className="
                    text-[12px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
                  Frecuencia
                </span>
              </div>

              <NumberInput
                label="Intervalo KM"
                control={control}
                name="intervalo_km"
                rules={{ required: 'Campo obligatorio' }}
              />

              <p className="mt-1.5 text-[11px] text-slate-400">
                Kilometraje requerido para activar el mantenimiento.
              </p>
            </div>

            {/* Servicio */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <BuildOutlinedIcon
                  sx={{
                    fontSize: 18,
                    color: '#64748b',
                  }}
                />

                <span
                  className="
                    text-[12px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
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

        {/* =====================================================
            INFO
        ====================================================== */}
        <div
          className="
            mt-4
            rounded-xl
            border
            border-blue-100
            bg-blue-50/70
            px-4
            py-3
          "
        >
          <div className="flex gap-3">
            <div
              className="
                mt-0.5
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-blue-100
              "
            >
              <SettingsOutlinedIcon
                sx={{
                  fontSize: 15,
                  color: '#0456cf',
                }}
              />
            </div>

            <div>
              <p className="text-[12px] font-semibold text-blue-900">
                ¿Cómo funciona esta configuración?
              </p>

              <p className="mt-0.5 text-[11px] leading-5 text-blue-700/80">
                La regla relaciona un modelo de vehículo con un
                tipo de servicio y establece cada cuántos
                kilómetros debe considerarse su mantenimiento.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          border-t
          border-slate-200
          bg-white
          px-5
          py-4
        "
      >
        <div className="hidden sm:block">
          <span className="text-[11px] text-slate-400">
            Configuración de mantenimiento
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            onPress={() => setOpen(false)}
            radius="full"
            size="sm"
            variant="flat"
            className="
              min-w-[90px]
              border
              border-slate-200
              bg-white
              text-slate-600
              font-medium
            "
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
              className="
                min-w-[105px]
                bg-[#0456cf]
                font-semibold
                text-white
                shadow-sm
              "
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
              className="
                min-w-[110px]
                font-semibold
                text-white
                shadow-sm
              "
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
