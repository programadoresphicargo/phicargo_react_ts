import { useEffect, useState } from "react";
import {
  Divider,
  Stack,
} from "@mui/material";
import { Button, Card, CardBody, CardHeader, Chip, Progress, DatePicker } from "@heroui/react";
import Swal from "sweetalert2";
import odooApi from "@/api/odoo-api";
import { useDescuentos } from "./context";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@heroui/modal";
import { Controller, useForm } from "react-hook-form";
import { NumberInput, SelectInput, TextareaInput } from "@/components/inputs";
import { toast } from "react-toastify";
import { Descuento } from "./type";
import { parseDate } from "@internationalized/date";
import dayjs from "dayjs";
import { SelectEmpleado } from "./select_empleados";

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
  fecha: dayjs()
};

export default function DescuentoForm({ open, handleClose, id_descuento }: { open: boolean, handleClose: () => void, id_descuento: number | null }) {

  const { control, handleSubmit, reset, watch } = useForm<Descuento>({
    defaultValues: initialForm,
  });
  const [isLoading, setLoading] = useState(false);
  const {
    isEditing,
    setIsEditing,
  } = useDescuentos();

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
  }, [open, id_descuento]);

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
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
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

  const ImprimirFormato = () => {
    const url = odooApi.defaults.baseURL + `/descuentos/formato/${id_descuento}`;
    window.open(url, "_blank");
  };

  const estado = watch("estado");

  return (
    <Modal isOpen={open} scrollBehavior="outside" onOpenChange={handleClose} size="5xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Descuento</ModalHeader>
            <ModalBody>

              {isLoading && <Progress isIndeterminate size="sm" />}

              <Stack direction="row" spacing={2} alignItems="center">
                {id_descuento && (
                  <Chip color="warning" className="uppercase text-sm font-semibold text-white">
                    {estado || "pendiente"}
                  </Chip>
                )}

                {!id_descuento && (
                  <Button color="success" onPress={() => handleSubmit(Save)()} radius="full" className="text-white" isLoading={isLoading}>
                    Registrar
                  </Button>
                )}

                {id_descuento && !isEditing && estado == "borrador" && (
                  <Button color="primary" onPress={() => setIsEditing(true)} radius="full" className="text-white">
                    Editar
                  </Button>
                )}

                {isEditing && id_descuento && (
                  <Button color="success" onPress={() => handleSubmit(Save)()} radius="full" className="text-white" isLoading={isLoading}>
                    Guardar cambios
                  </Button>
                )}

                {!isEditing && id_descuento && (
                  <>
                    <Button color="success" onPress={ImprimirFormato} radius="full" className="text-white">
                      Imprimir formato
                    </Button>
                    {estado == "borrador" && (
                      <Button color="success" onPress={() => CambiarEstado('confirmado')} radius="full" className="text-white" isLoading={isLoading}>
                        Confirmar
                      </Button>
                    )}
                    {estado == "confirmado" && (
                      <Button color="warning" onPress={() => CambiarEstado('aplicado')} radius="full" className="text-white" isLoading={isLoading}>
                        Aplicar
                      </Button>
                    )}
                    {estado == "borrador" && (
                      <Button color="danger" onPress={() => CambiarEstado('cancelado')} radius="full" className="text-white" isLoading={isLoading}>
                        Cancelar
                      </Button>
                    )}
                  </>
                )}
              </Stack>

              <Card shadow="sm" className="border border-gray-200 rounded-2xl h-full">
                <CardHeader className="bg-gradient-to-r from-[#002887] to-[#0059b3] text-white font-semibold text-center rounded-t-2xl">
                  <div className="flex flex-col items-start">
                    <h4 className="text-large">¿Quién solicita el descuento?</h4>
                    <p className="text-small text-white-100">
                      Selecciona al encargado del departamento que realiza la solicitud.
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <SelectEmpleado
                    control={control}
                    rules={{ required: 'Solicitante requerido' }}
                    name={"id_solicitante"}
                    label={"Solicitante"}
                    variant="bordered"
                    isDisabled={!isEditing}
                  />
                </CardBody>
              </Card>

              <Card shadow="sm" className="border border-gray-200 rounded-2xl h-full">
                <CardHeader className="bg-gradient-to-r from-[#002887] to-[#0059b3] text-white font-semibold text-center rounded-t-2xl">
                  <div className="flex flex-col items-start">
                    <h4 className="text-large">¿A quién se aplicará el descuento?</h4>
                    <p className="text-small text-white-100">
                      Selecciona al empleado correspondiente.
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <SelectEmpleado
                    control={control}
                    name={"id_empleado"}
                    label={"Empleado"}
                    rules={{ required: 'Empleado requerido' }}
                    placeholder={"Empleado responsable del descuento"}
                    variant="bordered"
                    isDisabled={!isEditing}
                  />
                </CardBody>
              </Card>

              <Card shadow="sm" className="border border-gray-200 rounded-2xl h-full">
                <CardHeader className="bg-gradient-to-r from-[#002887] to-[#0059b3] text-white font-semibold text-center rounded-t-2xl">
                  <div className="flex flex-col items-start">
                    <h4 className="text-large">Detalles del descuento</h4>
                    <p className="text-small text-white-500">
                      Ingresa la información requerida para procesar el descuento.
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <Controller
                    control={control}
                    name="fecha"
                    rules={{ required: "Fecha de incidencia requerida" }}
                    render={({ field, fieldState }) => {
                      const calendarValue =
                        field.value
                          ? parseDate(field.value.format("YYYY-MM-DD"))
                          : null;

                      return (
                        <DatePicker
                          label="Fecha de Incidencia"
                          variant="bordered"
                          isDisabled={!isEditing}
                          value={calendarValue}
                          onChange={(val) => {
                            field.onChange(val ? dayjs(val.toString()) : null);
                          }}
                          isInvalid={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                        />
                      );
                    }}
                  />

                  <NumberInput
                    control={control}
                    label="Monto"
                    name="monto"
                    isDisabled={!isEditing}
                    variant="bordered"
                    rules={{ required: 'Monto obligatorio' }}
                  />

                  <SelectInput
                    isDisabled={!isEditing}
                    control={control}
                    name="periodicidad"
                    label="Periodicidad"
                    variant="bordered"
                    items={
                      [
                        { value: 'Viaje', key: 'viaje' },
                        { value: 'Quincenal', key: 'quincenal' },
                      ]}
                    rules={{ required: 'Periodicidad obligatoria' }}
                  />

                  <NumberInput
                    control={control}
                    name="importe"
                    label="Importe"
                    isDisabled={!isEditing}
                    variant="bordered"
                    rules={{ required: 'Importe obligatorio' }}
                  />

                  <TextareaInput
                    control={control}
                    name="motivo"
                    label="Motivo"
                    variant="bordered"
                    isDisabled={!isEditing}
                    rules={{ required: 'Motivo obligatorio' }}
                  />

                  <TextareaInput
                    control={control}
                    name="comentarios"
                    label="Comentarios"
                    variant="bordered"
                    isDisabled={!isEditing}
                    rules={{ required: 'Comentarios obligatorios' }}
                  />

                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
