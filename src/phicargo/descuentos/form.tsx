import { useEffect, useState } from "react";
import { Button, Chip, Progress, DatePicker, Alert, } from "@heroui/react";
import Swal from "sweetalert2";
import odooApi from "@/api/odoo-api";
import { Controller, useForm } from "react-hook-form";
import { NumberInput, SelectInput, TextareaInput } from "@/components/inputs";
import { toast } from "react-toastify";
import { Descuento } from "./type";
import { parseDate } from "@internationalized/date";
import dayjs from "dayjs";
import { SelectEmpleado } from "./select_empleados";
import { useAuthContext } from "@/modules/auth/hooks";
import { OpenArchive } from "../utils/functions";
import CancelDescuento from "./cancelar";
import { Dialog, DialogActions, DialogContent } from "@mui/material";

const initialForm: Descuento = {
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
  comentarios_cancelacion: null
};

export default function DescuentoForm({ open, handleClose, id_descuento }: { open: boolean, handleClose: () => void, id_descuento: number | null }) {

  const { session } = useAuthContext();

  const { control, handleSubmit, reset, watch } = useForm<Descuento>({
    defaultValues: initialForm,
  });
  const [isLoading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [openCancelForm, setOpenCancelForm] = useState<boolean>(false);

  const fetchData = async () => {
    setIsEditing(false);
    try {
      setLoading(true);
      const response = await odooApi.get("/descuentos/" + id_descuento);
      reset({
        ...response.data,
        fecha: response.data.fecha
          ? dayjs(response.data.fecha)
          : null,
      });
    } catch (error) {
      toast.error("Error al obtener los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && id_descuento) {
      fetchData();
    } else {
      reset(initialForm);
      setIsEditing(true);
    }
  }, [open, id_descuento, openCancelForm]);

  const Save = async (data: Descuento) => {
    try {
      const payload = {
        ...data,
        fecha: data.fecha?.format("YYYY-MM-DD"),
      };
      setLoading(true);
      let response;
      if (id_descuento) response = await odooApi.patch(`/descuentos/${id_descuento}/`, payload);
      else response = await odooApi.post("/descuentos/", payload);

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

  const CambiarEstado = async (estado: string) => {
    const result = await Swal.fire({
      title: `¿Marcar como ${estado} el descuento?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      input: "textarea",
      inputLabel: "Motivo del cambio de estado",
      inputPlaceholder: "Escribe el motivo...",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",

      // Evitar cierre accidental
      allowOutsideClick: false,
      allowEscapeKey: false,

      inputValidator: (value) => {
        if (!value?.trim()) {
          return "Debes ingresar un motivo para continuar.";
        }
      },
    });
    if (result.isConfirmed) {
      try {
        const response = await odooApi.patch(`/descuentos/estado/${id_descuento}/${estado}`);
        if (response.data.status === "success") {
          toast.success(response.data.message);
          handleClose();
        } else toast.error(response.data.message);
      } catch {
        toast.error("Error al confirmar.");
      }
    }
  };

  const estado = watch("estado");
  const comentarios_cancelacion = watch("comentarios_cancelacion");

  return (
    <>

      {id_descuento && (
        <CancelDescuento open={openCancelForm} onClose={() => setOpenCancelForm(false)} id={id_descuento}></CancelDescuento>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        scroll="body"
      >
        <DialogContent>
          <>
            {/* HEADER */}
            <DialogContent className="px-6">

              <div className="w-full flex items-center justify-between gap-4 mb-3">

                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002887] text-white font-bold">
                      $
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">
                        Descuento
                      </h2>

                      <p className="text-sm text-slate-500 mt-0.5">
                        Gestión y administración de descuentos al personal
                      </p>
                    </div>
                  </div>
                </div>

                {id_descuento && (
                  <Chip
                    size="sm"
                    variant="flat"
                    color={
                      estado === "borrador"
                        ? "warning"
                        : estado === "confirmado"
                          ? "success"
                          : estado === "cancelado"
                            ? "danger"
                            : "default"
                    }
                    className="font-semibold uppercase"
                  >
                    {estado || "pendiente"}
                  </Chip>
                )}

              </div>

              {isLoading && (
                <Progress
                  isIndeterminate
                  size="sm"
                  className="mb-4"
                />
              )}

              {/* ACCIONES */}
              <div className="flex flex-wrap items-center justify-between gap-3">

                {comentarios_cancelacion && (
                  <Alert color="danger" variant="solid" description={comentarios_cancelacion} title={"Comentarios cancelación"}></Alert>
                )}

                <div className="flex flex-wrap gap-2">

                  {!id_descuento && (
                    <Button
                      color="success"
                      onPress={() => handleSubmit(Save)()}
                      radius="md"
                      size="sm"
                      className="font-semibold text-white"
                      isLoading={isLoading}
                    >
                      Registrar descuento
                    </Button>
                  )}

                  {id_descuento && !isEditing && estado === "borrador" && (
                    <Button
                      color="primary"
                      onPress={() => setIsEditing(true)}
                      radius="md"
                      className="font-semibold text-white"
                      size="sm"
                    >
                      Editar
                    </Button>
                  )}

                  {isEditing && id_descuento && (
                    <Button
                      color="success"
                      onPress={() => handleSubmit(Save)()}
                      radius="md"
                      className="font-semibold text-white"
                      isLoading={isLoading}
                      size="sm"
                    >
                      Guardar cambios
                    </Button>
                  )}

                  {!isEditing && id_descuento && (
                    <>
                      {(estado === "confirmado" || estado === "aplicado") && (
                        <Button
                          color="primary"
                          variant="flat"
                          onPress={() => OpenArchive(`/descuentos/formato/${id_descuento}`)}
                          radius="md"
                          size="sm"
                        >
                          Imprimir formato
                        </Button>
                      )}

                      {estado === "borrador" && (
                        <Button
                          color="success"
                          variant="flat"
                          onPress={() => CambiarEstado("confirmado")}
                          radius="md"
                          isLoading={isLoading}
                          size="sm"
                        >
                          Confirmar
                        </Button>
                      )}

                      {estado === "confirmado" && (
                        <Button
                          color="warning"
                          variant="flat"
                          onPress={() => CambiarEstado("aplicado")}
                          radius="md"
                          isLoading={isLoading}
                          size="sm"
                        >
                          Aplicar
                        </Button>
                      )}

                      {session?.user?.permissions?.includes(690) &&
                        estado === "borrador" && (
                          <Button
                            color="danger"
                            variant="flat"
                            onPress={() => setOpenCancelForm(true)}
                            radius="md"
                            isLoading={isLoading}
                            size="sm"
                          >
                            Cancelar
                          </Button>
                        )}
                    </>
                  )}

                </div>
              </div>

              {/* SOLICITANTE / EMPLEADO */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

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
                      name="id_solicitante"
                      label="Solicitante"
                      variant="bordered"
                      isDisabled={!isEditing}
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
                      name="id_empleado"
                      label="Empleado"
                      rules={{
                        required: "Empleado requerido",
                      }}
                      placeholder="Empleado responsable del descuento"
                      variant="bordered"
                      isDisabled={!isEditing}
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
                    name="fecha"
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

                  <SelectInput
                    isDisabled={!isEditing}
                    control={control}
                    name="periodicidad"
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

                  <NumberInput
                    control={control}
                    label="Monto"
                    name="monto"
                    isDisabled={!isEditing}
                    variant="bordered"
                    rules={{
                      required: "Monto obligatorio",
                    }}
                  />

                  <NumberInput
                    control={control}
                    name="importe"
                    label="Importe"
                    isDisabled={!isEditing}
                    variant="bordered"
                    rules={{
                      required: "Importe obligatorio",
                    }}
                  />

                  <div className="md:col-span-2">
                    <TextareaInput
                      control={control}
                      name="motivo"
                      label="Motivo"
                      variant="bordered"
                      isDisabled={!isEditing}
                      rules={{
                        required: "Motivo obligatorio",
                      }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <TextareaInput
                      control={control}
                      name="comentarios"
                      label="Comentarios"
                      variant="bordered"
                      isDisabled={!isEditing}
                      rules={{
                        required: "Comentarios obligatorios",
                      }}
                    />
                  </div>

                </div>
              </div>

            </DialogContent>

            <DialogActions className="px-6">

              <Button
                color="default"
                variant="light"
                onPress={handleClose}
                radius="md"
              >
                Cerrar
              </Button>

            </DialogActions>
          </>
        </DialogContent>
      </Dialog>
    </>
  );
}
