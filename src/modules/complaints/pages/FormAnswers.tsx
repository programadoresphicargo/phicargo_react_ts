import { SelectInput, TextInput, TextareaInput } from "@/components/inputs";
import { Card, CardBody, CardHeader, Divider, Progress, Radio, RadioGroup } from "@heroui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import odooApi from "@/api/odoo-api";

type Question = {
  id: number;
  question: string;
  score: number;
  comment: string;
};

type Answer = {
  question_id: number;
  score: number | null;
  comment: string;
};

type FormData = {
  name: string;
  company: string;
  position: string;
  branch_id: number | null;
  answers: Answer[];
  general_comment: string;
};

interface Props {
  survey_id: number;
  open: boolean;
  handleClose: () => void;
}

const EncuestaCalidadAnswers = ({ survey_id, open, handleClose }: Props) => {

  const {
    control,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      company: "",
      position: "",
      branch_id: null,
      answers: [],
      general_comment: "",
    },
  });

  const [data, setData] = useState<Question[]>([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await odooApi.get(`/survey/responses/${survey_id}`);
      const questions: Question[] = response.data.answers;
      setData(questions);

      reset({
        name: response.data.name,
        company: "",
        position: response.data.position,
        branch_id: response.data.branch_id,
        answers: questions.map((question) => ({
          question_id: question.id,
          score: question.score,
          comment: question.comment,
        })),
        general_comment: response.data.general_comment,
      });

    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [open, survey_id]);

  const branches = [{ key: "1", value: "Veracruz" }, { key: "2", value: "México" }, { key: "9", value: "Manzanillo" }];

  return (
    <Dialog
      open={open}
      maxWidth="lg"
      onClose={handleClose}>
      <DialogTitle>Encuesta {survey_id}</DialogTitle>
      <DialogContent>

        {isLoading ? (
          <Progress isIndeterminate color="primary" size="sm"></Progress>
        ) : (
          <div className="flex flex-col gap-4">

            <Card className="mb-3 mt-3">
              <CardHeader>Datos</CardHeader>
              <Divider></Divider>
              <CardBody>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput control={control} name="name" label="Nombre" variant="flat" rules={{ required: "Campo obligatorio" }} readOnly></TextInput>
                  <TextInput control={control} name="position" label="Puesto" variant="flat" rules={{ required: "Campo obligatorio" }} readOnly></TextInput>
                  <SelectInput control={control} name="branch_id" label="Por:" items={branches} rules={{ required: "Campo obligatorio" }} readOnly></SelectInput>
                </div>
              </CardBody>
            </Card>

            {data.map((item, index) => (
              <Card><CardBody>
                <div key={index}>
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
                        isReadOnly
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
                    isReadOnly
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
              isReadOnly
              rules={{ required: "Obligatorio" }} />
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
};

export default EncuestaCalidadAnswers;
