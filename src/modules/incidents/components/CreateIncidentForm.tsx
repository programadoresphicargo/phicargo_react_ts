import { Divider } from '@mui/material';
import { FileUploadInput } from '@/components/inputs';
import { Button } from '@heroui/react';
import {
  useCreateIncidentForm,
  INCIDENT_TYPES,
} from '../hooks/useCreateIncidentForm';
import { LegalDetailsSection } from './LegalDetailsSection';
import { DriverAutocompleteInput } from '@/modules/drivers/components/DriverAutocompleteInput';
import { VehicleAutocompleteInput } from '@/modules/vehicles/components/VehicleAutocompleteInput';
import {
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Textarea,
  Checkbox,
  DatePicker
} from "@heroui/react";
import { Controller } from "react-hook-form";
import dayjs from 'dayjs';
import { parseDate } from "@internationalized/date";
import { NumberInput } from "@heroui/react";
import SelectEmpleado from '@/phicargo/descuentos/solicitante';
import IncidentChip from './IncidentChip';
import Swal from 'sweetalert2';

interface Props {
  mode: "create" | "edit";
  incident?: any;
  onCancel?: () => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  driverId?: number;
  inspection_id2?: number;
}

export const CreateIncidentForm = ({
  mode,
  incident,
  onCancel,
  onSuccess,
  driverId,
  inspection_id2,
}: Props) => {
  const {
    form: { control, handleSubmit, setValue },

    files,
    setFiles,

    createUnavailability,
    setCreateUnavailability,

    createDiscount,
    setCreateDiscount,

    incidenceOptions,

    damageCostDisabled,

    submit,
    isPending,
    isDirectionReport,
    confirmIncident,
    cancelIncident,
  } = useCreateIncidentForm({
    mode,
    incident,
    driverId,
    inspection_id2,
    onSuccess
  });

  const isEditing = mode === "edit";
  const isConfirmed = isEditing && incident?.state === "confirmed";
  const criticalDisabled = isConfirmed;

  const handleConfirm = () => {
    Swal.fire({
      title: "¿Confirmar incidencia?",
      text: "Una vez confirmada no podrás deshacer esta acción.",
      icon: "question",
      showCancelButton: true,
    }).then((r) => {
      if (r.isConfirmed) confirmIncident();
    });
  };

  const handleCancelIncident = () => {
    Swal.fire({
      title: "¿Cancelar incidencia?",
      icon: "warning",
      showCancelButton: true,
    }).then((r) => {
      if (r.isConfirmed) cancelIncident();
    });
  };

  return (
    <form className="mt-6 transition-all duration-300 ease-in-out">

      <div className="flex items-center justify-between pb-5 gap-4">
        {incident && (
          <div className='pb-5'>
            <h2>Incidencia: {incident.id}</h2>
            <IncidentChip incident={incident} />
          </div>
        )}
        {isEditing && (
          <>
            <Button
              color="success"
              isDisabled={incident?.state === "confirmed"}
              onPress={() => handleConfirm()}
              className='text-white'
              radius='full'
            >
              Confirmar incidencia
            </Button>

            <Button
              color="danger"
              isDisabled={incident?.state === "confirmed"}
              onPress={() => handleCancelIncident()}
              radius='full'
            >
              Cancelar incidencia
            </Button>
          </>
        )}

        <Button
          color='primary'
          radius='full'
          onPress={submit}
          isLoading={isPending}
          isDisabled={criticalDisabled}
        >Guardar
        </Button>

      </div>
      <div
        className={`grid gap-6 transition-all duration-300 ease-in-out grid-cols-[1fr_auto_1fr_auto_1fr]`}
      >

        <div className="flex flex-col gap-4">
          <Controller
            control={control}
            name="type"
            rules={{ required: "Tipo de incidencia requerido" }}
            render={({ field, fieldState }) => (
              <RadioGroup
                label="Tipo de Incidencia"
                orientation="horizontal"
                value={field.value}
                onValueChange={field.onChange}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                isDisabled={criticalDisabled}
              >
                <Radio value={INCIDENT_TYPES.OPERATIVE}>Operativa</Radio>
                <Radio value={INCIDENT_TYPES.LEGAL}>Legal</Radio>
                <Radio value={INCIDENT_TYPES.CLEANING}>Limpieza</Radio>
                <Radio value={INCIDENT_TYPES.MAINTENANCE}>Mantenimiento</Radio>
              </RadioGroup>
            )}
          />

          <Controller
            control={control}
            name="incident"
            rules={{ required: "Tipo de incidencia requerida" }}
            render={({ field, fieldState }) => (
              <Select
                label="Incidencia"
                isDisabled={criticalDisabled}
                selectedKeys={field.value ? [field.value] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0];
                  field.onChange(value);
                }}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
              >
                {incidenceOptions.map((option) => (
                  <SelectItem key={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          <Controller
            control={control}
            name="driverId"
            rules={{ required: "Operador requerido" }}
            render={({ field }) => (
              <DriverAutocompleteInput
                variant="flat"
                control={control}   // sigue siendo necesario
                name={field.name}
                label="Operador"
                setValue={setValue}
                isDisabled={criticalDisabled}
              />
            )}
          />

          <Controller
            control={control}
            name="incidentDate"
            rules={{ required: "Fecha de incidencia requerida" }}
            render={({ field, fieldState }) => {
              const calendarValue = field.value ? parseDate(field.value.format("YYYY-MM-DD")) : null;

              return (
                <DatePicker
                  label="Fecha de Incidencia"
                  isDisabled={criticalDisabled}
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

          <Controller
            control={control}
            name="comments"
            rules={{ required: "Comentario requerido" }}
            render={({ field, fieldState }) => (
              <Textarea
                label="Comentarios"
                placeholder="Escribe tus comentarios..."
                minRows={6}
                value={field.value || ""}
                onChange={field.onChange}
                isDisabled={criticalDisabled}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
              />
            )}
          />

          <div className="flex flex-row items-center justify-between">
            <Controller
              control={control}
              name="isDriverResponsible"
              render={({ field }) => (
                <Checkbox
                  isSelected={field.value || false}
                  onValueChange={field.onChange}
                  isDisabled={isDirectionReport || criticalDisabled}
                >
                  ¿El operador es responsable?
                </Checkbox>
              )}
            />
            <Checkbox
              checked={createUnavailability}
              onValueChange={setCreateUnavailability}
              isDisabled={isDirectionReport || criticalDisabled}
            >
              Crear Indisponibilidad
            </Checkbox>
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

            <Controller
              control={control}
              name="startDate"
              rules={{
                validate: (value) => {
                  if (createUnavailability && !value) {
                    return "Fecha de fin requerida";
                  }
                  return true; // pasa la validación si !createUnavailability o hay valor
                },
              }}
              render={({ field, fieldState }) => {
                const calendarValue = field.value ? parseDate(field.value.format("YYYY-MM-DD")) : null;

                return (
                  <DatePicker
                    label="Fecha Inicio"
                    isDisabled={!createUnavailability}
                    value={calendarValue} // ✅ CalendarDate compatible con HeroUI
                    onChange={(val) => {
                      // Convertimos CalendarDate de vuelta a Dayjs
                      field.onChange(val ? dayjs(val.toString()) : null);
                    }}
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )
              }
              }
            />

            <Controller
              control={control}
              name="endDate"
              rules={{
                validate: (value) => {
                  if (createUnavailability && !value) {
                    return "Fecha de fin requerida";
                  }
                  return true; // pasa la validación si !createUnavailability o hay valor
                },
              }}
              render={({ field, fieldState }) => {
                const calendarValue = field.value ? parseDate(field.value.format("YYYY-MM-DD")) : null;

                return (
                  <DatePicker
                    label="Fecha Fin"
                    isDisabled={!createUnavailability}
                    value={calendarValue} // ✅ CalendarDate compatible con HeroUI
                    onChange={(val) => {
                      // Convertimos CalendarDate de vuelta a Dayjs
                      field.onChange(val ? dayjs(val.toString()) : null);
                    }}
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )
              }
              }
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
              disabled={isDirectionReport || criticalDisabled}
            />

            <VehicleAutocompleteInput
              control={control}
              name="vehicleId"
              label="Unidad Afectada"
              setValue={setValue}
              disabled={isDirectionReport || criticalDisabled}
              helperText="Seleccionar unidad afectada, si aplica"
            />

            <Controller
              control={control}
              name="newVehicleStateId"
              render={({ field, fieldState }) => (
                <Select
                  label="Nuevo Estado de la Unidad"
                  placeholder="Seleccionar el nuevo estado de la unidad, si aplica"
                  selectedKeys={field.value ? [String(field.value)] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0];
                    field.onChange(value ? Number(value) : null);
                  }}
                  isDisabled={isDirectionReport || criticalDisabled}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                >
                  {[
                    { id: null, label: "" },
                    { id: 8, label: "TERMINACIÓN DE ARRENDAMIENTO" },
                    { id: 7, label: "ESTATUS OCRA" },
                    { id: 5, label: "EN REPARACIÓN POR FALLAS MECÁNICAS" },
                    { id: 4, label: "EN REPARACION POR SINIESTRO" },
                    { id: 3, label: "BAJA POR PERDIDA TOTAL" },
                  ].map((option) => (
                    <SelectItem key={String(option.id)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              )}
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

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            mx: 2,
            transition: 'opacity 0.3s',
          }}
        />

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-medium font-bold text-muted-foreground">
              Descuento al Operador
            </h3>
            <p className="text-xs text-muted-foreground">
              Rellene estos campos para registrar un descuento. Opcional.
            </p>
          </div>

          <Checkbox
            checked={createDiscount}
            onValueChange={setCreateDiscount}
          >
            Registrar Descuento
          </Checkbox>

          {createDiscount && (
            <>

              <Controller
                control={control}
                name="id_solicitante"
                rules={{
                  validate: (v) => {
                    if (createDiscount && !v) return "Campo requerido";
                    return true;
                  }
                }}
                render={({ field }) => (
                  <SelectEmpleado
                    key_name="id_solicitante"
                    label="Solicitante"
                    value={field.value}
                    setSolicitante={setValue}
                    placeholder={"Encargado de departamento que hace la solicitud"}
                    filters={[
                      { field: "department_id", operator: "!=", value: 5 },
                      { field: "department_id", operator: "!=", value: 6 },
                    ]}
                  />
                )}
              />

              {/* Monto */}
              <Controller
                control={control}
                name="discountAmount"
                rules={{
                  validate: (v) => {
                    if (createDiscount && !v) return "Monto requerido";
                    return true;
                  }
                }}
                render={({ field, fieldState }) => (
                  <NumberInput
                    label="Monto"
                    formatOptions={{ useGrouping: false }}
                    value={field.value || 0}
                    onChange={field.onChange}
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">$</span>
                      </div>
                    }
                  />
                )}
              />

              {/* Importe */}
              <Controller
                control={control}
                name="discountTotal"
                rules={{
                  validate: (v) => {
                    if (createDiscount && !v) return "Importe requerido";
                    return true;
                  }
                }}
                render={({ field, fieldState }) => (
                  <NumberInput
                    formatOptions={{ useGrouping: false }}
                    label="Importe"
                    value={field.value || 0}
                    onChange={field.onChange}
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">$</span>
                      </div>
                    }
                  />
                )}
              />

              {/* Importe */}
              <Controller
                control={control}
                name="periodicidad"
                rules={{
                  validate: (v) => {
                    if (createDiscount && !v) return "Periodicidad requerido";
                    return true;
                  }
                }}
                render={({ field, fieldState }) => (
                  <Select
                    label="Periodicidad"
                    variant="flat"
                    placeholder="Seleccionar..."
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0];
                      field.onChange(value);
                    }}
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  >
                    <SelectItem key="viaje">Por viaje</SelectItem>
                    <SelectItem key="quincenal">Quincenal</SelectItem>
                  </Select>
                )}
              />

              {/* Motivo */}
              <Controller
                control={control}
                name="discountReason"
                rules={{
                  validate: (v) => {
                    if (createDiscount && !v) return "Motivo requerido";
                    return true;
                  }
                }}
                render={({ field, fieldState }) => (
                  <Textarea
                    label="Motivo"
                    minRows={4}
                    value={field.value || ""}
                    onChange={field.onChange}
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />

              {/* Comentarios */}
              <Controller
                control={control}
                name="discountComments"
                rules={{
                  validate: (v) => {
                    if (createDiscount && !v) return "Comentario requerido";
                    return true;
                  }
                }}
                render={({ field, fieldState }) => (
                  <Textarea
                    label="Comentarios del Descuento"
                    minRows={4}
                    value={field.value || ""}
                    onChange={field.onChange}
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
            </>
          )}
        </div>

      </div>

      <div className="flex justify-between items-center mt-6">
        {onCancel && (
          <Button
            color="danger"
            size="sm"
            onPress={onCancel}
            radius='full'
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

