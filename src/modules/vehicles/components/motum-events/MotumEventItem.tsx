import { Divider, IconButton, Stack, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Textarea, Button, Card, CardBody, RadioGroup, Radio, Select, SelectItem, Checkbox, DatePicker } from '@heroui/react';
import Box from '@mui/material/Box';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import RoomIcon from '@mui/icons-material/Room';
import SaveIcon from '@mui/icons-material/Save';
import type { MotumEvent } from '../../models';
import { useMotumEventsQueries } from '../../hooks/queries';
import { DriverAutocompleteInput } from '@/modules/drivers/components/DriverAutocompleteInput';
import { INCIDENT_TYPES } from '@/modules/incidents/hooks/useCreateIncidentForm';
import { useState, useEffect } from 'react';
import { getIncidentOptions } from '@/modules/incidents/utilities';
import { IncidentType } from '@/modules/incidents/models';
import dayjs from 'dayjs';
import { parseDate } from "@internationalized/date";
import { IncidentAdapter } from '@/modules/incidents/adapters';

interface Props {
  event: MotumEvent;
  refresh: () => void;
}

export const MotumEventItem = ({ event, refresh }: Props) => {
  const [crearIncidencia, setCrearIncidencia] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<boolean>(false);

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      comment: '',
      incidentData: {
        type: "operative" as IncidentType,
        incident: '',
        driverId: null,
        comments: '',
        isDriverResponsible: false,
        incidentDate: dayjs() || null,
      }
    },
  });

  const selectedType = watch('incidentData.type');
  const incidenceOptions = getIncidentOptions(selectedType ?? 'operative');

  const { attendMotumEventMutation } = useMotumEventsQueries({});

  useEffect(() => {
    if (!crearIncidencia) {
      setValue("incidentData.type", "operative" as IncidentType);
      setValue("incidentData.incident", "");
      setValue("incidentData.driverId", null);
      setValue("incidentData.comments", "");
      setValue("incidentData.isDriverResponsible", false);
    }
  }, [crearIncidencia, setValue]);

  const onAttend = (data: any) => {
    const { comment, incidentData } = data;

    attendMotumEventMutation.mutate(
      {
        id: event.id,
        updatedItem: {
          comment_data: { comment },
          incidence_data: crearIncidencia ? IncidentAdapter.driverIncidentToApi(incidentData) : null,
        },
        driver_id: incidentData.driverId
      },
      {
        onSuccess: () => {
          setCommentInput(false);
          refresh();
        },
      }
    );
  };

  return (
    <Card>
      <CardBody>
        <Stack direction="row" spacing={2} alignItems="center">
          <ReportGmailerrorredIcon color="error" />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {event.eventTypeName}
            </Typography>

            {event.eventDescription && (
              <Typography variant="body2" color="text.secondary">
                {event.eventDescription}
              </Typography>
            )}

            <Typography
              variant="caption"
              color="primary"
              sx={{ fontStyle: 'italic' }}
            >
              Estado: {event.status} | Unidad: {event.vehicleName} | Fecha: {event.createdAt.format('YYYY-MM-DD HH:mm')}
            </Typography>
          </Box>

          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              window.open(
                `https://www.google.com/maps?q=${event.latitude},${event.longitude}`,
                '_blank',
              );
            }}
          >
            <RoomIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ mt: 1, mb: 2 }} />

        {/* ============================== FORM ============================== */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

          {/* Mostrar formulario */}
          {commentInput && (
            <>
              {/* Comentario inicial */}
              <Controller
                name="comment"
                control={control}
                rules={{
                  required: "Este campo es requerido",
                  minLength: { value: 5, message: "El comentario debe tener al menos 5 caracteres" },
                  maxLength: { value: 200, message: "El comentario no puede tener más de 200 caracteres" },
                }}
                render={({ field, fieldState }) => (
                  <Textarea
                    label="Comentarios"
                    variant="bordered"
                    minRows={4}
                    value={field.value || ""}
                    onChange={field.onChange}
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    fullWidth
                  />
                )}
              />

              <Checkbox isSelected={crearIncidencia} onValueChange={setCrearIncidencia}>Crear incidencia</Checkbox>

              {crearIncidencia && (
                <>

                  <Controller
                    control={control}
                    name="incidentData.incidentDate"
                    rules={{ required: "Fecha de incidencia requerida" }}
                    render={({ field, fieldState }) => {
                      const calendarValue = field.value ? parseDate(field.value.format("YYYY-MM-DD")) : null;

                      return (
                        <DatePicker
                          variant="bordered"
                          label="Fecha de Incidencia"
                          value={calendarValue} // ✅ CalendarDate compatible con HeroUI
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

                  {/* Tipo de incidencia */}
                  <Controller
                    control={control}
                    name="incidentData.type"
                    rules={{
                      validate: (v) => {
                        if (crearIncidencia && !v) return "Campo requerido";
                        return true;
                      }
                    }}
                    render={({ field, fieldState }) => (
                      <RadioGroup
                        label="Tipo de Incidencia"
                        orientation="horizontal"
                        value={field.value}
                        onValueChange={field.onChange}
                        isInvalid={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      >
                        <Radio value={INCIDENT_TYPES.OPERATIVE}>Operativa</Radio>
                        <Radio value={INCIDENT_TYPES.LEGAL}>Legal</Radio>
                        <Radio value={INCIDENT_TYPES.CLEANING}>Limpieza</Radio>
                        <Radio value={INCIDENT_TYPES.MAINTENANCE}>Mantenimiento</Radio>
                      </RadioGroup>
                    )}
                  />

                  {/* Incidencia */}
                  <Controller
                    control={control}
                    name="incidentData.incident"
                    rules={{
                      validate: (v) => {
                        if (crearIncidencia && !v) return "Campo requerido";
                        return true;
                      }
                    }}
                    render={({ field, fieldState }) => (
                      <Select
                        label="Incidencia"
                        variant="bordered"
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(keys) => {
                          const value = Array.from(keys)[0];
                          field.onChange(value);
                        }}
                        isInvalid={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      >
                        {incidenceOptions.map((option) => (
                          <SelectItem key={option.id}>{option.label}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />

                  {/* Operador */}
                  <Controller
                    control={control}
                    name="incidentData.driverId"
                    rules={{
                      validate: (v) => {
                        if (crearIncidencia && !v) return "Campo requerido";
                        return true;
                      }
                    }}
                    render={({ field }) => (
                      <DriverAutocompleteInput
                        control={control}
                        name={field.name}
                        label="Operador"
                        setValue={setValue}
                      />
                    )}
                  />

                  {/* Ultimos comentarios */}
                  <Controller
                    control={control}
                    name="incidentData.comments"
                    rules={{
                      validate: (v) => {
                        if (crearIncidencia && !v) return "Campo requerido";
                        return true;
                      }
                    }}
                    render={({ field, fieldState }) => (
                      <Textarea
                        variant="bordered"
                        label="Comentarios finales"
                        minRows={4}
                        value={field.value || ""}
                        onChange={field.onChange}
                        isInvalid={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      />
                    )}
                  />

                  {/* Responsable */}
                  <Controller
                    control={control}
                    name="incidentData.isDriverResponsible"
                    render={({ field }) => (
                      <Checkbox
                        isSelected={field.value || false}
                        onValueChange={field.onChange}
                      >
                        ¿El operador es responsable?
                      </Checkbox>
                    )}
                  />
                </>
              )}

              {/* Botones */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
                <Button
                  size="sm"
                  radius="full"
                  startContent={<CloseIcon />}
                  color="danger"
                  onPress={() => setCommentInput(false)}
                  isDisabled={attendMotumEventMutation.isPending}
                >
                  Cancelar
                </Button>

                <Button
                  size="sm"
                  radius="full"
                  startContent={<SaveIcon />}
                  color="primary"
                  onPress={() => handleSubmit(onAttend)()}
                  isLoading={attendMotumEventMutation.isPending}
                  isDisabled={attendMotumEventMutation.isPending}
                >
                  Guardar
                </Button>
              </Box>
            </>
          )}

          {/* Botón inicial */}
          {!commentInput && (
            <Button
              size="sm"
              radius="full"
              fullWidth
              startContent={<CheckCircleOutlineIcon />}
              color="primary"
              onPress={() => setCommentInput(true)}
              isDisabled={attendMotumEventMutation.isPending}
            >
              Atender
            </Button>
          )}
        </Box>
      </CardBody>
    </Card>
  );
};
