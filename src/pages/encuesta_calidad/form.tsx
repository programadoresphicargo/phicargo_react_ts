import { SelectInput, TextInput, TextareaInput } from "@/components/inputs";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import logo from "../../assets/img/phicargo-vertical.png";
import odooApi from "@/api/odoo-api";
import { toast } from "react-toastify";

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
  partner: string;
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
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      partner: "",
      position: "",
      branch_id: null,
      answers: [],
      general_comment: "",
    },
  });

  const [data, setData] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const answers = watch("answers");

  const fetchData = async () => {
    try {
      setIsLoadingQuestions(true);

      const response = await odooApi.get(`/surveys/questions/`);
      const questions: Question[] = response.data;

      setData(questions);

      reset({
        name: "",
        partner: "",
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
      const response = await odooApi.post(`/surveys/`, values);

      if (response.data.status === "success") {
        toast.success(response.data.message);

        reset({
          name: "",
          partner: "",
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

  const branches = [
    { key: "1", value: "Veracruz" },
    { key: "2", value: "México" },
    { key: "9", value: "Manzanillo" },
  ];

  const answeredQuestions =
    answers?.filter((answer) => answer?.score !== null).length ?? 0;

  const totalQuestions = data.length;

  const progress =
    totalQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen bg-slate-50"
    >
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex flex-col items-center text-center">
            <img
              src={logo}
              alt="PhiCargo"
              className="mb-5 h-auto w-[190px] object-contain"
            />

            <div className="mb-3 h-px w-16 bg-primary" />

            <h1 className="text-2xl font-semibold tracking-tight text-slate-800 md:text-3xl">
              Encuesta de Calidad en el Servicio
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Su opinión es muy importante para nosotros. Sus comentarios nos
              ayudan a mejorar continuamente la calidad de nuestro servicio.
            </p>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-5xl px-4 py-8 pb-32 sm:px-6">

        {/* Datos del cliente */}
        <Card
          shadow="none"
          className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <CardHeader className="flex flex-col items-start gap-1 px-6 pb-4 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <i className="bi bi-person-vcard text-lg" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  Información general
                </h2>

                <p className="text-xs text-slate-500">
                  Complete sus datos antes de comenzar la evaluación
                </p>
              </div>
            </div>
          </CardHeader>

          <Divider />

          <CardBody className="px-6 py-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <TextInput
                control={control}
                name="name"
                label="Nombre"
                variant="flat"
                rules={{ required: "Campo obligatorio" }}
              />

              <TextInput
                control={control}
                name="position"
                label="Puesto"
                variant="flat"
                rules={{ required: "Campo obligatorio" }}
              />

              <TextInput
                control={control}
                name="partner"
                label="Empresa"
                variant="flat"
                rules={{ required: "Campo obligatorio" }}
              />

              <SelectInput
                control={control}
                name="branch_id"
                label="Sucursal a calificar"
                items={branches}
                rules={{ required: "Campo obligatorio" }}
              />
            </div>
          </CardBody>
        </Card>

        {/* Preguntas */}
        {isLoadingQuestions ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />

              <p className="text-sm font-medium text-slate-600">
                Cargando encuesta...
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Estamos preparando las preguntas
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">

            {/* Título sección */}
            <div className="px-1 pb-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Evaluación
              </p>

              <h2 className="mt-1 text-xl font-semibold text-slate-800">
                Califique nuestro servicio
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Seleccione una calificación del 1 al 10 para cada aspecto.
              </p>
            </div>

            {data.map((item, index) => (
              <Card
                key={item.id}
                shadow="none"
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
              >
                <CardBody className="p-0">

                  {/* Encabezado pregunta */}
                  <div className="flex gap-4 px-6 pt-6">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-base font-medium leading-7 text-slate-800">
                        {item.question}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Seleccione una calificación
                      </p>
                    </div>
                  </div>

                  {/* Calificación */}
                  <div className="px-6 pb-5 pt-5">
                    <Controller
                      name={`answers.${index}.score`}
                      control={control}
                      rules={{
                        required: "Debes seleccionar una calificación",
                      }}
                      render={({ field, fieldState }) => (
                        <RadioGroup
                          value={
                            field.value !== null
                              ? String(field.value)
                              : ""
                          }
                          onValueChange={(value) => {
                            field.onChange(Number(value));
                          }}
                          orientation="horizontal"
                          isInvalid={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                          classNames={{
                            base: "w-full",
                            wrapper:
                              "grid grid-cols-5 gap-2 sm:grid-cols-10",
                            label:
                              "mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500",
                          }}
                          label="Calificación"
                        >
                          {Array.from(
                            { length: 10 },
                            (_, radioIndex) => {
                              const value = radioIndex + 1;

                              return (
                                <Radio
                                  key={value}
                                  value={String(value)}
                                  classNames={{
                                    base: [
                                      "m-0",
                                      "max-w-none",
                                      "flex-1",
                                      "cursor-pointer",
                                      "rounded-xl",
                                      "border",
                                      "border-slate-200",
                                      "bg-slate-50",
                                      "px-0",
                                      "py-3",
                                      "justify-center",
                                      "transition-all",
                                      "hover:border-primary/40",
                                      "hover:bg-primary/5",
                                      "data-[selected=true]:border-primary",
                                      "data-[selected=true]:bg-primary/10",
                                    ],
                                    wrapper: "hidden",
                                    label:
                                      "m-0 text-center text-sm font-semibold text-slate-600 data-[selected=true]:text-primary",
                                  }}
                                >
                                  {value}
                                </Radio>
                              );
                            }
                          )}
                        </RadioGroup>
                      )}
                    />

                    {/* Comentario */}
                    <div className="mt-5 border-t border-slate-100 pt-5">
                      <TextareaInput
                        control={control}
                        name={`answers.${index}.comment`}
                        label="Comentario u observación (opcional)"
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}

            {/* Comentario general */}
            <Card
              shadow="none"
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <CardHeader className="px-6 pb-4 pt-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Comentarios adicionales
                  </p>

                  <h2 className="mt-1 text-base font-semibold text-slate-800">
                    ¿Hay algo más que quiera compartir con nosotros?
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Puede registrar cualquier observación, sugerencia, mejora,
                    queja o requerimiento que considere importante.
                  </p>
                </div>
              </CardHeader>

              <Divider />

              <CardBody className="px-6 py-6">
                <TextareaInput
                  control={control}
                  name="general_comment"
                  label="Comentario, observación, sugerencia o requerimiento"
                  rules={{
                    required: "Obligatorio",
                  }}
                />
              </CardBody>
            </Card>
          </div>
        )}
      </main>

      {/* Barra inferior */}
      {/* Barra inferior */}
      {!isLoadingQuestions && data.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center gap-5">

            {/* Progreso */}
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Progreso de la encuesta
                  </p>

                  <p className="text-xs text-slate-400">
                    {answeredQuestions} de {totalQuestions} preguntas respondidas
                  </p>
                </div>

                <span className="shrink-0 text-sm font-bold text-primary">
                  {progress}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Botón */}
            <Button
              type="submit"
              color="primary"
              radius="lg"
              size="lg"
              isLoading={isSubmitting}
              className="shrink-0 min-w-[190px] font-semibold shadow-lg shadow-primary/20"
            >
              {!isSubmitting && (
                <i className="bi bi-send-check text-base" />
              )}

              Enviar encuesta
            </Button>

          </div>
        </div>
      )}
    </form>
  );
};

export default EncuestaCalidad;