import { DatePicker } from "@heroui/react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { NumberInput, SelectInput, TextareaInput } from "@/components/inputs";
import { parseDate } from "@internationalized/date";
import dayjs from "dayjs";
import { SelectEmpleado } from "./select_empleados";

interface Props<T extends FieldValues> {
  control: Control<T>;
  disabled?: boolean;
  prefix?: string;
}

export default function DescuentoFields<
  T extends FieldValues
>({
  control,
  disabled = false,
  prefix = "",
}: Props<T>) {

  const name = (field: string) =>
    (prefix ? `${prefix}.${field}` : field) as Path<T>;

  return (
    <>
      {/* Área principal */}
      <div className="flex flex-col gap-6 min-w-0">

        {/* SOLICITANTE / EMPLEADO */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Participantes
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Define quién solicita y a quién se aplicará el descuento.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">

              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-700">
                  Solicitante
                </p>

                <p className="text-xs text-slate-500">
                  Responsable que genera la solicitud.
                </p>
              </div>

              <SelectEmpleado
                control={control}
                rules={{
                  required: "Solicitante requerido",
                }}
                name={name("id_solicitante")}
                label="Solicitante"
                variant="bordered"
                isDisabled={disabled}
              />

            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">

              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-700">
                  Empleado
                </p>

                <p className="text-xs text-slate-500">
                  Persona a quien se aplicará el descuento.
                </p>
              </div>

              <SelectEmpleado
                control={control}
                name={name("id_empleado")}
                label="Empleado"
                rules={{
                  required: "Empleado requerido",
                }}
                placeholder="Empleado responsable del descuento"
                variant="bordered"
                isDisabled={disabled}
              />

            </div>

          </div>
        </div>

        {/* DETALLES */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Información del descuento
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Registra los datos financieros y administrativos asociados.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">

            <Controller
              control={control}
              name={name("fecha")}
              rules={{
                required: "Fecha de incidencia requerida",
              }}
              render={({ field, fieldState }) => {
                const calendarValue = field.value
                  ? parseDate(field.value.format("YYYY-MM-DD"))
                  : null;

                return (
                  <DatePicker
                    label="Fecha de incidencia"
                    variant="bordered"
                    isDisabled={disabled}
                    value={calendarValue}
                    onChange={(val) => {
                      field.onChange(
                        val
                          ? dayjs(val.toString())
                          : null
                      );
                    }}
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                );
              }}
            />

            <SelectInput
              isDisabled={disabled}
              control={control}
              name={name("periodicidad")}
              label="Periodicidad"
              variant="bordered"
              items={[
                {
                  value: "Viaje",
                  key: "viaje",
                },
                {
                  value: "Quincenal",
                  key: "quincenal",
                },
              ]}
              rules={{
                required: "Periodicidad obligatoria",
              }}
            />

            <SelectInput
              isDisabled={disabled}
              control={control}
              name={name("type")}
              label="Motivo principal"
              variant="bordered"
              items={[
                { value: "Perdida de maniobra", key: "Perdida de maniobra" },
                { value: "Daño de unidad/remolque", key: "Daño de unidad/remolque" },
                { value: "Violaciones de trafico", key: "Violaciones de trafico" },
                { value: "Problemas de cliente", key: "Problemas de cliente" },
                { value: "Colisión", key: "Colisión" },
                { value: "Descuentos de casetas", key: "Descuentos de casetas" },
                { value: "Perdida de EPP/Equipo de amarre", key: "Perdida de EPP/Equipo de amarre" },
                { value: "Prestamo personal", key: "Prestamo personal" },
              ]}
              rules={{
                required: "Periodicidad obligatoria",
              }}
            />

            <NumberInput
              control={control}
              label="Monto"
              name={name("monto")}
              isDisabled={disabled}
              variant="bordered"
              rules={{
                required: "Monto obligatorio",
              }}
            />

            <NumberInput
              control={control}
              name={name("importe")}
              label="Importe"
              isDisabled={disabled}
              variant="bordered"
              rules={{
                required: "Importe obligatorio",
              }}
            />

            <div className="md:col-span-2">
              <TextareaInput
                control={control}
                name={name("motivo")}
                label="Motivo"
                variant="bordered"
                isDisabled={disabled}
                rules={{
                  required: "Motivo obligatorio",
                }}
              />
            </div>

            <div className="md:col-span-2">
              <TextareaInput
                control={control}
                name={name("comentarios")}
                label="Comentarios"
                variant="bordered"
                isDisabled={disabled}
                rules={{
                  required: "Comentarios obligatorios",
                }}
              />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
