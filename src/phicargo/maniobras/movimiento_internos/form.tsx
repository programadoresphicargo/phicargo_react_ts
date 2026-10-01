import { useEffect, useState } from "react";
import { Button, Progress, DatePicker } from "@heroui/react";
import odooApi from "@/api/odoo-api";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Controller, useForm } from "react-hook-form";
import {
  SelectInput,
  TextareaInput,
  VehicleSearchInput,
} from "@/components/inputs";
import { toast } from "react-toastify";
import { MovInterno } from "./type";
import { parseDate } from "@internationalized/date";
import dayjs from "dayjs";
import { DriverAutocompleteInput } from "@/modules/drivers/components/DriverAutocompleteInput";
import SelectFlota from "../maniobras/selects_flota";
import { Flota, OptionFlota } from "../maniobras/tipado";

const initialForm: MovInterno = {
  id: null,
  type: "",
  comentarios: "",
  date: dayjs(),
  driver_id: null,
  vehicle_id: null,
  trailer1_id: null,
  trailer2_id: null,
  dolly_id: null,
};

export default function MovimientosInternosForm({
  open,
  handleClose,
  id,
}: {
  open: boolean;
  handleClose: () => void;
  id: number | null;
}) {
  const [trailers, setTrailers] = useState<OptionFlota[]>([]);
  const [dollies, setDollies] = useState<OptionFlota[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<MovInterno>({
    defaultValues: initialForm,
  });

  const vehicleId = watch("vehicle_id");

  const getFlotaByTipo = async (
    tipo: string
  ): Promise<OptionFlota[]> => {
    const response = await odooApi.get<Flota[]>(
      `/vehicles/fleet_type/${tipo}`
    );

    return response.data.map((item) => ({
      key: item.id,
      label: item.name,
      x_tipo_carga: item.x_tipo_carga,
      x_modalidad: item.x_modalidad,
    }));
  };

  useEffect(() => {
    const cargarFlota = async () => {
      try {
        const [trailersData, dolliesData] =
          await Promise.all([
            getFlotaByTipo("trailer"),
            getFlotaByTipo("dolly"),
          ]);

        setTrailers(trailersData);
        setDollies(dolliesData);
      } catch (error) {
        console.error(error);
        toast.error("No fue posible cargar la flota.");
      }
    };

    cargarFlota();
  }, []);

  const fetchData = async () => {
    setIsEditing(false);

    try {
      setLoading(true);

      const response = await odooApi.get(
        `/movimientos-internos/${id}`
      );

      reset({
        ...response.data,
        date: response.data.date
          ? dayjs(response.data.date)
          : null,
      });
    } catch (error) {
      toast.error("Error al obtener los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && id) {
      fetchData();
    } else if (open) {
      reset(initialForm);
      setIsEditing(true);
    }
  }, [open, id]);

  const Save = async (data: MovInterno) => {
    try {
      const payload = {
        ...data,
        date: data.date?.format("YYYY-MM-DD"),
      };

      setLoading(true);

      let response;

      if (id) {
        response = await odooApi.patch(
          `/movimientos-internos/${id}/`,
          payload
        );
      } else {
        response = await odooApi.post(
          "/movimientos-internos/",
          payload
        );
      }

      if (response.data.status === "success") {
        toast.success(response.data.message);
        handleClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      const message =
        error.response?.data?.detail ||
        error.message ||
        "Error al enviar datos.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={open}
      scrollBehavior="inside"
      onOpenChange={handleClose}
      size="4xl"
      classNames={{
        base: "bg-slate-50",
        wrapper: "items-center",
        header: "border-b border-slate-200 bg-white",
        body: "p-0",
        footer: "border-t border-slate-200 bg-white",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <ModalHeader className="px-6 py-4">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#002887] text-white shadow-sm">
                    <i className="bi bi-truck text-lg" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-slate-800">
                        {id
                          ? "Editar movimiento interno"
                          : "Nuevo movimiento interno"}
                      </h2>

                      {id && (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                          #{id}
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Registro y control de movimientos de unidades
                    </p>
                  </div>
                </div>
              </div>
            </ModalHeader>

            {/* ================================================= */}
            {/* BODY */}
            {/* ================================================= */}

            <ModalBody>
              <div className="px-6 py-5">
                {isLoading && (
                  <Progress
                    isIndeterminate
                    size="sm"
                    className="mb-5"
                    aria-label="Procesando"
                  />
                )}

                {/* ================================================= */}
                {/* DATOS DEL MOVIMIENTO */}
                {/* ================================================= */}

                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  {/* SECTION HEADER */}

                  <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#002887]">
                      <i className="bi bi-file-earmark-text text-sm" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Datos del movimiento
                      </h3>

                      <p className="text-[11px] text-slate-500">
                        Información general de la operación
                      </p>
                    </div>
                  </div>

                  {/* FIELDS */}

                  <div className="grid grid-cols-1 gap-x-5 gap-y-4 p-5 md:grid-cols-2">
                    {/* FECHA */}

                    <Controller
                      control={control}
                      name="date"
                      rules={{
                        required: "Fecha del movimiento",
                      }}
                      render={({ field, fieldState }) => {
                        const calendarValue = field.value
                          ? parseDate(
                            field.value.format("YYYY-MM-DD")
                          )
                          : null;

                        return (
                          <DatePicker
                            label="Fecha del movimiento"
                            variant="bordered"
                            size="sm"
                            isDisabled={!isEditing}
                            value={calendarValue}
                            onChange={(value) => {
                              field.onChange(
                                value
                                  ? dayjs(value.toString())
                                  : null
                              );
                            }}
                            isInvalid={!!fieldState.error}
                            errorMessage={
                              fieldState.error?.message
                            }
                            classNames={{
                              label: "text-xs font-medium",
                              inputWrapper:
                                "border-slate-300 shadow-none hover:border-slate-400",
                            }}
                          />
                        );
                      }}
                    />

                    {/* TIPO */}

                    <SelectInput
                      isDisabled={!isEditing}
                      control={control}
                      size="sm"
                      name="type"
                      label="Tipo de movimiento"
                      variant="bordered"
                      items={[
                        {
                          value: "Movimiento en patio",
                          key: "Movimiento en patio",
                        },
                        {
                          value: "Practica",
                          key: "Practica",
                        },
                        {
                          value: "Prueba de manejo",
                          key: "Prueba de manejo",
                        },
                      ]}
                      rules={{
                        required: "Campo obligatorio",
                      }}
                    />

                    {/* OPERADOR */}

                    <DriverAutocompleteInput
                      control={control}
                      label="Operador"
                      name="driver_id"
                      setValue={setValue}
                      rules={{
                        required: "Campo obligatorio",
                      }}
                      isDisabled={!isEditing}
                    />

                    {/* VEHÍCULO */}

                    <VehicleSearchInput
                      control={control}
                      name="vehicle_id"
                      vehicleId={vehicleId}
                      variant="bordered"
                      required
                      size="sm"
                      isDisabled={!isEditing}
                    />
                  </div>
                </section>

                {/* ================================================= */}
                {/* EQUIPO INVOLUCRADO */}
                {/* ================================================= */}

                <section className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  {/* SECTION HEADER */}

                  <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <i className="bi bi-truck-front text-sm" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Equipo involucrado
                      </h3>

                      <p className="text-[11px] text-slate-500">
                        Unidades y equipos asociados al movimiento
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-5 gap-y-4 p-5 md:grid-cols-2">
                    {/* TRAILER 1 */}

                    <Controller
                      control={control}
                      name="trailer1_id"
                      render={({ field }) => (
                        <SelectFlota
                          label="Remolque 1"
                          id="trailer1_id"
                          name="trailer1_id"
                          onChange={(value: number | null) =>
                            field.onChange(value)
                          }
                          value={field.value ?? undefined}
                          options={trailers}
                          disabled={!isEditing}
                        />
                      )}
                    />

                    {/* TRAILER 2 */}

                    <Controller
                      control={control}
                      name="trailer2_id"
                      render={({ field }) => (
                        <SelectFlota
                          label="Remolque 2"
                          id="trailer2_id"
                          name="trailer2_id"
                          onChange={(value: number | null) =>
                            field.onChange(value)
                          }
                          value={field.value ?? undefined}
                          options={trailers}
                          disabled={!isEditing}
                        />
                      )}
                    />

                    {/* DOLLY */}

                    <Controller
                      control={control}
                      name="dolly_id"
                      render={({ field }) => (
                        <SelectFlota
                          label="Dolly"
                          id="dolly_id"
                          name="dolly_id"
                          onChange={(value: number | null) =>
                            field.onChange(value)
                          }
                          value={field.value ?? undefined}
                          options={dollies}
                          disabled={!isEditing}
                        />
                      )}
                    />
                  </div>
                </section>

                {/* ================================================= */}
                {/* COMENTARIOS */}
                {/* ================================================= */}

                <section className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <i className="bi bi-chat-left-text text-sm" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Observaciones
                      </h3>

                      <p className="text-[11px] text-slate-500">
                        Información adicional del movimiento
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    <TextareaInput
                      control={control}
                      name="comentarios"
                      label="Comentarios"
                      variant="bordered"
                      isDisabled={!isEditing}
                    />
                  </div>
                </section>
              </div>
            </ModalBody>

            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <ModalFooter className="px-6 py-3">
              <div className="flex w-full items-center justify-between">
                <div>
                  {id && !isEditing && (
                    <span className="text-[11px] text-slate-400">
                      Modo consulta
                    </span>
                  )}

                  {isEditing && (
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Edición habilitada
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="light"
                    onPress={onClose}
                    radius="md"
                    className="font-medium text-slate-600"
                  >
                    Cerrar
                  </Button>

                  {!id && (
                    <Button
                      color="primary"
                      onPress={() =>
                        handleSubmit(Save)()
                      }
                      radius="md"
                      className="bg-[#002887] px-5 font-semibold text-white shadow-sm"
                      isLoading={isLoading}
                    >
                      <i className="bi bi-check2 mr-1.5" />
                      Registrar movimiento
                    </Button>
                  )}

                  {id && !isEditing && (
                    <Button
                      color="primary"
                      onPress={() =>
                        setIsEditing(true)
                      }
                      radius="md"
                      className="bg-[#002887] px-5 font-semibold text-white shadow-sm"
                    >
                      <i className="bi bi-pencil mr-1.5" />
                      Editar
                    </Button>
                  )}

                  {id && isEditing && (
                    <Button
                      color="success"
                      onPress={() =>
                        handleSubmit(Save)()
                      }
                      radius="md"
                      className="px-5 font-semibold text-white shadow-sm"
                      isLoading={isLoading}
                    >
                      <i className="bi bi-check2 mr-1.5" />
                      Guardar cambios
                    </Button>
                  )}
                </div>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}