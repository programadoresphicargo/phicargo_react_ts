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

const FormularioCorreoGeneral = ({
  handleClose,
  id_cliente,
  id_correo,
}: {
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
    activo: true
  };

  const {
    control,
    handleSubmit,
    reset,
    watch
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
    if (!id_correo) {
      reset(initialForm);
      return;
    }
    fetchData();
  }, [id_correo]);

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
      if (error.response?.data?.message) {
        toast.error(
          error.response.data.message
        );
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
    <div className="w-full flex flex-col gap-4">
      {id_cliente}
      <TextInput
        variant="flat"
        control={control}
        name="nombre_completo"
        label="Nombre"
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
        label="Correo"
        rules={{
          required: "Obligatorio",
          pattern: {
            value:
              /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message:
              "Correo inválido",
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
        label="Tipo"
        rules={{
          required: "Obligatorio",
        }}
      />

      <CheckboxInput
        control={control}
        name="activo"
        label="Activo"
        isDisabled={watch("activo") ? false : true} />

      <Button
        className="text-white"
        color={
          id_correo
            ? "success"
            : "primary"
        }
        onPress={() =>
          handleSubmit(crear_correo)()
        }
        isLoading={isLoading}
      >
        {id_correo
          ? "Actualizar"
          : "Registrar"}
      </Button>
    </div>
  );
};

export default FormularioCorreoGeneral;