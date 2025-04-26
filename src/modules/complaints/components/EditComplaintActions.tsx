import { Alert, LoadingSpinner, MuiSaveButton } from '@/components/ui';
import type { Complaint, ComplaintActionCreate } from '../models';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

import { ComplaintActionCard } from './ComplaintActionCard';
import { CreateActionsForm } from './CreateActionsForm';
import { Typography } from '@mui/material';
import { useCreateComplaintActionsMutation } from '../hooks/mutations';
import { useGetComplaintActionsQuery } from '../hooks/queries';

interface ComplaintActionCreateForm {
  actions: ComplaintActionCreate[];
}

interface Props {
  complaint: Complaint;
}

export const EditComplaintActions = ({ complaint }: Props) => {
  const { control, handleSubmit, reset } = useForm<ComplaintActionCreateForm>({
    defaultValues: {
      actions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'actions',
  });

  const {
    getComplaintActionsQuery: { data: actions, isLoading },
  } = useGetComplaintActionsQuery(complaint.id);

  const { createComplaintActionaMutation } =
    useCreateComplaintActionsMutation();

  const onSubmitActions: SubmitHandler<ComplaintActionCreateForm> = (data) => {
    if (createComplaintActionaMutation.isPending) return;
    createComplaintActionaMutation.mutate(
      {
        complaintId: complaint.id,
        actions: data.actions,
      },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-2 w-1/2 overflow-y-auto h-[calc(100vh-250px)]">
      <Typography sx={{ textAlign: 'center' }} variant="h6">
        Plan de Acción
      </Typography>
      {isLoading && <LoadingSpinner />}
      {actions?.length === 0 && (
        <Alert
          title="No se encontraron acciones para el plan de acción."
          color="secondary"
        />
      )}
      {actions?.map((action) => (
        <ComplaintActionCard key={action.id} action={action} />
      ))}

      <CreateActionsForm
        fields={fields}
        control={control}
        remove={remove}
        append={append}
      />
      {fields.length !== 0 && (
        <MuiSaveButton
          variant="contained"
          size="small"
          color="primary"
          onClick={handleSubmit(onSubmitActions)}
          loading={createComplaintActionaMutation.isPending}
        >
          Crear Acciones
        </MuiSaveButton>
      )}
    </section>
  );
};

