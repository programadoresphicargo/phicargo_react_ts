import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Typography,
} from '@mui/material';
import { Button, MuiCloseButton, MuiSaveButton } from '@/components/ui';
import type { Incident, IncidentUpdate } from '../models';
import {
  AutocompleteElement,
  CheckboxElement,
  RadioButtonGroup,
  SelectElement,
  TextareaAutosizeElement,
  TextFieldElement,
} from 'react-hook-form-mui';
import { SubmitHandler, useForm } from 'react-hook-form';

import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import { getIncidentOptions, incidentType } from '../utilities';
import { useDriverQueries } from '@/modules/drivers/hooks/queries';
import { useVehicleQueries } from '@/modules/vehicles/hooks/queries';
import { useIncidentsQueries } from '../hooks/quries';

interface Props {
  onClose: () => void;
  incident: Incident;
}

export const EditIncidentModal = ({ onClose, incident }: Props) => {
  const { updateIncident } = useIncidentsQueries({});

  const { handleSubmit, control, watch, setValue } = useForm<IncidentUpdate>({
    defaultValues: transformIncidentToIncidentUpdate(incident),
  });

  const isDirectionReport = incident.incident === 'REPORTE A DIRECCIÓN';

  const selectedType = watch('type');
  const incidenceOptions = getIncidentOptions(selectedType ?? 'operative');

  const { vehicleQuery } = useVehicleQueries();
  const { AvailableDrivers, isLoading } = useDriverQueries();

  const damageCostDisabled =
    selectedType !== 'legal' && selectedType !== 'maintenance';

  const onSubmit: SubmitHandler<IncidentUpdate> = (data) => {
    if (isDirectionReport) {
      data.isDriverResponsible = false;
    }
    updateIncident.mutate(
      {
        id: incident.id,
        updatedItem: {
          ...data,
        },
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
          Editar Incidencia: {' '}
          <Typography
            component="span"
            sx={{
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              textDecoration: 'underline',
            }}
          >
            {incidentType.getLabel(incident.type)} - {incident.driver.name}
          </Typography>
        </Typography>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <MuiCloseButton onClick={onClose} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <form
          className="flex flex-row gap-4 mt-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-4">
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
              slotProps={{
                input: { readOnly: isDirectionReport }
              }}
              options={incidenceOptions}
            />

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
            </div>
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
                  value === undefined ||
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
                helperText: 'Seleccionar unidad afectada, si aplica',
              }}
            />
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
          loading={updateIncident.isPending}
          loadingPosition="end"
          onClick={handleSubmit(onSubmit)}
        />
      </DialogActions>
    </>
  );
};

const transformIncidentToIncidentUpdate = (data: Incident): IncidentUpdate => {
  return {
    incident: data.incident,
    type: data.type,
    comments: data.comments,
    incidentDate: data.incidentDate,
    damageCost: data.damageCost,
    isDriverResponsible: data.isDriverResponsible,
    driverId: data.driver?.id || null,
    vehicleId: data.vehicle?.id || null,
  };
};

