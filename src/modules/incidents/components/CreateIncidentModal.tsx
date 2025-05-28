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
  Box,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Typography,
} from '@mui/material';
import { Button, MuiCloseButton, MuiSaveButton } from '@/components/ui';
import { SubmitHandler, useForm } from 'react-hook-form';

import type { IncidentCreate } from '../models';
import { useVehicleQueries } from '@/modules/vehicles/hooks/queries';
import {
  LEGAL_INCIDENCE_OPTIONS,
  OPERATIVE_INCIDENCE_OPTIONS,
} from '../utilities';
import { useState } from 'react';
import dayjs from 'dayjs';

const initialFormState: IncidentCreate = {
  startDate: null,
  endDate: null,
  incident: '',
  comments: '',
  type: 'operative',
  incidentDate: dayjs(),
  damageCost: null,
  isDriverResponsible: true,
};

interface Props {
  onClose: () => void;
}

export const CreateIncidentModal = ({ onClose }: Props) => {
  const [createUnavailability, setCreateUnavailability] = useState(false);

  const { vehicleQuery } = useVehicleQueries();

  const { control, handleSubmit, setValue, watch } = useForm<IncidentCreate>({
    defaultValues: initialFormState,
  });

  const selectedType = watch('type');

  const incidenceOptions =
    selectedType === 'legal'
      ? LEGAL_INCIDENCE_OPTIONS
      : OPERATIVE_INCIDENCE_OPTIONS;

  const showRightColumn = createUnavailability || selectedType === 'legal';

  const onSubmit: SubmitHandler<IncidentCreate> = (data) => {
    console.log('Form Data:', data);
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
          Crear Nueva Incidencia
        </Typography>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <MuiCloseButton onClick={onClose} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <form className="mt-6 transition-all duration-300 ease-in-out">
          <div
            className={`grid gap-6 transition-all duration-300 ease-in-out ${
              showRightColumn ? 'grid-cols-[1fr_auto_1fr]' : 'grid-cols-1'
            }`}
          >
            {/* Columna izquierda: campos base */}
            <div className="flex flex-col gap-4">
              <RadioButtonGroup
                control={control}
                label="Tipo de Incidencia"
                name="type"
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
                        onChange={(e) =>
                          setCreateUnavailability(e.target.checked)
                        }
                      />
                    }
                    label="Crear Indisponibilidad"
                  />
                </FormGroup>
              </div>
            </div>

            {showRightColumn && (
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  mx: 2,
                  transition: 'opacity 0.3s',
                  opacity: showRightColumn ? 1 : 0,
                }}
              />
            )}

            {/* Columna derecha: campos condicionales */}
            {showRightColumn && (
              <div className="flex flex-col gap-6">
                {createUnavailability && (
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
                      required
                      rules={{ required: 'Fecha de inicio requerida' }}
                      inputProps={{ size: 'small' }}
                    />
                    <DatePickerElement
                      control={control}
                      name="endDate"
                      label="Fecha Fin"
                      required
                      rules={{ required: 'Fecha de fin requerida' }}
                      inputProps={{ size: 'small' }}
                    />
                  </div>
                )}

                {selectedType === 'legal' && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-medium font-bold text-muted-foreground">
                        Detalles Legales
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Ingrese la información relacionada con el incidente
                        legal.
                      </p>
                    </div>

                    <TextFieldElement
                      control={control}
                      name="damageCost"
                      label="Coste de Daños"
                      type="number"
                      size="small"
                      rules={{
                        validate: (value) =>
                          value === null ||
                          value >= 0 ||
                          'El coste debe ser positivo',
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
                      required
                      rules={{ required: 'Unidad Afectada Requerida' }}
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
                    />
                  </div>
                )}
              </div>
            )}
          </div>
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
          loadingPosition="end"
          onClick={handleSubmit(onSubmit)}
        />
      </DialogActions>
    </>
  );
};

