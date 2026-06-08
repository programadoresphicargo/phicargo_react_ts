import { Alert, LoadingSpinner } from '@/components/ui';
import type { Complaint, ComplaintActionCreate } from '../../models';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { ComplaintActionCard } from '../ComplaintActionCard';
import { CreateActionsForm } from '../complaint-creation/CreateActionsForm';
import { useCreateComplaintActionsMutation } from '../../hooks/mutations';
import { useGetComplaintActionsQuery } from '../../hooks/queries';
import { Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { Button } from '@heroui/react';
import { useState } from 'react';
import dayjs from 'dayjs';

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
          handleClose();
          remove(); // elimina todos los fields
        },
      },
    );
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        Acciones
      </CardHeader>
      <Divider></Divider>
      <CardBody>
        {isLoading && <LoadingSpinner />}

        <div className='gap-3'>
          <Button
            color="success"
            className='text-white'
            radius="full"
            size='sm'
            onPress={() => {
              handleClickOpen();
              reset({ actions: [] });
              append({
                actionPlan: '',
                responsible: '',
                commitmentDate: dayjs(),
                type: '',
              });
            }}
          >
            Nueva
          </Button>
        </div>

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
          open={open}
          onClose={handleClose}
          onClick={handleSubmit(onSubmitActions)}
          isLoading={createComplaintActionaMutation.isPending}
          fields={fields}
          control={control}
          remove={remove}
          append={append}
        />

      </CardBody>
    </Card >
  );
};

