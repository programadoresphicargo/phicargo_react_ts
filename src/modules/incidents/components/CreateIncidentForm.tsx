import {
  AutocompleteElement,
  RadioButtonGroup,
  SelectElement,
  TextareaAutosizeElement,
  CheckboxElement,
} from 'react-hook-form-mui';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import { Checkbox, Divider, FormControlLabel, FormGroup } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

import { FileUploadInput } from '@/components/inputs';
import { Button, MuiSaveButton } from '@/components/ui';
import {
  useCreateIncidentForm,
  INCIDENT_TYPES,
} from '../hooks/useCreateIncidentForm';
import { LegalDetailsSection } from './LegalDetailsSection';

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
  const {
    form: { control, handleSubmit, setValue },

    files,
    setFiles,

    createUnavailability,
    setCreateUnavailability,

    vehicleQuery,
    AvailableDrivers,

    isLoading,
    incidenceOptions,

    damageCostDisabled,

    handleSubmit: onFormSubmit,
    isPending,
    isDirectionReport,
  } = useCreateIncidentForm({ driverId, onSuccess });

  return (
    <form className="mt-6 transition-all duration-300 ease-in-out">
      <div
        className={`grid gap-6 transition-all duration-300 ease-in-out grid-cols-[1fr_auto_1fr]`}
      >
        <div className="flex flex-col gap-4 max-w-sm">
          <RadioButtonGroup
            control={control}
            label="Tipo de Incidencia"
            name="type"
            required
            rules={{ required: 'Tipo de incidencia requerido' }}
            options={[
              { id: INCIDENT_TYPES.OPERATIVE, label: 'Operativa' },
              { id: INCIDENT_TYPES.LEGAL, label: 'Legal' },
              { id: INCIDENT_TYPES.CLEANING, label: 'Limpieza' },
              { id: INCIDENT_TYPES.MAINTENANCE, label: 'Mantenimiento' },
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
              required
              rules={{ required: 'Operador requerido' }}
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
              textFieldProps={{
                InputProps: {
                  endAdornment: null,
                  startAdornment: <PersonIcon />,
                },
                placeholder: 'Saleccione un operador',
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
              disabled={isDirectionReport}
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={createUnavailability}
                    onChange={(e) => setCreateUnavailability(e.target.checked)}
                  />
                }
                disabled={isDirectionReport}
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

            <LegalDetailsSection
              control={control}
              damageCostDisabled={damageCostDisabled}
              disabled={isDirectionReport}
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
                disabled: isDirectionReport,
              }}
              textFieldProps={{
                InputProps: {
                  endAdornment: null,
                  startAdornment: <DirectionsBusIcon />,
                },
                placeholder: 'Seleccione una unidad',
                helperText: 'Seleccionar unidad afectada, si aplica',
              }}
            />

            <SelectElement
              control={control}
              name="newVehicleStateId"
              label="Nuevo Estado de la Unidad"
              size="small"
              helperText="Seleccionar el nuevo estado de la unidad, si aplica"
              disabled={isDirectionReport}
              options={[
                { id: null, label: '' },
                { id: 8, label: 'TERMINNACIÓN DE ARRENDAMIENTO' },
                { id: 7, label: 'ESTATUS OCRA' },
                { id: 5, label: 'EN REPARACIÓN POR FALLAS MECÁNICAS' },
                { id: 4, label: 'EN REPARACION POR SINIESTRO' },
                { id: 3, label: 'BAJA POR PERDIDA TOTAL' },
              ]}
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
          onClick={handleSubmit(onFormSubmit)}
          loading={isPending}
        />
      </div>
    </form>
  );
};

