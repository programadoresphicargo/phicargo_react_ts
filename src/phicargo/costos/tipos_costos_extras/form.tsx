import { Button, } from "@heroui/react";
import { useEffect, useState } from 'react';
import odooApi from '@/api/odoo-api';
import { AutocompleteInput, NumberInput, TextInput, TextareaInput } from "@/components/inputs";
import { TipoCostoExtra } from "./type";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const initialForm: TipoCostoExtra = {
  id_tipo_costo: null,
  descripcion: "",
  unidad_medida: "",
  costo: 0,
  observaciones: ""
};

const FormularioNewCE = ({ onClose, id_tipo_costo }: { onClose: () => void, id_tipo_costo: number | null }) => {

  const { control, handleSubmit, reset } = useForm<TipoCostoExtra>({
    defaultValues: initialForm,
  });

  const [Loading, setLoading] = useState(false);

  const registrar = async (data: TipoCostoExtra) => {
    setLoading(true);
    try {
      const response = await odooApi.post('/tipos_costos_extras/', data);
      setLoading(false);
      if (response.data.status == "success") {
        toast.success(response.data.message);
        onClose();
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      setLoading(false);
      toast.error('Error en la solicitud');
    }
  };

  const actualizar = async (data: TipoCostoExtra) => {
    setLoading(true);
    try {
      const response = await odooApi.patch('/tipos_costos_extras/', data);
      setLoading(false);
      if (response.data.status == "success") {
        toast.success(response.data.message);
        onClose();
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      setLoading(false);
      toast.error('Error en la solicitud');
    }
  };

  useEffect(() => {
    if (id_tipo_costo != null) {
      odooApi.get(`/tipos_costos_extras/${id_tipo_costo}`)
        .then((response) => {
          reset(response.data);
        })
        .catch((error) => {
          console.error('Error al obtener datos:', error);
        });
    } else {
      reset(initialForm);
    }
  }, [id_tipo_costo]);

  const unidad_medida = [
    { key: "pieza", value: "Pieza" },
    { key: "contenedor", value: "Contenedor" },
    { key: "operador", value: "Operador" },
    { key: "plataforma", value: "Plataforma" },
    { key: "na", value: "No aplica" },
  ];

  return (
    <>
      <div className="flex flex-col gap-4">

        {id_tipo_costo == null && (
          <Button
            isLoading={Loading}
            color="primary"
            onPress={() => handleSubmit(registrar)()}
            radius="full"
          >
            Registrar
          </Button>
        )}

        {id_tipo_costo != null && (
          <Button
            className='text-white'
            isLoading={Loading}
            color="success"
            onPress={() => handleSubmit(actualizar)()}
            radius="full"
          >
            Actualizar
          </Button>
        )}

        <TextInput
          control={control}
          label="Descripción"
          name="descripcion"
          variant="flat"
          rules={{ required: "Campo obligatorio" }}
        />
        <NumberInput
          control={control}
          label="Costo preestablecido"
          name="costo"
          variant="flat"
          rules={{ required: "Campo obligatorio" }}
        />
        <AutocompleteInput
          control={control}
          name="unidad_medida"
          label="Unidad medida"
          items={unidad_medida}
          variant="flat"
          rules={{ required: "Campo obligatorio" }}
        />
        <TextareaInput
          control={control}
          name="observaciones"
          label="Observaciones"
          placeholder="Ingresa las observaciones"
          variant="flat"
          rules={{ required: "Campo obligatorio" }}
        />
      </div>
    </>
  );
};

export default FormularioNewCE;
