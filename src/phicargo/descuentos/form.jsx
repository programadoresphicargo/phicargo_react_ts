import React, { useEffect, useState } from "react";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Grid,
  Divider,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Card, CardBody, CardHeader, Chip, Progress, Textarea, NumberInput, DatePicker, Select, SelectItem } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import odooApi from "@/api/odoo-api";
import { useDescuentos } from "./context";
import SelectEmpleado from "./solicitante";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@heroui/modal";

export default function MinutaForm({ open, handleClose, id_descuento }) {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const {
    isEditing,
    setIsEditing,
  } = useDescuentos();

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const fetchData = async () => {
    if (!id_descuento) {
      setData({});
      setIsEditing(true);
      return;
    }
    setIsEditing(false);
    try {
      setLoading(true);
      const response = await odooApi.get("/descuentos/" + id_descuento);
      setData(response.data);
    } catch (error) {
      toast.error("Error al obtener los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [open]);

  const handleSubmit = async () => {
    if (!data?.id_empleado) return toast.error("El empleado es obligatorio.");
    if (!data?.monto) return toast.error("El monto es obligatorio.");
    if (!data?.importe) return toast.error("Importe es obligatorio.");
    if (!data?.fecha) return toast.error("La fecha es obligatoria.");
    if (!data?.motivo) return toast.error("Motivo es obligatorio.");
    if (!data?.comentarios) return toast.error("Comentarios es obligatorio.");
    if (!data?.periodicidad) return toast.error("Periodicidad es obligatorio.");

    try {
      setLoading(true);
      let response;
      if (id_descuento) response = await odooApi.patch(`/descuentos/${id_descuento}/`, data);
      else response = await odooApi.post("/descuentos/", data);

      if (response.data.status === "success") {
        toast.success(response.data.message);
        handleClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.message ||
        "Error al enviar datos.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const Confirmar = async () => {
    const result = await Swal.fire({
      title: "¿Marcar como aplicado el descuento?",
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
        const response = await odooApi.patch(`/descuentos/estado/${id_descuento}/aplicado`);
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

  return (
    <Modal isOpen={open} scrollBehavior="outside" onOpenChange={handleClose} size="3xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Descuento</ModalHeader>
            <ModalBody>

              {isLoading && <Progress isIndeterminate size="sm" />}

              {/* Header Actions */}
              <Stack direction="row" spacing={2} alignItems="center">
                {id_descuento && (
                  <Chip color="warning" className="uppercase text-sm font-semibold text-white">
                    {data?.estado || "pendiente"}
                  </Chip>
                )}

                {!id_descuento && (
                  <Button color="success" onPress={handleSubmit} radius="full" className="text-white" isLoading={isLoading}>
                    Registrar
                  </Button>
                )}

                {id_descuento && !isEditing && data?.estado !== "confirmado" && (
                  <Button color="primary" onPress={() => setIsEditing(true)} radius="full" className="text-white">
                    Editar
                  </Button>
                )}

                {isEditing && id_descuento && (
                  <Button color="success" onPress={handleSubmit} radius="full" className="text-white" isLoading={isLoading}>
                    Guardar cambios
                  </Button>
                )}

                {!isEditing && id_descuento && (
                  <>
                    <Button color="success" onPress={ImprimirFormato} radius="full" className="text-white">
                      Imprimir formato
                    </Button>
                    {data?.estado !== "aplicado" && (
                      <Button color="success" onPress={Confirmar} radius="full" className="text-white" isLoading={isLoading}>
                        Aplicar
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
                    setSolicitante={handleChange}
                    key_name={"id_solicitante"}
                    label={"Solicitante"}
                    value={data?.id_solicitante}
                    placeholder={"Encargado de departamento que hace la solicitud"}
                    isEditing={isEditing}
                    variant="bordered"
                  />
                </CardBody>
              </Card>

              {/* Card: PERSONAL A DESCONTAR */}
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
                    setSolicitante={handleChange}
                    key_name={"id_empleado"}
                    label={"Empleado"}
                    value={data?.id_empleado}
                    placeholder={"Empleado responsable del descuento"}
                    isEditing={isEditing}
                    variant="bordered"
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

                  <NumberInput
                    label="Folio"
                    variant="bordered"
                    value={data?.folio || ""}
                    onValueChange={(v) => handleChange("folio", v)}
                    isDisabled={true}
                  />

                  <DatePicker
                    label="Fecha"
                    variant="bordered"
                    hideTimeZone
                    showMonthAndYearPickers
                    value={data?.fecha ? parseDate(data.fecha.split("T")[0]) : null}
                    onChange={(date) => handleChange("fecha", date.toString())}
                    isDisabled={!isEditing}
                    isInvalid={!data?.fecha}
                    errorMessage="Campo obligatorio"
                  />

                  <NumberInput
                    label="Monto"
                    variant="bordered"
                    value={data?.monto || ""}
                    onValueChange={(v) => handleChange("monto", v)}
                    isDisabled={!isEditing}
                    isInvalid={!data?.monto}
                    errorMessage="Campo obligatorio"
                  />

                  <Select
                    label="Periodicidad"
                    variant="bordered"
                    placeholder="Seleccionar..."
                    onSelectionChange={(keys) => handleChange("periodicidad", Array.from(keys)[0])}
                    selectedKeys={data?.periodicidad ? [data?.periodicidad] : []}
                    isDisabled={!isEditing}
                    isInvalid={!data?.periodicidad}
                    errorMessage="Campo obligatorio"
                  >
                    <SelectItem key="viaje">Por viaje</SelectItem>
                    <SelectItem key="quincenal">Quincenal</SelectItem>
                  </Select>

                  <NumberInput
                    label="Importe"
                    variant="bordered"
                    value={data?.importe || ""}
                    onValueChange={(v) => handleChange("importe", v)}
                    isDisabled={!isEditing}
                    isInvalid={!data?.importe}
                    errorMessage="Campo obligatorio"
                  />

                  <Textarea
                    label="Motivo"
                    variant="bordered"
                    value={data?.motivo || ""}
                    onValueChange={(v) => handleChange("motivo", v)}
                    isDisabled={!isEditing}
                    isInvalid={!data?.motivo}
                    errorMessage="Campo obligatorio"
                  />

                  <Textarea
                    label="Comentarios"
                    variant="bordered"
                    value={data?.comentarios || ""}
                    onValueChange={(v) => handleChange("comentarios", v)}
                    isDisabled={!isEditing}
                    isInvalid={!data?.comentarios}
                    errorMessage="Campo obligatorio"
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
