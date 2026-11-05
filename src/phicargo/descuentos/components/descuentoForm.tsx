import { useEffect, useState } from "react";
import { Button, Chip, Progress, Alert, } from "@heroui/react";
import Swal from "sweetalert2";
import odooApi from "@/api/odoo-api";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Descuento } from "../type/descuento.types";
import dayjs from "dayjs";
import { useAuthContext } from "@/modules/auth/hooks";
import { OpenArchive } from "../../utils/functions";
import CancelDescuento from "./cancelarDescuento";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import HistorialCambios from "../../almacen/solicitud/cambios/epps";
import DescuentoFields from "./descuentoFields";

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
  comentarios_cancelacion: null,
  type: "",
};

export default function DescuentoForm({ open, handleClose, id_descuento }: { open: boolean, handleClose: () => void, id_descuento: number | null }) {

  const { session } = useAuthContext();

  const { control, handleSubmit, reset, watch } = useForm<Descuento>({
    defaultValues: initialForm,
  });
  const [isLoading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [openCancelForm, setOpenCancelForm] = useState<boolean>(false);

  const handleCloseCancel = () => {
    setOpenCancelForm(false);

    if (id_descuento) {
      fetchData();
    }
  };

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
      inputLabel: "Motivo del cambio de estado",
      inputPlaceholder: "Escribe el motivo...",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
    if (result.isConfirmed) {
      try {
        const response = await odooApi.patch(`/descuentos/state/${id_descuento}`, null,
          {
            params: {
              state: estado,
            }
          });
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
  const mails = watch("mails");

  return (
    <>

      {id_descuento && (
        <CancelDescuento
          open={openCancelForm}
          onClose={handleCloseCancel}
          id={id_descuento}
        />
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
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
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

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

              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] gap-6 items-start">

                <DescuentoFields control={control} disabled={!isEditing}></DescuentoFields>

                {id_descuento && (
                  <aside className="min-w-0 rounded-lg border border-default-200 p-4">
                    <h3 className="text-medium font-bold text-muted-foreground">
                      Historial de cambios
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                    </p>
                    <HistorialCambios data={mails ?? []}></HistorialCambios>
                  </aside>
                )}

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
      </Dialog >
    </>
  );
}
