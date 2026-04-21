import { Alert, LoadingSpinner, MuiSaveButton } from '@/components/ui';
import type { Complaint } from '../../models';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Typography } from '@mui/material';
import { TextFieldElement } from 'react-hook-form-mui';
import { useGetComplaintCausaRaizQuery } from '../../hooks/queries/useGetComplaintCausaRaizQuery';
import { useUpdateComplaintCausaRaizMutation } from '../../hooks/mutations/useUpdateComplaintCausaRaizMutation';
import { useEffect } from 'react';

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
  <section className="flex flex-col gap-2 border rounded-md p-2 w-1/2 overflow-y-auto h-[calc(100vh-250px)]">
   <Typography sx={{ textAlign: 'center' }} variant="h6">
    Causa Raíz
   </Typography>

   {isLoading && <LoadingSpinner />}

   {!data && (
    <Alert
     title="No se encontró causa raíz."
     color="secondary"
    />
   )}


   {/* Formulario */}
   <TextFieldElement
    control={control}
    name="causa_raiz.descripcion"
    label="Descripción"
    required
    fullWidth
   />

   {fields.map((field, index) => (
    <div key={field.id} className="flex gap-2 mt-2">
     <TextFieldElement
      control={control}
      name={`causa_raiz.porques.${index}`}
      label={`Por qué ${index + 1}`}
      size="small"
      required
      fullWidth
     />

     <button type="button" onClick={() => remove(index)}>
      ❌
     </button>
    </div>
   ))}

   <button type="button" onClick={() => append('')}>
    Agregar porqué
   </button>

   {fields.length > 0 && (
    <MuiSaveButton
     variant="contained"
     size="small"
     onClick={handleSubmit(onSubmit)}
     loading={updateComplaintCausaRaizMutation.isPending}
    >
     Guardar Causa Raíz
    </MuiSaveButton>
   )}
  </section>
 );
};