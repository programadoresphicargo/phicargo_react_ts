// AsignacionViaje.tsx
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { useForm, Controller } from "react-hook-form";
import { CartaPorte } from "./types.ts";
import { VehicleAutocompleteInput } from "@/modules/vehicles/components/VehicleAutocompleteInput.tsx";
import { useAsignarViaje } from "./api/mutation.ts";
import { Shift } from "../models/shift-model.ts";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { DriverAutocompleteInput } from "@/modules/drivers/components/DriverAutocompleteInput.tsx";
import { useAsignarViajeSinTurno } from "./api/mutation_no_shift.ts";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  open: boolean;
  onClose: () => void;
  cp?: CartaPorte;
  shift: Shift | null;
  driver_id?: number | null;
  vehicle_id?: number | null;
}

interface FormValues {
  date_start: Dayjs | null;
  x_date_arrival_shed: Dayjs | null;
  x_eco_bel_id: number | null;
  x_operador_bel_id: number | null;
}

const AsignacionViaje: React.FC<Props> = ({ open, onClose, cp, shift, driver_id, vehicle_id }) => {

  const navigate = useNavigate();
  const asignarViajeMutation = useAsignarViaje();
  const asignarViajeSinTurnoMutation = useAsignarViajeSinTurno();

  const { control, reset, handleSubmit, setValue, formState: { errors }, } = useForm<FormValues>({
    defaultValues: {
      date_start: null,
      x_date_arrival_shed: null,
      x_eco_bel_id: null,
    },
  });

  // 🔄 Sincronizar datos cuando cambia cp
  React.useEffect(() => {
    reset({
      date_start: cp?.date_start
        ? dayjs.utc(cp.date_start).tz("America/Mexico_City")
        : null,

      x_date_arrival_shed: cp?.x_date_arrival_shed
        ? dayjs.utc(cp.x_date_arrival_shed).tz("America/Mexico_City")
        : null,

      x_eco_bel_id: vehicle_id ?? cp?.x_eco_bel_id ?? shift?.vehicle?.id ?? null,
      x_operador_bel_id: driver_id ? driver_id : shift?.driver.id ?? null,

    });
  }, [cp, open, reset]);

  React.useEffect(() => {
    if (asignarViajeMutation.isSuccess) {
    }
  }, [asignarViajeMutation.isSuccess, onClose]);

  const onSubmit = (data: FormValues) => {
    if (!cp?.id || !shift?.id) return;

    asignarViajeMutation.mutate({
      shiftId: shift.id,
      payload: {
        id_cp: cp.id,
        date_start: data.date_start
          ? data.date_start.utc().format()
          : null,
        x_date_arrival_shed: data.x_date_arrival_shed
          ? data.x_date_arrival_shed.utc().format()
          : null,
        x_eco_bel_id: data.x_eco_bel_id ? data.x_eco_bel_id : null,
        x_operador_bel_id: driver_id ? driver_id : shift.driver.id ?? null,
      },
    }, {
      onSuccess: () => {
        navigate('/turnos');
      },
    });
  };

  const onSubmit2 = (data: FormValues) => {
    if (!cp?.id) return;

    asignarViajeSinTurnoMutation.mutate({
      payload: {
        id_cp: cp.id,
        date_start: data.date_start
          ? data.date_start.utc().format()
          : null,
        x_date_arrival_shed: data.x_date_arrival_shed
          ? data.x_date_arrival_shed.utc().format()
          : null,
        x_eco_bel_id: data.x_eco_bel_id ? data.x_eco_bel_id : null,
        x_operador_bel_id: data.x_operador_bel_id
      },
    }, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <AppBar sx={{
        position: 'relative',
        background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
        color: 'white',
      }} elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => onClose()}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Asignación de viaje
          </Typography>
          <Button autoFocus color="inherit" onClick={() => onClose()}>
            Cerrar
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent dividers>
        {/* INFO */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ⬅️ IZQUIERDA: INFO DEL VIAJE */}
          <div>

            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              Información del viaje
            </h2>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">

              <span className="text-gray-500">Turno</span>
              <span className="font-medium">{shift?.id}</span>

              <span className="text-gray-500">ID</span>
              <span className="font-medium">{cp?.id}</span>

              <span className="text-gray-500">Carta porte</span>
              <span className="font-medium">{cp?.name}</span>

              <span className="text-gray-500">Cliente</span>
              <span className="font-medium">{cp?.cliente}</span>

              <span className="text-gray-500">Modo</span>
              <span className="font-medium">{cp?.x_modo_bel}</span>

              <span className="text-gray-500">Tipo</span>
              <span className="font-medium">{cp?.x_tipo_bel}</span>

              <span className="text-gray-500">Ruta</span>
              <span className="font-medium">{cp?.x_ruta_bel}</span>

              <span className="text-gray-500">Custodia</span>
              <span className="font-medium">{cp?.x_custodia_bel}</span>

              <span className="text-gray-500">Punto de carga</span>
              <span className="font-medium">{cp?.upload_point}</span>

              <span className="text-gray-500">Punto de descarga</span>
              <span className="font-medium">{cp?.download_point}</span>
            </div>

          </div>

          {/* ➡️ DERECHA: FORMULARIO */}
          <div>

            <h2 className="text-sm font-semibold text-gray-700 mb-5">
              Programación
            </h2>
            {/* FECHAS */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex flex-col gap-4 text-sm mb-6">
                <Controller
                  name="date_start"
                  control={control}
                  rules={{ required: "El inicio programado es obligatorio" }}
                  render={({ field }) => (
                    <DateTimePicker
                      label="Inicio programado"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          error: !!errors.date_start,
                          helperText: errors.date_start?.message,
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="x_date_arrival_shed"
                  control={control}
                  rules={{ required: "Llegada a planta programada es obligatoria" }}
                  render={({ field }) => (
                    <DateTimePicker
                      label="Llegada a planta programada"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          error: !!errors.x_date_arrival_shed,
                          helperText: errors.x_date_arrival_shed?.message,
                        },
                      }}
                    />
                  )}
                />
                <DriverAutocompleteInput
                  control={control}
                  label="Operador"
                  name="x_operador_bel_id"
                  setValue={setValue}
                  isDisabled={shift ? true : false}
                  rules={{ required: "El Operador es obligatorio" }} />
                <VehicleAutocompleteInput
                  control={control}
                  name="x_eco_bel_id"
                  label="ECO Programado"
                  setValue={setValue}
                  helperText="El ECO es obligatorio"
                  rules={{ required: "El ECO es obligatorio" }} />
              </div>
            </LocalizationProvider>
          </div>

        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>

        {shift && (
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={asignarViajeMutation.isPending}
          >
            {asignarViajeMutation.isPending ? "Guardando..." : "Guardar"}
          </Button>
        )}

        {!shift && (
          <Button
            color="success"
            variant="contained"
            onClick={handleSubmit(onSubmit2)}
            disabled={asignarViajeSinTurnoMutation.isPending}
          >
            {asignarViajeSinTurnoMutation.isPending ? "Guardando..." : "Guardar"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AsignacionViaje;
