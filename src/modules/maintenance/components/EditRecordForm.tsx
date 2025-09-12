import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { Button, MuiCloseButton, MuiSaveButton } from '@/components/ui';
import type { MaintenanceRecord, MaintenanceRecordUpdate } from '../models';
import { TextFieldElement } from 'react-hook-form-mui';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMaintenanceRecord, useWorkshop } from '../hooks';
import { Controller } from "react-hook-form";
import { Select, SelectItem, Textarea } from "@heroui/react";
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import { DatePicker } from "@heroui/react";
import { parseDate, } from "@internationalized/date";
import dayjs from "dayjs";

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

interface Props {
  onClose: () => void;
  record: MaintenanceRecord;
}

export const EditRecordForm = ({ onClose, record }: Props) => {
  const { handleSubmit, control, watch } = useForm<MaintenanceRecordUpdate>({
    defaultValues: transformRecordToRecordEdit(record),
  });

  const {
    workshopQuery: { data: workshops },
  } = useWorkshop();

  const { editRecordMutation } = useMaintenanceRecord();

  const deliveryDate = watch('deliveryDate');
  const order = watch('order');
  const status = watch('status');

  const onSubmit: SubmitHandler<MaintenanceRecordUpdate> = (data) => {
    editRecordMutation.mutate(
      {
        id: record.id,
        updatedItem: data,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
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
          background: 'linear-gradient(90deg, #0b2149, #002887)',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: 'white',
            fontSize: '1.25rem',
            textTransform: 'uppercase',
          }}
        >
          Editar Registro:{' '}
          <Typography
            component="span"
            sx={{
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              textDecoration: 'underline',
            }}
          >
            {record.vehicle.name}
          </Typography>
        </Typography>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <MuiCloseButton onClick={onClose} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <form
          className="flex flex-col gap-4 mt-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Taller */}
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
                selectedKeys={field.value ? [String(field.value)] : []} // 🔑 HeroUI usa selectedKeys
                onChange={(e) => field.onChange(e.target.value)} // actualiza react-hook-forms
              >
                {workshops?.map((w) => (
                  <SelectItem key={w.id}>
                    {w.name}
                  </SelectItem>
                )) || []}
              </Select>
            )}
          />
          {/* Supervisor */}
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
                className="w-full"
              >
                {SUPERVISORS?.map((s) => (
                  <SelectItem key={s.id}>
                    {s.label}
                  </SelectItem>
                )) || []}
              </Select>
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
                <SelectItem key={"SINIESTRO"}>Siniestro de la unidad</SelectItem>
                <SelectItem key={"ROBO"}>Robo de la unidad</SelectItem>
                <SelectItem key={"MC"}>MC</SelectItem>
                <SelectItem key={"EL"}>EL</SelectItem>
                <SelectItem key={"PV"}>PV</SelectItem>
              </Select>
            )}
          />

          {status && status === 'programmed' && (
            <DatePickerElement
              control={control}
              name="checkIn"
              label="Fecha de Ingreso"
              inputProps={{
                size: 'small',
              }}
            />
          )}

          <Controller
            name="deliveryDate"
            control={control}
            render={({ field, fieldState }) => {
              // Convertimos Dayjs (si ya usas Dayjs en el formulario) a CalendarDate
              const calendarValue = field.value ? parseDate(field.value.format("YYYY-MM-DD")) : null;

              return (
                <DatePicker
                  label="Fecha de entrega"
                  value={calendarValue} // CalendarDate compatible con HeroUI
                  onChange={(val) => {
                    // Convertimos CalendarDate de vuelta a Dayjs
                    field.onChange(val ? dayjs(val.toString()) : null);
                  }}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                />
              );
            }}
          />

          {!deliveryDate?.isSame(record.deliveryDate, 'day') && (
            <Controller
              name="updateComments"
              control={control}
              rules={{ required: "Requerido si cambias la fecha de entrega" }}
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  label="Comentarios"
                  minRows={4}            // equivalente a rows={4}
                  isRequired
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
          )}

          {!order && (
            <TextFieldElement
              control={control}
              name="order"
              label="Order de Servicio"
              size="small"
            />
          )}
        </form>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 3,
          pt: '0',
        }}
      >
        <Button variant="outlined" color="error" size="small" onClick={onClose}>
          Cancelar
        </Button>
        <MuiSaveButton
          variant="contained"
          loading={editRecordMutation.isPending}
          loadingPosition="end"
          onClick={handleSubmit(onSubmit)}
        />
      </DialogActions>
    </>
  );
};

const transformRecordToRecordEdit = (
  data: MaintenanceRecord,
): MaintenanceRecordUpdate => {
  return {
    deliveryDate: data.deliveryDate,
    failType: data.failType,
    supervisor: data.supervisor,
    workshopId: data.workshop.id,
    order: data.order,
    checkIn: data.checkIn,
    status: data.status,
  };
};

