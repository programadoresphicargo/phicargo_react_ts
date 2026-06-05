import { Alert, LoadingSpinner, MuiSaveButton } from '@/components/ui';
import type { Complaint, ComplaintActionCreate } from '../../models';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { ComplaintActionCard } from '../ComplaintActionCard';
import { CreateActionsForm } from '../complaint-creation/CreateActionsForm';
import { useCreateComplaintActionsMutation } from '../../hooks/mutations';
import { useGetComplaintActionsQuery } from '../../hooks/queries';
import { Card, CardBody, CardHeader, Divider } from '@heroui/react';

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
          reset({ actions: [] });
          remove(); // elimina todos los fields
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        Acciones
      </CardHeader>
      <Divider></Divider>
      <CardBody>
        {isLoading && <LoadingSpinner />}

        {actions?.length === 0 && (
          <Alert
            title="No se encontraron acciones para el plan de acción."
            color="secondary"
          />
        )}

        <div className="flex gap-4">
          <section className="flex-1 px-2 space-y-3 border rounded-md">
            <h2 className='text-lg font-semibold text-gray-700 flex items-center gap-2'>Plan de Acción</h2>
            {actions
              ?.filter(action => action.type === 'plan de accion')
              .map(action => (
                <ComplaintActionCard key={action.id} action={action} />
              ))}
          </section>

          <section className="flex-1 px-2 space-y-3 border rounded-md">
            <h2 className='text-lg font-semibold text-gray-700 flex items-center gap-2'>Acción Inmediata</h2>
            {actions
              ?.filter(action => action.type === 'accion inmediata')
              .map(action => (
                <ComplaintActionCard key={action.id} action={action} />
              ))}
          </section>
        </div>

        <CreateActionsForm
          fields={fields}
          control={control}
          remove={remove}
          append={append}
        />
        {fields.length !== 0 && (
          <MuiSaveButton
            size="small"
            color="primary"
            onClick={handleSubmit(onSubmitActions)}
            loading={createComplaintActionaMutation.isPending}
          >
            Crear Acciones
          </MuiSaveButton>
        )}
      </CardBody>
    </Card>
  );
};

