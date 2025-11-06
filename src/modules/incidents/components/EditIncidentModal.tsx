import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Typography,
} from '@mui/material';
import { Button, MuiCloseButton } from '@/components/ui';
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
import Swal from 'sweetalert2';
import IncidentChip from './IncidentChip';

interface Props {
  onClose: () => void;
  incident: Incident;
}

export const EditIncidentModal = ({ onClose, incident }: Props) => {

  const { updateIncident, confirmIncidentMutation } = useIncidentsQueries({});

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

  const confirmIncident = () => {
    if (!incident) return;

    Swal.fire({
      title: "¿Confirmar incidencia?",
      text: "Una vez confirmada no podrás deshacer esta acción.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmIncidentMutation.mutate(
          { id: incident.id, state: "confirmed" },
          {
            onSuccess: () => {
              onClose();
            },
            onError: () => {
              Swal.fire(
                "Error",
                "No se pudo confirmar la incidencia. Inténtalo de nuevo.",
                "error"
              );
            },
          }
        );
      }
    });
  };

  const canceledIncident = () => {
    if (!incident) return;

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción cancelará la incidencia.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, regresar",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmIncidentMutation.mutate(
          { id: incident.id, state: "canceled" },
          {
            onSuccess: () => {
              onClose();
            },
            onError: () => {
              Swal.fire(
                "Error",
                "No se pudo cancelar la incidencia. Inténtalo de nuevo.",
                "error"
              );
            },
          }
        );
      }
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
            <div>
              <h2>Incidencia: {incident.id}</h2>
              <IncidentChip incident={incident} />
            </div>

            <RadioButtonGroup
              disabled={incident.state == 'confirmed' ? true : false}
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
              disabled={incident.state == 'confirmed' ? true : false}
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
                disabled: incident.state == 'confirmed' ? true : false
              }}
            />
            <DatePickerElement
              disabled={incident.state == 'confirmed' ? true : false}
              control={control}
              name="incidentDate"
              label="Fecha de Incidencia"
              required
              rules={{ required: 'Fecha de incidencia requerida' }}
              inputProps={{ size: 'small' }}
            />
            <TextareaAutosizeElement
              disabled={incident.state == 'confirmed' ? true : false}
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
                disabled={isDirectionReport || incident.state == 'confirmed' ? true : false}
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
        <Button
          color='success'
          disabled={incident.state === 'confirmed' || incident.state === 'canceled'}
          variant="contained"
          onClick={confirmIncident}
          loading={confirmIncidentMutation.isPending}>
          Confirmar incidencia
        </Button>
        <Button
          color='error'
          disabled={incident.state === 'confirmed' || incident.state === 'canceled'}
          variant="contained"
          onClick={canceledIncident}
          loading={confirmIncidentMutation.isPending}>
          Cancelar incidencia
        </Button>
        <Button
          disabled={confirmIncidentMutation.isPending ? true : false || incident.state == 'confirmed' ? true : false}
          variant="contained"
          loading={updateIncident.isPending}
          loadingPosition="end"
          onClick={handleSubmit(onSubmit)}>
          Guadar cambios
        </Button>
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

