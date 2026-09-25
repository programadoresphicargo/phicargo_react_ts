import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import odooApi from "@/api/odoo-api";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { CorreoCliente } from "../viajes/correos/correos_electronicos";
import {
  AutocompleteInput,
  CheckboxInput,
  TextInput,
} from "@/components/inputs";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const FormularioCorreoGeneral = ({
  open,
  handleClose,
  id_cliente,
  id_correo,
}: {
  open: boolean;
  handleClose: () => void;
  id_cliente?: number;
  id_correo?: number | null;
}) => {
  const initialForm: CorreoCliente = {
    id_correo: 0,
    nombre_completo: "",
    id_cliente: id_cliente ?? null,
    correo: "",
    tipo: "Destinatario",
    activo: true,
  };

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<CorreoCliente>({
    defaultValues: initialForm,
  });

  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!id_correo) return;

    try {
      setLoading(true);

      const response = await odooApi.get(
        `/correos/${id_correo}`
      );

      reset(response.data);
    } catch (error) {
      console.error(
        "Error al obtener los datos:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    if (!id_correo) {
      reset({
        ...initialForm,
        id_cliente,
      });

      return;
    }

    fetchData();
  }, [open, id_correo, id_cliente]);

  const crear_correo = async (
    data: CorreoCliente
  ) => {
    try {
      setLoading(true);

      let response;

      if (!id_correo) {
        response = await odooApi.post(
          "/correos/",
          data
        );
      } else {
        response = await odooApi.patch(
          `/correos/${data.id_correo}`,
          data
        );
      }

      if ([200, 201].includes(response.status)) {
        if (
          response.data.status?.toLowerCase() ===
          "success"
        ) {
          toast.success(response.data.message);
          handleClose();
        } else {
          toast.error(
            "Error: " + response.data.message
          );
        }
      } else {
        toast.error(
          "Error inesperado del servidor."
        );
      }
    } catch (error: any) {
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error(
          "Error al conectar con el servidor: " +
          error.message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
          backgroundColor: "#f8fafc",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          backgroundColor: "#ffffff",
          color: "#1e293b",
          borderBottom: "1px solid #e2e8f0",
          padding: "18px 24px",
          fontFamily: "Inter",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002887] text-white">
            <i className="bi bi-envelope-plus text-lg" />
          </div>

          <div className="flex flex-col">
            <span className="text-[17px] font-bold leading-tight text-slate-800">
              {id_correo
                ? "Editar correo electrónico"
                : "Nuevo correo electrónico"}
            </span>

            <span className="mt-0.5 text-xs font-normal text-slate-500">
              {id_correo
                ? "Actualiza la información del contacto."
                : "Registra un nuevo destinatario para el cliente."}
            </span>
          </div>
        </div>
      </DialogTitle>

      {/* BODY */}
      <DialogContent
        sx={{
          backgroundColor: "#f8fafc",
          marginTop: "25px"
        }}
      >
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* SECCIÓN */}
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#002887]">
                <i className="bi bi-person-lines-fill" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Información del contacto
                </h3>

                <p className="text-xs text-slate-500">
                  Datos del correo electrónico y configuración
                  de envío.
                </p>
              </div>
            </div>
          </div>

          {/* CAMPOS */}
          <div className="flex w-full flex-col gap-4 p-5">
            <TextInput
              variant="flat"
              control={control}
              name="nombre_completo"
              label="Nombre completo"
              rules={{
                required: "Obligatorio",
                pattern: {
                  value: /^[A-Za-zÀ-ÿ\s]+$/,
                  message:
                    "Solo letras y espacios",
                },
              }}
            />

            <TextInput
              variant="flat"
              control={control}
              name="correo"
              label="Correo electrónico"
              rules={{
                required: "Obligatorio",
                pattern: {
                  value:
                    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Correo inválido",
                },
              }}
            />

            <AutocompleteInput
              variant="flat"
              control={control}
              name="tipo"
              items={[
                {
                  key: "Destinatario",
                  value: "Destinatario",
                },
                {
                  key: "CC",
                  value: "CC",
                },
              ]}
              label="Tipo de destinatario"
              rules={{
                required: "Obligatorio",
              }}
            />

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <CheckboxInput
                control={control}
                name="activo"
                label="Correo activo"
              />

              <p className="ml-7 mt-1 text-xs text-slate-500">
                Determina si este correo puede utilizarse
                para el envío de información.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* FOOTER */}
      <DialogActions
        sx={{
          backgroundColor: "#ffffff",
          borderTop: "1px solid #e2e8f0",
          padding: "12px 20px",
        }}
      >
        <Button
          color="default"
          variant="flat"
          radius="md"
          size="sm"
          onPress={handleClose}
          isDisabled={isLoading}
        >
          Cancelar
        </Button>

        <Button
          color={id_correo ? "success" : "primary"}
          radius="md"
          size="sm"
          onPress={() =>
            handleSubmit(crear_correo)()
          }
          isLoading={isLoading}
          startContent={
            !isLoading && (
              <i
                className={
                  id_correo
                    ? "bi bi-check-lg"
                    : "bi bi-plus-lg"
                }
              />
            )
          }
        >
          {id_correo
            ? "Guardar cambios"
            : "Registrar correo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormularioCorreoGeneral;