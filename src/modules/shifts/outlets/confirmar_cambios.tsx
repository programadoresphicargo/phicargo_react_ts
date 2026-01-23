// AsignacionViaje.tsx
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Dialog,
  DialogTitle,
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

dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  open: boolean;
  onClose: () => void;
  cp?: CartaPorte;
  shift: Shift;
}

interface FormValues {
  date_start: Dayjs | null;
  x_date_arrival_shed: Dayjs | null;
  x_eco_bel_id: number | null;
}

const AsignacionViaje: React.FC<Props> = ({ open, onClose, cp, shift }) => {

  const asignarViajeMutation = useAsignarViaje();

  const { control, reset, handleSubmit, setValue } = useForm<FormValues>({
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

      x_eco_bel_id: null,
    });
  }, [cp, open, reset]);

  React.useEffect(() => {
    if (asignarViajeMutation.isSuccess) {
      //onClose();
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
        x_eco_bel_id: data.x_eco_bel_id,
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Asignación de viaje</DialogTitle>

      <DialogContent dividers>
        {/* INFO */}

        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          Información del viaje
        </h2>

        <div className="grid grid-cols-4 gap-x-6 gap-y-2 text-sm mb-4">

          <span className="font-medium">{cp?.date_start}</span>
          <span className="font-medium">{cp?.x_date_arrival_shed}</span>

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
        </div>

        {/* FECHAS */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-6">
            <Controller
              name="date_start"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  label="Inicio programado"
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              )}
            />

            <Controller
              name="x_date_arrival_shed"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  label="Llegada a planta programada"
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              )}
            />
            <VehicleAutocompleteInput
              control={control}
              name="x_eco_bel_id"
              label="ECO Programado"
              setValue={setValue} />
          </div>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={asignarViajeMutation.isPending}
        >
          {asignarViajeMutation.isPending ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AsignacionViaje;
