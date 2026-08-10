import { SelectInput, TextInput, TextareaInput } from "@/components/inputs";
import { Button, Card, CardBody, CardHeader, Divider, Radio, RadioGroup } from "@heroui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import logo from '../../assets/img/phicargo-vertical.png';
import odooApi from "@/api/odoo-api";
import { toast } from "react-toastify";
import { CustomerAutocomplete } from "./customer_autocomplete";


type Question = {
  id: number;
  question: string;
};

type Answer = {
  question_id: number;
  score: number | null;
  comment: string;
};

type FormData = {
  name: string;
  partner_id: string;
  position: string;
  branch_id: number | null;
  answers: Answer[];
  general_comment: string;
};

const EncuestaCalidad = () => {

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      partner_id: "",
      position: "",
      branch_id: null,
      answers: [],
      general_comment: "",
    },
  });

  const [data, setData] = useState<Question[]>([]);

  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoadingQuestions(true);

      const response = await odooApi.get(`/survey/questions/`);
      const questions: Question[] = response.data;
      setData(questions);

      reset({
        name: "",
        partner_id: "",
        position: "",
        branch_id: null,
        answers: questions.map((question) => ({
          question_id: question.id,
          score: null,
          comment: "",
        })),
        general_comment: "",
      });

    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await odooApi.post(`/survey/`, values);
      if (response.data.status === "success") {
        toast.success(response.data.message);

        reset({
          name: "",
          partner_id: "",
          position: "",
          branch_id: null,
          answers: data.map((question) => ({
            question_id: question.id,
            score: null,
            comment: "",
          })),
          general_comment: "",
        });

      } else {
        toast.error("Error al guardar");
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error al enviar la encuesta:", error);
      toast.error("Ocurrió un error al enviar la encuesta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const branches = [{ key: "1", value: "Veracruz" }, { key: "2", value: "México" }, { key: "9", value: "Manzanillo" }];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >

      <div className="max-w-4xl mx-auto p-6">

        <div className="max-w-4xl mx-auto p-6 text-center">
          <img src={logo} width="500px" className="mx-auto" />

          <h1 className="text-2xl font-bold">
            ENCUESTA DE CALIDAD EN EL SERVICIO
          </h1>
        </div>

        <Card className="mb-3 mt-3">
          <CardHeader>Datos</CardHeader>
          <Divider></Divider>
          <CardBody>
            <div className="grid grid-cols-2 gap-4">
              <TextInput control={control} name="name" label="Nombre" variant="flat" rules={{ required: "Campo obligatorio" }}></TextInput>
              <TextInput control={control} name="position" label="Puesto" variant="flat" rules={{ required: "Campo obligatorio" }}></TextInput>
              <CustomerAutocomplete
                control={control}
                name="partner_id"
                rules={{
                  required: "Debes seleccionar un cliente",
                }}></CustomerAutocomplete>
              <SelectInput control={control} name="branch_id" label="Por:" items={branches} rules={{ required: "Campo obligatorio" }}></SelectInput>
            </div>
          </CardBody>
        </Card>

        {isLoadingQuestions ? (
          <p>Cargando preguntas...</p>
        ) : (
          <div className="flex flex-col gap-4">
            {data.map((item, index) => (
              <Card><CardBody>
                <div key={item.id}>
                  <p>
                    {index + 1}. {item.question}
                  </p>

                  {/* Calificación */}
                  <Controller
                    name={`answers.${index}.score`}
                    control={control}
                    rules={{
                      required: "Debes seleccionar una calificación",
                    }}
                    render={({ field, fieldState }) => (
                      <RadioGroup
                        label="Calificación"
                        orientation="horizontal"
                        value={
                          field.value !== null
                            ? String(field.value)
                            : ""
                        }
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                        }}
                        isInvalid={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      >
                        {Array.from(
                          { length: 10 },
                          (_, index) => {
                            const value = index + 1;

                            return (
                              <Radio
                                key={value}
                                value={String(value)}
                              >
                                {value}
                              </Radio>
                            );
                          }
                        )}
                      </RadioGroup>
                    )}
                  />

                  <TextareaInput
                    control={control}
                    name={`answers.${index}.comment`}
                    label="Comentario u observacion"
                  />

                </div>
              </CardBody>
              </Card>
            ))}
            <TextareaInput
              control={control}
              name="general_comment"
              label="ALGUN COMENTARIO /OBSERVACIÓN /SUGERENCIA /MEJORA /QUEJA / REQUERIMIENTO EN 
                          ESPECIAL, POR FAVOR INFORMARNOS PARA TOMAR MEDIDAS PREVENTIVAS Y/O CORRECTIVAS 
                          PARA MEJORAR  EL SERVICIO QUE LE PROPORCIONAMOS."
              rules={{ required: "Obligatorio" }} />
          </div>
        )}

        <div className="fixed bottom-6 right-6 z-50">
          <Button
            type="submit"
            color="primary"
            radius="full"
            size="lg"
            isLoading={isSubmitting}
          >
            Enviar encuesta
          </Button>
        </div>

      </div>
    </form >
  );
};

export default EncuestaCalidad;
