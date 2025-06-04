import {
  AutocompleteElement,
  RadioButtonGroup,
  SelectElement,
  TextareaAutosizeElement,
  CheckboxElement,
  TextFieldElement,
} from 'react-hook-form-mui';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import {
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  InputAdornment,
} from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';

import type { IncidentCreate } from '../models';
import { useVehicleQueries } from '@/modules/vehicles/hooks/queries';
import {
  getIncidentOptions,
} from '../utilities';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useIncidentsQueries } from '../hooks/quries';
import { useDriverQueries } from '@/modules/drivers/hooks/queries';

import { FileUploadInput } from '@/components/inputs';
import { Button, MuiSaveButton } from '@/components/ui';

const initialFormState: IncidentCreate = {
  startDate: null,
  endDate: null,
  incident: '',
  comments: '',
  type: 'operative',
  incidentDate: dayjs(),
  damageCost: null,
  isDriverResponsible: true,
  vehicleId: null,
  driverId: null,
};

interface Props {
  onCancel?: () => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  driverId?: number;
}

export const CreateIncidentForm = ({
  onCancel,
  onSuccess,
  driverId,
}: Props) => {
  const [files, setFiles] = useState<File[]>([]);

  const [createUnavailability, setCreateUnavailability] = useState(false);

  const { vehicleQuery } = useVehicleQueries();
  const { AvailableDrivers, isLoading } = useDriverQueries();

  const {
    createIncident: { mutate, isPending },
  } = useIncidentsQueries( {driverId} );

  const { control, handleSubmit, setValue, watch, reset } =
    useForm<IncidentCreate>({
      defaultValues: initialFormState,
    });

  const selectedType = watch('type');

  const incidenceOptions = getIncidentOptions(selectedType);

  const damageCostDisabled = selectedType !== 'legal' && selectedType !== 'maintenance';

  const onSubmit: SubmitHandler<IncidentCreate> = (data) => {
    if (isPending) return;

    const driverIdToUse = driverId || data.driverId;

    if (!driverIdToUse) return;

    mutate(
      {
        driverId: driverIdToUse,
        incident: {
          ...data,
        },
        files: files,
      },
      {
        onSuccess: () => {
          onSuccess?.();
          reset(initialFormState);
          setFiles([]);
        },
      },
    );
  };

  return (
    <form className="mt-6 transition-all duration-300 ease-in-out">
      <div
        className={`grid gap-6 transition-all duration-300 ease-in-out grid-cols-[1fr_auto_1fr]`}
      >
        {/* Columna izquierda: campos base */}
        <div className="flex flex-col gap-4 max-w-sm">
          <RadioButtonGroup
            control={control}
            label="Tipo de Incidencia"
            name="type"
            required
            rules={{ required: 'Tipo de incidencia requerido' }}
            options={[
              { id: 'operative', label: 'Operativa' },
              { id: 'legal', label: 'Legal' },
              { id: 'cleaning', label: 'Limpieza' },
              { id: 'maintenance', label: 'Mantenimiento' },
            ]}
            row
          />
          <SelectElement
            control={control}
            name="incident"
            label="Incidencia"
            size="small"
            required
            rules={{ required: 'Tipo de incidencia requerida' }}
            options={incidenceOptions}
          />

          {!driverId && (
            <AutocompleteElement
              control={control}
              name="driverId"
              label="Operador"
              options={
                AvailableDrivers.map((v) => ({
                  label: v.value,
                  id: v.key,
                })) || []
              }
              loading={isLoading}
              autocompleteProps={{
                getOptionKey: (option) => option.id,
                onChange: (_, value) => {
                  setValue('driverId', (value?.id as number) || 0);
                },
                size: 'small',
              }}
            />
          )}
          <DatePickerElement
            control={control}
            name="incidentDate"
            label="Fecha de Incidencia"
            required
            rules={{ required: 'Fecha de incidencia requerida' }}
            inputProps={{ size: 'small' }}
          />
          <TextareaAutosizeElement
            control={control}
            name="comments"
            label="Comentarios"
            minRows={6}
            required
            rules={{ required: 'Comentario requerido' }}
          />
          <div className="flex flex-row items-center justify-between">
            <CheckboxElement
              control={control}
              name="isDriverResponsible"
              label="¿El operador es responsable?"
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={createUnavailability}
                    onChange={(e) => setCreateUnavailability(e.target.checked)}
                  />
                }
                label="Crear Indisponibilidad"
              />
            </FormGroup>
          </div>
        </div>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            mx: 2,
            transition: 'opacity 0.3s',
          }}
        />

        {/* Columna derecha: campos condicionales */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-medium font-bold text-muted-foreground">
                Crear Indisponibilidad
              </h3>
              <p className="text-xs text-muted-foreground">
                Rellene los siguientes campos para registrar una
                indisponibilidad.
              </p>
            </div>

            <DatePickerElement
              control={control}
              name="startDate"
              label="Fecha Inicio"
              disabled={!createUnavailability}
              required
              rules={{ required: 'Fecha de inicio requerida' }}
              inputProps={{ size: 'small' }}
            />
            <DatePickerElement
              control={control}
              name="endDate"
              label="Fecha Fin"
              disabled={!createUnavailability}
              required
              rules={{ required: 'Fecha de fin requerida' }}
              inputProps={{ size: 'small' }}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-medium font-bold text-muted-foreground">
                Detalles Legales
              </h3>
              <p className="text-xs text-muted-foreground">
                Ingrese la información relacionada con el incidente legal.
              </p>
            </div>

            <TextFieldElement
              control={control}
              name="damageCost"
              label="Coste de Daños"
              type="number"
              size="small"
              disabled={damageCostDisabled}
              rules={{
                validate: (value) =>
                  value === null || value >= 0 || 'El coste debe ser positivo',
              }}
              helperText="Si no se conoce el coste, dejar en blanco"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
            />

            <AutocompleteElement
              control={control}
              name="vehicleId"
              label="Unidad Afectada"
              options={
                vehicleQuery.data?.map((v) => ({
                  label: v.name,
                  id: v.id,
                })) || []
              }
              loading={vehicleQuery.isLoading}
              autocompleteProps={{
                getOptionKey: (option) => option.id,
                onChange: (_, value) => {
                  setValue('vehicleId', value?.id || 0);
                },
                size: 'small',
              }}
              textFieldProps={{
                helperText: 'Seleccionar unidad afectada, si aplica',
              }}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-medium font-bold text-muted-foreground">
                Adjuntar evidencias
              </h3>
              <p className="text-xs text-muted-foreground">
                Arrastra y suelta imágenes o haz clic para seleccionar.
              </p>
            </div>

            <FileUploadInput
              files={files}
              setFiles={setFiles}
              acceptedFileTypes="image/jpeg, image/png"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-6">
        {onCancel && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        )}
        <MuiSaveButton
          variant="contained"
          loadingPosition="end"
          onClick={handleSubmit(onSubmit)}
          loading={isPending}
        />
      </div>
    </form>
  );
};

