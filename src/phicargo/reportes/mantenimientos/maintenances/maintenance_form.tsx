import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import { Button } from '@heroui/react';

import {
  AutocompleteInput,
  DatePickerInput,
  NumberInput,
  TextareaInput,
} from '@/components/inputs';

import { useForm } from 'react-hook-form';
import odooApi from '@/api/odoo-api';
import { SelectItem } from '@/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import dayjs, { Dayjs } from 'dayjs';
import { Vehicle } from '@/modules/vehicles/models';

export type Maintenance = {
  id: number | null;
  vehicle_id: number | null;
  task_id: number | null;
  mileage: number | null;
  observaciones: string;
  date: Dayjs | null;
};

export type Task = {
  id: number;
  name: string;
};

export default function MaintenanceForm({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number | null;
}) {
  const initialForm: Maintenance = {
    id: null,
    vehicle_id: null,
    mileage: null,
    task_id: null,
    observaciones: '',
    date: dayjs(),
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<Maintenance>({
    defaultValues: initialForm,
  });

  const [task, setTask] = useState<SelectItem[]>([]);
  const [vehicles, setVehicles] = useState<SelectItem[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const vehicleId = watch('vehicle_id');

  // ============================================================
  // OBTENER TIPOS DE MANTENIMIENTO
  // ============================================================

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
      const detail =
        error.response?.data?.detail ||
        error.message ||
        'No fue posible obtener los tipos de mantenimiento.';

      toast.error(detail);
    }
  };

  const getVehicles = async (): Promise<void> => {
    try {
      const response = await odooApi.get<Vehicle[]>(
        '/vehicles/equipos/'
      );

      setVehicles(
        response.data.map((registro) => ({
          key: registro.id,
          value: registro.name,
        }))
      );
    } catch (error: any) {
      const detail =
        error.response?.data?.detail ||
        error.message ||
        'No fue posible obtener los tipos de mantenimiento.';

      toast.error(detail);
    }
  };

  // ============================================================
  // OBTENER MANTENIMIENTO
  // ============================================================

  const getMantenance = async (
    maintenanceId: number
  ): Promise<void> => {
    try {
      const response = await odooApi.get<Maintenance>(
        `/maintenances/${maintenanceId}`
      );

      reset(response.data);
    } catch (error: any) {
      const detail =
        error.response?.data?.detail ||
        error.message ||
        'No fue posible obtener el mantenimiento.';

      toast.error(detail);
    }
  };

  // ============================================================
  // GUARDAR / ACTUALIZAR
  // ============================================================

  const onSubmit = async (data: Maintenance) => {
    try {
      setLoading(true);

      let res;

      if (id != null) {
        res = await odooApi.patch(
          `/maintenances/${id} `,
          data
        );
      } else {
        res = await odooApi.post(
          '/maintenances/',
          data
        );
      }

      if (res.data.status === 'success') {
        toast.success(res.data.message);

        reset(initialForm);

        setOpen(false);
      }
    } catch (error: any) {
      const detail =
        error.response?.data?.detail ||
        error.message ||
        'Ocurrió un error al guardar el mantenimiento.';

      toast.error('Error: ' + detail);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // OBTENER KILOMETRAJE DEL VEHÍCULO
  // ============================================================

  useEffect(() => {
    if (!vehicleId) {
      setValue('mileage', null);
      return;
    }

    const loadMileage = async () => {
      try {
        const response = await odooApi.get(
          `/vehicles/${vehicleId} `
        );

        setValue(
          'mileage',
          response.data.odometer,
          {
            shouldValidate: true,
            shouldDirty: false,
          }
        );
      } catch (error) {
        setValue('mileage', null);
      }
    };

    loadMileage();
  }, [vehicleId, setValue]);

  // ============================================================
  // INICIALIZACIÓN
  // ============================================================

  useEffect(() => {
    if (!open) return;

    getTask();
    getVehicles();

    if (id !== null) {
      getMantenance(id);
    } else {
      reset(initialForm);
    }
  }, [open, id]);

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
      {/* ======================================================
          HEADER
      ======================================================= */}

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
          {/* Icono principal */}

          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/15
              bg-white/10
            "
          >
            <BuildOutlinedIcon
              sx={{
                color: 'white',
                fontSize: 23,
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
                ? 'Nuevo mantenimiento'
                : 'Editar mantenimiento'}
            </Typography>

            <Typography
              sx={{
                color: 'rgba(255,255,255,0.72)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                mt: 0.5,
              }}
            >
              Registro de mantenimiento del vehículo
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
                backgroundColor:
                  'rgba(255,255,255,0.12)',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ======================================================
          CONTENT
      ======================================================= */}

      <DialogContent
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
          backgroundColor: '#f8fafc',
        }}
      >
        {/* ====================================================
            DESCRIPCIÓN
        ===================================================== */}

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
              <SettingsOutlinedIcon
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
                Información del mantenimiento
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: '#6b7280',
                  mt: 0.2,
                }}
              >
                Registra los datos correspondientes al servicio
                realizado al vehículo.
              </Typography>
            </div>
          </div>
        </div>

        {/* ====================================================
            VEHÍCULO
        ===================================================== */}

        <div
          className="
            mb-4
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >
          <div className="mb-4 flex items-center gap-2">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-slate-100
              "
            >
              <DirectionsCarOutlinedIcon
                sx={{
                  fontSize: 18,
                  color: '#475569',
                }}
              />
            </div>

            <div>
              <p className="text-[13px] font-semibold text-slate-800">
                Vehículo
              </p>

              <p className="text-[11px] text-slate-400">
                Selecciona el equipo al que corresponde el mantenimiento.
              </p>
            </div>
          </div>

          <AutocompleteInput
            label="Vehiculo"
            control={control}
            name="vehicle_id"
            items={vehicles}
            rules={{ required: "Campo obligatorio" }}
          />
        </div>

        {/* ====================================================
            DATOS DEL SERVICIO
        ===================================================== */}

        <div
          className="
            mb-4
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >
          <div className="mb-4 flex items-center gap-2">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-slate-100
              "
            >
              <BuildOutlinedIcon
                sx={{
                  fontSize: 18,
                  color: '#475569',
                }}
              />
            </div>

            <div>
              <p className="text-[13px] font-semibold text-slate-800">
                Datos del servicio
              </p>

              <p className="text-[11px] text-slate-400">
                Información principal del mantenimiento realizado.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Fecha */}

            <div>
              <div className="mb-2 flex items-center gap-2">
                <CalendarMonthOutlinedIcon
                  sx={{
                    fontSize: 17,
                    color: '#64748b',
                  }}
                />

                <span
                  className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
                  Fecha
                </span>
              </div>

              <DatePickerInput
                control={control}
                name="date"
                label="Fecha de ingreso"
                initialValue={dayjs()}
                rules={{
                  required: 'Campo obligatorio',
                }}
              />
            </div>

            {/* Kilometraje */}

            <div>
              <div className="mb-2 flex items-center gap-2">
                <SpeedOutlinedIcon
                  sx={{
                    fontSize: 17,
                    color: '#64748b',
                  }}
                />

                <span
                  className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
                  Kilometraje
                </span>
              </div>

              <NumberInput
                label="Kilometraje"
                control={control}
                name="mileage"
                rules={{
                  required: 'Campo obligatorio',
                }}
              />

              <p className="mt-1.5 text-[11px] text-slate-400">
                Se obtiene automáticamente del odómetro del vehículo.
              </p>
            </div>

            {/* Tipo de mantenimiento */}

            <div className="md:col-span-2">
              <div className="mb-2 flex items-center gap-2">
                <BuildOutlinedIcon
                  sx={{
                    fontSize: 17,
                    color: '#64748b',
                  }}
                />

                <span
                  className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
                  Tipo de servicio
                </span>
              </div>

              <AutocompleteInput
                label="Tipo de servicio"
                control={control}
                name="task_id"
                items={task}
                rules={{
                  required: 'Campo obligatorio',
                }}
              />
            </div>
          </div>
        </div>

        {/* ====================================================
            OBSERVACIONES
        ===================================================== */}

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
          <div className="mb-4 flex items-center gap-2">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-slate-100
              "
            >
              <DescriptionOutlinedIcon
                sx={{
                  fontSize: 18,
                  color: '#475569',
                }}
              />
            </div>

            <div>
              <p className="text-[13px] font-semibold text-slate-800">
                Observaciones
              </p>

              <p className="text-[11px] text-slate-400">
                Agrega información adicional sobre el servicio.
              </p>
            </div>
          </div>

          <TextareaInput
            control={control}
            name="observaciones"
            label="Observaciones"
          />
        </div>

        {/* ====================================================
            INFORMACIÓN
        ===================================================== */}

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
              <SpeedOutlinedIcon
                sx={{
                  fontSize: 15,
                  color: '#0456cf',
                }}
              />
            </div>

            <div>
              <p className="text-[12px] font-semibold text-blue-900">
                Información del odómetro
              </p>

              <p className="mt-0.5 text-[11px] leading-5 text-blue-700/80">
                Al seleccionar un vehículo, el kilometraje registrado
                actualmente se carga automáticamente para facilitar
                el registro del mantenimiento.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* ======================================================
          FOOTER
      ======================================================= */}

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
        {/* Texto */}

        <div className="hidden sm:block">
          <span className="text-[11px] text-slate-400">
            Registro de mantenimiento
          </span>
        </div>

        {/* Acciones */}

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
              font-medium
              text-slate-600
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
              onPress={() => handleSubmit(onSubmit)()}
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
