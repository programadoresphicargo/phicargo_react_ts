import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Typography,
} from '@mui/material';
import { MuiCloseButton, MuiSaveButton } from '@/components/ui';
import { SubmitHandler, useForm } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';
import { useMaintenanceRecord, useVehicles, useWorkshop } from '../hooks';
import { Button } from '@heroui/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddWorkshop from './AddWorkshop';
import type { MaintenanceRecordCreate } from '../models';
import { useState } from 'react';
import { Controller } from "react-hook-form";
import { Textarea, Select, SelectItem, Autocomplete, AutocompleteItem, Input, DatePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";

const SUPERVISORS = [
  {
    label: 'CONTRERAS HERNANDEZ ANDRES',
    id: 'CONTRERAS HERNANDEZ ANDRES',
  },
  {
    label: 'DE LA PARRA TRUJILLO SERGIO',
    id: 'DE LA PARRA TRUJILLO SERGIO',
  },
  {
    label: 'ORTIZ DIAZ CARLOS EDUARDO',
    id: 'ORTIZ DIAZ CARLOS EDUARDO',
  },
  {
    label: 'BENITEZ CESAR FERNANDO',
    id: 'BENITEZ CESAR FERNANDO',
  },
];

const initialFormState: MaintenanceRecordCreate = {
  workshopId: '' as unknown as number,
  failType: 'MC',
  checkIn: dayjs(),
  status: 'pending',
  deliveryDate: null as unknown as Dayjs,
  supervisor: '',
  comments: '',
  order: '',
  vehicleId: '' as unknown as number,
  daysInWorkshop: 0
};

interface Props {
  type: "tractocamion" | "remolques";
  onClose: () => void;
}

export const CreateRecordForm = ({ type, onClose }: Props) => {

  const { vehicleQuery, VehicleSelectOptions } = useVehicles(type);

  const [addWorkshop, setAddWorkshop] = useState(false);

  const {
    workshopQuery: { data: workshops, isFetching: loadingWorkshops },
  } = useWorkshop();

  const {
    addRecordMutation: { mutate: addRegister, isPending },
  } = useMaintenanceRecord(type);

  const { control, handleSubmit, setValue, watch } =
    useForm<MaintenanceRecordCreate>({
      defaultValues: initialFormState,
    });

  const checkIn = watch('checkIn');

  const onSubmit: SubmitHandler<MaintenanceRecordCreate> = (data) => {
    addRegister(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 15px',
          color: 'white',
          background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
        }}
      >
        <Typography
          sx={{
            color: 'white',
            fontSize: '1.25rem',
            fontFamily: 'Inter'
          }}
        >
          Nuevo Registro
        </Typography>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <MuiCloseButton onClick={onClose} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <form className="flex flex-col gap-4 mt-6">
          <Controller
            name="vehicleId"
            control={control}
            rules={{ required: "Unidad Requerida" }}
            render={({ field, fieldState }) => (
              <Autocomplete
                isClearable={false}
                label="Unidad"
                isRequired
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                isLoading={vehicleQuery.isLoading}
                selectedKey={field.value ? String(field.value) : null} // 🔑 convertir number -> string
                onSelectionChange={(key) => {
                  const value = key ? Number(key) : 0; // 🔑 convertir string/null -> number
                  field.onChange(value);
                  setValue("vehicleId", value);
                }}
              >
                {VehicleSelectOptions.map((v) => (
                  <AutocompleteItem key={v.key}>
                    {v.value}
                  </AutocompleteItem>
                )) || []}
              </Autocomplete>
            )}
          />

          <Controller
            name="failType"
            control={control}
            rules={{ required: "Tipo de reporte requerido" }}
            render={({ field, fieldState }) => (
              <Select
                label="Tipo de reporte"
                isRequired
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                selectedKeys={field.value ? [field.value] : []}  // 🔑 HeroUI maneja selectedKeys
                onChange={(e) => field.onChange(e.target.value)} // actualiza react-hook-form
              >
                {[
                  { label: "Siniestro de la unidad", id: "SINIESTRO" },
                  { label: "Robo de la unidad", id: "ROBO" },
                  { label: "MC", id: "MC" },
                  { label: "EL", id: "EL" },
                  { label: "PV", id: "PV" },
                ].map((option) => (
                  <SelectItem key={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name="supervisor"
            control={control}
            rules={{ required: "Supervisor requerido" }}
            render={({ field, fieldState }) => (
              <Select
                label="Supervisor"
                isRequired
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                selectedKeys={field.value ? [field.value] : []} // 🔑 HeroUI usa selectedKeys
                onChange={(e) => field.onChange(e.target.value)} // actualiza react-hook-form
              >
                {SUPERVISORS.map((sup) => (
                  <SelectItem key={sup.id}>
                    {sup.label}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name="checkIn"
            control={control}
            rules={{ required: "Fecha de Ingreso Requerida" }}
            render={({ field, fieldState }) => {
              // Convertir Dayjs a CalendarDate
              const calendarValue = field.value ? parseDate(field.value.format("YYYY-MM-DD")) : null;

              return (
                <DatePicker
                  label="Fecha de Ingreso"
                  isRequired
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  value={calendarValue} // ✅ ahora es CalendarDate
                  onChange={(val) => {
                    // val es CalendarDate -> convertir a Dayjs para tu formulario
                    field.onChange(val ? dayjs(val.toString()) : null);
                  }}
                />
              );
            }}
          />

          <Controller
            name="deliveryDate"
            control={control}
            rules={{ required: "Fecha de entrega requerida" }}
            render={({ field, fieldState }) => {
              // Convertimos Dayjs (si ya usas Dayjs en el formulario) a CalendarDate
              const calendarValue = field.value ? parseDate(field.value.format("YYYY-MM-DD")) : null;

              return (
                <DatePicker
                  label="Fecha de Entrega Estimada"
                  isRequired
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  value={calendarValue} // ✅ CalendarDate compatible con HeroUI
                  onChange={(val) => {
                    // Convertimos CalendarDate de vuelta a Dayjs
                    field.onChange(val ? dayjs(val.toString()) : null);
                  }}
                />
              );
            }}
          />

          <div className="flex flex-row">
            <Controller
              name="workshopId"
              control={control}
              rules={{ required: "Taller requerido" }}
              render={({ field, fieldState }) => (
                <Select
                  label="Taller"
                  isRequired
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  selectedKeys={field.value ? [field.value] : []} // 🔑 HeroUI usa selectedKeys
                  onChange={(e) => field.onChange(e.target.value)} // actualiza react-hook-forms
                  disabled={loadingWorkshops}
                >
                  {workshops?.map((w) => (
                    <SelectItem key={w.id}>
                      {w.name}
                    </SelectItem>
                  )) || []}
                </Select>
              )}
            />
            <Tooltip title="Agregar Taller" placement="top-start">
              <button
                type="button"
                onClick={() => setAddWorkshop(true)}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                <AddCircleOutlineIcon />
              </button>
            </Tooltip>
          </div>

          <Controller
            name="order"
            control={control}
            rules={{
              required: !checkIn.isAfter(dayjs())
                ? "Orden de Servicio requerida"
                : false, // no required si checkIn es futura
            }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Orden de Servicio"
                isRequired={!checkIn.isAfter(dayjs())}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="comments"
            control={control}
            rules={{ required: "Motivo de Ingreso requerido" }}
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                variant="flat"
                label="Motivo de Ingreso"
                minRows={4}
                isRequired
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                value={field.value ?? ""}
              />
            )}
          />

        </form>
        <AddWorkshop open={addWorkshop} onClose={() => setAddWorkshop(false)} />
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 3,
          pt: '0',
        }}
      >
        <Button
          radius='full'
          color="danger"
          size="sm"
          onPress={onClose}>
          Cancelar
        </Button>
        <MuiSaveButton
          variant="contained"
          loading={isPending}
          loadingPosition="end"
          onClick={handleSubmit(onSubmit)}
        />
      </DialogActions>
    </>
  );
};

