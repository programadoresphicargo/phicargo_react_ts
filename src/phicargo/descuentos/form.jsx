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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MinutaForm({ open, handleClose, id_minuta }) {
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
    if (!id_minuta) {
      setData({});
      setIsEditing(true);
      return;
    }
    setIsEditing(false);
    try {
      setLoading(true);
      const response = await odooApi.get("/descuentos/" + id_minuta);
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
      setIsEditing(true);
      let response;
      if (id_minuta) response = await odooApi.patch(`/descuentos/${id_minuta}/`, data);
      else response = await odooApi.post("/descuentos/", data);

      if (response.data.status === "success") {
        toast.success(response.data.message);
        handleClose();
      } else toast.error(response.data.message);
    } catch (error) {
      toast.error("Error al enviar datos.");
    } finally {
      setIsEditing(false);
    }
  };

  const Confirmar = async () => {
    const result = await Swal.fire({
      title: "¿Confirmar descuento?",
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
        const response = await odooApi.patch(`/minutas/estado/${id_minuta}/confirmado`);
        if (response.data.state === "success") {
          toast.success(response.data.message);
          handleClose();
        } else toast.error(response.data.message);
      } catch {
        toast.error("Error al confirmar.");
      }
    }
  };

  const ImprimirFormato = () => {
    const url = odooApi.defaults.baseURL + `/descuentos/formato/${id_minuta}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar
        elevation={0}
        position="static"
        sx={{
          background: "linear-gradient(90deg, #002887 0%, #0059b3 100%)",
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 500 }}>
            {id_minuta ? `Descuento D-${id_minuta}` : "Nuevo descuento"}
          </Typography>
          <Button autoFocus color="danger" onPress={handleClose} className="text-white" radius="full">
            Cerrar
          </Button>
        </Toolbar>
      </AppBar>

      {isLoading && <Progress isIndeterminate size="sm" />}

      <div className="p-6 space-y-6 bg-gray-50">
        {/* Header Actions */}
        <Stack direction="row" spacing={2} alignItems="center">
          {id_minuta && (
            <Chip color="warning" className="uppercase text-sm font-semibold text-white">
              {data?.estado || "pendiente"}
            </Chip>
          )}

          {!id_minuta && (
            <Button color="success" onPress={handleSubmit} radius="full" className="text-white">
              Registrar
            </Button>
          )}

          {id_minuta && !isEditing && data?.estado !== "confirmado" && (
            <Button color="primary" onPress={() => setIsEditing(true)} radius="full" className="text-white">
              Editar
            </Button>
          )}

          {isEditing && id_minuta && (
            <Button color="success" onPress={handleSubmit} radius="full" className="text-white">
              Guardar cambios
            </Button>
          )}

          {!isEditing && id_minuta && (
            <>
              <Button color="secondary" onPress={ImprimirFormato} radius="full" className="text-white">
                Imprimir formato
              </Button>
              {data?.estado !== "confirmado" && (
                <Button color="success" onPress={Confirmar} radius="full" className="text-white" isDisabled>
                  Confirmar
                </Button>
              )}
            </>
          )}
        </Stack>

        {/* Form Sections */}
        <Grid container spacing={3}>
          {/* Columna izquierda */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              {/* Card: QUIÉN REALIZA SOLICITUD */}
              <Card shadow="sm" className="border border-gray-200 rounded-2xl h-full">
                <CardHeader className="bg-gradient-to-r from-[#002887] to-[#0059b3] text-white font-semibold text-center rounded-t-2xl">
                  QUIÉN REALIZA SOLICITUD
                </CardHeader>
                <Divider />
                <CardBody>
                  <SelectEmpleado
                    setSolicitante={handleChange}
                    key_name={"id_solicitante"}
                    label={"Solicitante"}
                    value={data?.id_solicitante}
                  />
                </CardBody>
              </Card>

              {/* Card: PERSONAL A DESCONTAR */}
              <Card shadow="sm" className="border border-gray-200 rounded-2xl h-full">
                <CardHeader className="bg-gradient-to-r from-[#002887] to-[#0059b3] text-white font-semibold text-center rounded-t-2xl">
                  PERSONAL A DESCONTAR
                </CardHeader>
                <Divider />
                <CardBody>
                  <SelectEmpleado
                    setSolicitante={handleChange}
                    key_name={"id_empleado"}
                    label={"Empleado"}
                    value={data?.id_empleado}
                  />
                </CardBody>
              </Card>
            </Stack>
          </Grid>

          {/* Columna derecha */}
          <Grid item xs={12} md={6}>
            <Card shadow="sm" className="border border-gray-200 rounded-2xl h-full">
              <CardHeader className="bg-gradient-to-r from-[#002887] to-[#0059b3] text-white font-semibold text-center rounded-t-2xl">
                DATOS DEL DESCUENTO
              </CardHeader>
              <Divider />
              <CardBody className="flex flex-wrap gap-4">
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
                  selectedKeys={data.periodicidad ? [data.periodicidad] : []}
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
          </Grid>
        </Grid>

      </div>
    </Dialog>
  );
}
