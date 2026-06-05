import type { Complaint, ComplaintUpdate } from '../../models';
import { SubmitHandler, useForm } from 'react-hook-form';

import { ComplaintInfo } from '../ComplaintInfo';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import { TextFieldElement } from 'react-hook-form-mui';
import { useUpdateComplaintMutation } from '../../hooks/mutations';
import { Button } from '@heroui/react';

interface Props {
  complaint: Complaint;
}

export const EditComplaintForm = ({ complaint }: Props) => {
  const { control, handleSubmit } = useForm<ComplaintUpdate>({
    defaultValues: transformComplaintToComplaintUpdate(complaint),
  });

  const {
    updateComplaintMutation: { mutate, isPending },
  } = useUpdateComplaintMutation();

  const onSubmit: SubmitHandler<ComplaintUpdate> = (data) => {
    if (isPending) return;

    mutate({
      id: complaint.id,
      updatedItem: data,
    });
  };

  return (
    <section className="flex flex-col border p-4 rounded-md">

      <div className='mb-4'>
        <Button
          color="primary"
          isLoading={isPending}
          onPress={() => handleSubmit(onSubmit)()}
          radius="full"
        >Guardar
        </Button>
      </div>

      <ComplaintInfo complaint={complaint} />
      <form className="flex flex-col gap-4 mt-6">
        <TextFieldElement
          control={control}
          name="responsible"
          label="Responsable"
          size="small"
          required
        />

        <TextFieldElement
          control={control}
          name="area"
          label="Área"
          size="small"
          required
        />

        <TextFieldElement
          control={control}
          name="response"
          label="Respuesta"
          size="small"
          multiline
          minRows={3}
        />

        <DatePickerElement
          control={control}
          name="responseDate"
          label="Fecha de Respuesta"
          disablePast
          inputProps={{
            size: 'small',
          }}
        />
      </form>
    </section>
  );
};

const transformComplaintToComplaintUpdate = (
  complaint: Complaint,
): ComplaintUpdate => ({
  responsible: complaint.responsible,
  area: complaint.area,
  response: complaint.response,
  responseDate: complaint.responseDate || null,
});

