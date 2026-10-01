import { useEffect, useState } from "react";
import { Button, Progress, DatePicker } from "@heroui/react";
import odooApi from "@/api/odoo-api";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@heroui/modal";
import { Controller, useForm } from "react-hook-form";
import { SelectInput, TextareaInput, VehicleSearchInput } from "@/components/inputs";
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
  comentarios: '',
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
  id }:
  {
    open: boolean,
    handleClose: () => void,
    id: number | null
  }) {

  const [trailers, setTrailers] = useState<OptionFlota[]>([]);
  const [dollies, setDollies] = useState<OptionFlota[]>([]);

  const getFlotaByTipo = async (tipo: string): Promise<OptionFlota[]> => {
    const response = await odooApi.get<Flota[]>(`/vehicles/fleet_type/${tipo}`);
    return response.data.map(item => ({
      key: item.id,
      label: item.name,
      x_tipo_carga: item.x_tipo_carga,
      x_modalidad: item.x_modalidad
    }));
  };

  useEffect(() => {
    const cargarTodo = async () => {

      try {
        const [
          trailersData,
          dolliesData,
        ] = await Promise.all([
          getFlotaByTipo("trailer"),
          getFlotaByTipo("dolly"),
        ]);

        setTrailers(trailersData);
        setDollies(dolliesData);

      } catch (error) {
        console.error(error);
      } finally {
      }
    };

    cargarTodo();
  }, []);

  const { control, handleSubmit, reset, watch, setValue } = useForm<MovInterno>({
    defaultValues: initialForm,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    setIsEditing(false);
    try {
      setLoading(true);
      const response = await odooApi.get("/movimientos-internos/" + id);
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
    } else {
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
      if (id) response = await odooApi.patch(`/movimientos-internos/${id}/`, payload);
      else response = await odooApi.post("/movimientos-internos/", payload);

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

  const vehicleId = watch('vehicle_id');

  return (
    <Modal
      isOpen={open}
      scrollBehavior="outside"
      onOpenChange={handleClose}
      size="5xl"
      classNames={{
        base: "bg-[#f8fafc]",
        header: "border-b border-slate-200",
        body: "py-6",
        footer: "border-t border-slate-200",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            {/* HEADER */}
            <ModalHeader className="px-6 py-5">
              <div className="w-full flex items-center justify-between gap-4">

                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002887] text-white font-bold">
                      <i className="bi bi-truck"></i>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">
                        Movimiento interno
                      </h2>

                      <p className="text-sm text-slate-500 mt-0.5">
                        Gestión y administración de movimientos internos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="px-6">

              {isLoading && (
                <Progress
                  isIndeterminate
                  size="sm"
                  className="mb-4"
                />
              )}

              {/* ACCIONES */}
              <div className="flex flex-wrap items-center justify-between gap-3">

                <div className="flex flex-wrap gap-2">

                  {!id && (
                    <Button
                      color="success"
                      onPress={() => handleSubmit(Save)()}
                      radius="md"
                      className="font-semibold text-white"
                      isLoading={isLoading}
                    >
                      Registrar
                    </Button>
                  )}

                  {id && !isEditing && (
                    <Button
                      color="primary"
                      onPress={() => setIsEditing(true)}
                      radius="md"
                      className="font-semibold text-white"
                    >
                      Editar
                    </Button>
                  )}

                  {isEditing && id && (
                    <Button
                      color="success"
                      onPress={() => handleSubmit(Save)()}
                      radius="md"
                      className="font-semibold text-white"
                      isLoading={isLoading}
                    >
                      Guardar cambios
                    </Button>
                  )}
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
                    name="date"
                    rules={{
                      required: "Fecha del movimiento",
                    }}
                    render={({ field, fieldState }) => {
                      const calendarValue = field.value
                        ? parseDate(field.value.format("YYYY-MM-DD"))
                        : null;

                      return (
                        <DatePicker
                          label="Fecha de incidencia"
                          variant="bordered"
                          isDisabled={!isEditing}
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

                  <DriverAutocompleteInput
                    control={control} label="Operador"
                    name="driver_id"
                    setValue={setValue}
                    rules={{ required: "Campo obligatorio" }}
                    isDisabled={!isEditing}
                  />

                  <VehicleSearchInput
                    control={control}
                    name="vehicle_id"
                    vehicleId={vehicleId} variant="bordered"
                    required size="sm"
                    isDisabled={!isEditing}
                  />

                  <SelectInput
                    isDisabled={!isEditing}
                    control={control}
                    size="md"
                    name="type"
                    label="Tipo"
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

                  <Controller
                    control={control}
                    name="trailer1_id"
                    render={({ field }) => (
                      <SelectFlota
                        label={'Remolque 1'}
                        id={'trailer1_id'}
                        name={'trailer1_id'}
                        onChange={(val: number | null) => field.onChange(val)}
                        value={field.value ?? undefined}
                        options={trailers}
                        disabled={!isEditing}
                      />)}
                  />

                  <Controller
                    control={control}
                    name="trailer2_id"
                    render={({ field }) => (
                      <SelectFlota
                        label={'Remolque 2'}
                        id={'trailer2_id'}
                        name={'trailer2_id'}
                        onChange={(val: number | null) => field.onChange(val)}
                        value={field.value ?? undefined}
                        options={trailers}
                        disabled={!isEditing}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="dolly_id"
                    render={({ field }) => (
                      <SelectFlota
                        label={'Dolly'}
                        id={'dolly_id'}
                        name={'dolly_id'}
                        onChange={(val: number | null) => field.onChange(val)}
                        value={field.value ?? undefined}
                        options={dollies}
                        disabled={!isEditing}
                      />
                    )}
                  />

                  <div className="md:col-span-2">
                    <TextareaInput
                      control={control}
                      name="comentarios"
                      label="Comentarios"
                      variant="bordered"
                      isDisabled={!isEditing}
                    />
                  </div>

                </div>
              </div>

            </ModalBody>

            <ModalFooter className="px-6">

              <Button
                color="default"
                variant="light"
                onPress={onClose}
                radius="md"
              >
                Cerrar
              </Button>

            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
