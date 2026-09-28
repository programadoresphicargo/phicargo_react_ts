import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { Button } from '@heroui/react';

import { NumberInput } from '@/components/inputs';
import { useForm } from 'react-hook-form';
import odooApi from '@/api/odoo-api';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Odometer } from './odometers';

export default function OdometerForm({
  open,
  setOpen,
  vehicle_id,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  vehicle_id: number;
}) {
  const initialForm: Odometer = {
    vehicle_id: vehicle_id,
    value: 0,
  };

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<Odometer>({
    defaultValues: initialForm,
  });

  const [isLoading, setLoading] = useState<boolean>(false);

  // ============================================================
  // ACTUALIZAR VEHÍCULO CUANDO CAMBIA
  // ============================================================

  useEffect(() => {
    if (open) {
      reset({
        vehicle_id,
        value: 0,
      });
    }
  }, [open, vehicle_id, reset]);

  // ============================================================
  // GUARDAR
  // ============================================================

  const onSubmit = async (data: Odometer) => {
    try {
      setLoading(true);

      const res = await odooApi.post(
        '/maintenances/odometer/',
        data
      );

      if (res.data.status === 'success') {
        toast.success(res.data.message);

        reset({
          vehicle_id,
          value: 0,
        });

        setOpen(false);
      }
    } catch (error: any) {
      const detail =
        error.response?.data?.detail ||
        error.message ||
        'Ocurrió un error al registrar el odómetro.';

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
      maxWidth="sm"
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
              border
              border-white/15
              bg-white/10
            "
          >
            <SpeedOutlinedIcon
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
              Nuevo odómetro
            </Typography>

            <Typography
              sx={{
                color: 'rgba(255,255,255,0.72)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                mt: 0.5,
              }}
            >
              Registro de kilometraje del vehículo
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
        {/* Encabezado */}

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
              <DirectionsCarOutlinedIcon
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
                Registro de kilometraje
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: '#6b7280',
                  mt: 0.2,
                }}
              >
                Captura el kilometraje actual del vehículo.
              </Typography>
            </div>
          </div>
        </div>

        {/* ====================================================
            KILOMETRAJE
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
          <div className="mb-5 flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-blue-50
              "
            >
              <SpeedOutlinedIcon
                sx={{
                  fontSize: 22,
                  color: '#0456cf',
                }}
              />
            </div>

            <div>
              <p className="text-[13px] font-semibold text-slate-800">
                Kilometraje actual
              </p>

              <p className="text-[11px] text-slate-400">
                Ingresa el valor mostrado por el odómetro.
              </p>
            </div>
          </div>

          <NumberInput
            label="Kilometraje"
            control={control}
            name="value"
            rules={{
              required: 'Campo obligatorio',
            }}
          />

          {/* Información */}

          <div
            className="
              mt-4
              flex
              gap-3
              rounded-xl
              border
              border-blue-100
              bg-blue-50/70
              px-4
              py-3
            "
          >
            <InfoOutlinedIcon
              sx={{
                mt: 0.2,
                fontSize: 17,
                color: '#0456cf',
              }}
            />

            <p className="text-[11px] leading-5 text-blue-700/80">
              El kilometraje registrado se utilizará como referencia
              para el control y seguimiento de los mantenimientos
              preventivos del vehículo.
            </p>
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
        <div className="hidden sm:block">
          <span className="text-[11px] text-slate-400">
            Control de kilometraje
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
              font-medium
              text-slate-600
            "
            isDisabled={isLoading}
          >
            Cancelar
          </Button>

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
            Registrar
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
