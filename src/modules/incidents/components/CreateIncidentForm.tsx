import { FileUploadInput } from '@/components/inputs';
import { Alert, Button, Tab, Tabs } from '@heroui/react';
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
import IncidentChip from './IncidentChip';
import Swal from 'sweetalert2';
import { useState } from 'react';
import React from 'react';
import CancelarIncidenciaForm from './cancelar';
import { Incident } from '../models';
import HistorialCambios from '@/phicargo/almacen/solicitud/cambios/epps';
import DescuentoFields from '@/phicargo/descuentos/components/descuentoFields';
import { Descuento } from '@/phicargo/descuentos/type/descuento.types';

interface Props {
  mode: "create" | "edit";
  incident?: Incident;
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
    form: { control, setValue },

    files,
    setFiles,

    createUnavailability,
    setCreateUnavailability,

    createDiscount,
    setCreateDiscount,

    incidenceOptions,

    damageCostDisabled,

    Create,
    Update,

    isPending,
    isDirectionReport,
    confirmIncident,
  } = useCreateIncidentForm({
    mode,
    incident,
    driverId,
    inspection_id2,
    onSuccess
  });

  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const isEditing = mode === "edit";
  const isConfirmedOrCanceled = isEditing && (incident?.state === "confirmed" || incident?.state === "canceled");
  const criticalDisabled = isConfirmedOrCanceled;
  const [selected, setSelected] = React.useState<string>("incidencia");

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

  const [openCancelForm, setOpenCancelForm] = useState<boolean>(false);

  const handleCloseCancel = () => {
    setOpenCancelForm(false);
    onCancel?.();
  };

  const initialDescuento: Descuento = {
    id_descuento: null,
    id_empleado: null,
    id_solicitante: null,
    importe: 0,
    motivo: '',
    periodicidad: "viaje",
    comentarios: '',
    monto: 0,
    estado: "borrador",
    fecha: dayjs(),
    comentarios_cancelacion: null,
    type: "",
  };

  const handleDiscountToggle = (checked: boolean) => {
    setCreateDiscount(checked);

    setValue(
      "descuento",
      checked ? initialDescuento : null,
      { shouldValidate: true }
    );
  };

  return (
    <>
      {(incident &&
        <CancelarIncidenciaForm open={openCancelForm} onClose={handleCloseCancel} id={incident.id}></CancelarIncidenciaForm>
      )}

      <form className="mt-6 transition-all duration-300 ease-in-out">

        <div className="flex items-center justify-start pb-5 gap-4">
          {incident && (
            <div className='pb-5'>
              <h2>Incidencia: {incident.id}</h2>
              <IncidentChip incident={incident} />
            </div>
          )}

          {!isEditing && (
            <Button
              color='success'
              className='text-white'
              radius='md'
              size='sm'
              onPress={Create}
              isLoading={isPending}
              isDisabled={criticalDisabled}
            >Registrar
            </Button>
          )}

          {isEditing && (
            <>

              {!isEditingEnabled && (
                <Button
                  color="warning"
                  className="text-white"
                  radius='md'
                  size='sm'
                  onPress={() => setIsEditingEnabled(true)}
                  isDisabled={criticalDisabled}
                >
                  Editar
                </Button>
              )}

              {isEditingEnabled && (
                <Button
                  color='primary'
                  radius='md'
                  size='sm'
                  onPress={Update}
                  isLoading={isPending}
                  isDisabled={criticalDisabled}
                >Guardar
                </Button>
              )}

              {!isEditingEnabled && (
                <>
                  <Button
                    color="success"
                    isDisabled={incident?.state === "confirmed" || incident?.state === "canceled"}
                    onPress={() => handleConfirm()}
                    className='text-white'
                    radius='md'
                    size='sm'
                  >
                    Confirmar incidencia
                  </Button>

                  <Button
                    color="danger"
                    isDisabled={incident?.state === "confirmed" || incident?.state === "canceled"}
                    onPress={() => setOpenCancelForm(true)}
                    radius='md'
                    size='sm'
                  >
                    Cancelar incidencia
                  </Button>
                </>
              )}
            </>
          )}

        </div>

        {incident && incident.state == "canceled" && (
          <div className='mb-4'>
            <Alert color="danger" title="Incidencia cancelada" description={incident.comentarios_cancelacion} variant="solid"></Alert>
          </div>
        )}

        <div className="flex w-full flex-col">
          <Tabs aria-label="Options" selectedKey={selected} onSelectionChange={(key) => setSelected(String(key))}>
            <Tab key="incidencia" title="Incidencia">
              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] gap-6 items-start">
                {/* Área principal */}
                <div className="flex flex-col gap-6 min-w-0">
                  {/* Sección 1: Información general. Ocupa todo el ancho */}
                  <section className="w-full rounded-lg border border-default-200 p-4">
                    <div className="flex flex-col gap-4">

                      <div>
                        <h3 className="text-medium font-bold text-muted-foreground">
                          Datos de incidencia
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Rellene estos campos para registrar la incidencia.
                        </p>
                      </div>

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
                            isDisabled={criticalDisabled || (isEditing && !isEditingEnabled)}
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
                            isDisabled={criticalDisabled || (isEditing && !isEditingEnabled)}
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
                            isDisabled={criticalDisabled || (isEditing && !isEditingEnabled)}
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
                              isDisabled={criticalDisabled || (isEditing && !isEditingEnabled)}
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
                            isDisabled={criticalDisabled || (isEditing && !isEditingEnabled)}
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
                              isDisabled={isDirectionReport || criticalDisabled || (isEditing && !isEditingEnabled)}
                            >
                              ¿El operador es responsable?
                            </Checkbox>
                          )}
                        />
                        <Checkbox
                          checked={createUnavailability}
                          onValueChange={setCreateUnavailability}
                          isDisabled={isDirectionReport || isEditing}
                        >
                          Crear Indisponibilidad
                        </Checkbox>
                      </div>
                    </div>
                  </section>

                  {/* Secciones 2 y 3: una junto a la otra */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <section className="min-w-0 rounded-lg border border-default-200 p-4">
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
                            disabled={isDirectionReport || criticalDisabled || (isEditing && !isEditingEnabled)}
                          />

                          <VehicleAutocompleteInput
                            control={control}
                            name="vehicleId"
                            label="Unidad Afectada"
                            setValue={setValue}
                            disabled={isDirectionReport || criticalDisabled || (isEditing && !isEditingEnabled)}
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
                                isDisabled={isDirectionReport || criticalDisabled || isEditing}
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
                            disabled={criticalDisabled || (isEditing && !isEditingEnabled)}
                          />
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                {/* Columna derecha: historial de cambios */}
                <aside className="min-w-0 rounded-lg border border-default-200 p-4">
                  <h3 className="text-medium font-bold text-muted-foreground">
                    Historial de cambios
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                  </p>

                  <HistorialCambios data={incident?.mails ?? []}></HistorialCambios>
                </aside>
              </div>
            </Tab>
            <Tab key="descuento" title="Descuento">
              <section className="min-w-0 rounded-lg border border-default-200 p-4">
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
                    isSelected={createDiscount}
                    checked={createDiscount}
                    onValueChange={handleDiscountToggle}
                    isDisabled={isDirectionReport || criticalDisabled || (isEditing && createDiscount) || (isEditing && !isEditingEnabled)}
                  >
                    Registrar Descuento
                  </Checkbox>

                  {createDiscount && (
                    <DescuentoFields
                      prefix="descuento"
                      control={control}
                      disabled={
                        isDirectionReport ||
                        criticalDisabled ||
                        (isEditing && !isEditingEnabled)
                      }
                    />
                  )}

                </div>
              </section>
            </Tab>
          </Tabs>
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
    </>
  );
};

