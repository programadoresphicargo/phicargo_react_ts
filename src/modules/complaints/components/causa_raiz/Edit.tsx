import { Alert, LoadingSpinner } from '@/components/ui';
import type { Complaint } from '../../models';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useGetComplaintCausaRaizQuery } from '../../hooks/queries/useGetComplaintCausaRaizQuery';
import { useUpdateComplaintCausaRaizMutation } from '../../hooks/mutations/useUpdateComplaintCausaRaizMutation';
import { useEffect } from 'react';
import { TextInput, TextareaInput } from '@/components/inputs';
import { Button, Card, CardBody, CardHeader, Divider } from '@heroui/react';

interface CausaRaizForm {
 causa_raiz: {
  descripcion: string;
  porques: string[];
 };
}

interface Props {
 complaint: Complaint;
}

export const EditComplaintCausaRaiz = ({ complaint }: Props) => {
 const { control, handleSubmit, reset } = useForm<CausaRaizForm>({
  defaultValues: {
   causa_raiz: {
    descripcion: '',
    porques: [''],
   },
  },
 });

 const { fields, append, remove } = useFieldArray({
  control: control as any,
  name: 'causa_raiz.porques',
 });

 const {
  getComplaintCausaRaizQuery: { data, isLoading },
 } = useGetComplaintCausaRaizQuery(complaint.id);

 const { updateComplaintCausaRaizMutation } =
  useUpdateComplaintCausaRaizMutation();

 const onSubmit: SubmitHandler<CausaRaizForm> = (formData) => {
  if (updateComplaintCausaRaizMutation.isPending) return;

  updateComplaintCausaRaizMutation.mutate(
   {
    id: complaint.id,
    updatedItem: formData.causa_raiz,
   },
   {
    onSuccess: () => {
    },
   },
  );
 };

 useEffect(() => {
  if (!data) return;

  reset({
   causa_raiz: {
    descripcion: data.descripcion,
    porques: data.porques, // 👈 aquí ya debe ser string[]
   },
  });
 }, [data, reset]);

 return (
  <Card>
   <CardHeader>
    Causa Raíz
   </CardHeader>
   <Divider></Divider>
   <CardBody>
    {isLoading && <LoadingSpinner />}

    <div className="mb-3 flex gap-3">
     <Button onPress={() => append('')} radius='full' color="primary">
      Agregar porqué
     </Button>

     {fields.length > 0 && (
      <Button
       color='success'
       className='text-white'
       radius='full'
       onPress={() => handleSubmit(onSubmit)()}
       isLoading={updateComplaintCausaRaizMutation.isPending}
      >
       Guardar Causa Raíz
      </Button>
     )}
    </div>

    {!data && (
     <Alert
      title="No se encontró causa raíz."
      color="secondary"
     />
    )}

    <TextareaInput
     control={control}
     name="causa_raiz.descripcion"
     label="Descripción"
     rules={{ required: "Campo obligatorio" }}
     variant="faded"
    />

    {fields.map((field, index) => (
     <div key={field.id} className="flex gap-2 mt-2">
      <TextInput
       control={control}
       name={`causa_raiz.porques.${index}`}
       label={`Por qué ${index + 1}`}
       rules={{ required: "Campo obligatorio" }}
      />

      <Button onPress={() => remove(index)} color='danger' radius='full'>
       <i className="bi bi-x-circle"></i>
      </Button>
     </div>
    ))}
   </CardBody>
  </Card>
 );
};