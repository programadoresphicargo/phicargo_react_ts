import { Divider } from '@mui/material';
import { FileUploadInput } from '@/components/inputs';
import { Button, MuiSaveButton } from '@/components/ui';
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

interface Props {
  onCancel?: () => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  driverId?: number;
  inspection_id2?: number;
}

export const CreateIncidentForm = ({
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

    handleSubmit: onFormSubmit,
    isPending,
    isDirectionReport,
  } = useCreateIncidentForm({ driverId, inspection_id2, onSuccess });

  return (
    <form className="mt-6 transition-all duration-300 ease-in-out">
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
                control={control}   // sigue siendo necesario
                name={field.name}
                label="Operador"
                setValue={setValue}
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
                  isDisabled={isDirectionReport}
                >
                  ¿El operador es responsable?
                </Checkbox>
              )}
            />
            <Checkbox
              checked={createUnavailability}
              onValueChange={setCreateUnavailability}
              isDisabled={isDirectionReport}
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
              disabled={isDirectionReport}
            />

            <VehicleAutocompleteInput
              control={control}
              name="vehicleId"
              label="Unidad Afectada"
              setValue={setValue}
              disabled={isDirectionReport}
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
                  isDisabled={isDirectionReport}
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

