import { Alert, LoadingSpinner } from '@/components/ui';
import type { Complaint, ComplaintActionCreate } from '../../models';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ComplaintActionCard } from '../ComplaintActionCard';
import { CreateActionsForm } from '../complaint-creation/CreateActionsForm';
import { useCreateComplaintActionsMutation } from '../../hooks/mutations';
import { useGetComplaintActionsQuery } from '../../hooks/queries';
import { Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { Button } from '@heroui/react';
import { useState } from 'react';
import dayjs from 'dayjs';

interface Props {
  complaint: Complaint;
  type: 'plan de accion' | 'accion inmediata';
}

export const EditComplaintActions = ({ complaint, type }: Props) => {

  const initialForm: ComplaintActionCreate = {
    actionPlan: '',
    responsible: '',
    commitmentDate: dayjs(),
    type,
  }

  const { control, handleSubmit, reset, getValues } = useForm<ComplaintActionCreate>({
    defaultValues: initialForm
  });

  const {
    getComplaintActionsQuery: { data: actions, isLoading },
  } = useGetComplaintActionsQuery(complaint.id);

  const { createComplaintActionaMutation } =
    useCreateComplaintActionsMutation();

  const onSubmitActions: SubmitHandler<ComplaintActionCreate> = (data) => {
    if (createComplaintActionaMutation.isPending) return;
    createComplaintActionaMutation.mutate(
      {
        complaintId: complaint.id,
        actions: [data],
      },
      {
        onSuccess: () => {
          reset(initialForm);
          handleClose();
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
        {type.toUpperCase()}
      </CardHeader>
      <Divider></Divider>
      <CardBody>
        {isLoading && <LoadingSpinner />}

        <div className='gap-3 mb-3'>
          <Button
            color="success"
            className='text-white'
            radius="full"
            onPress={() => {
              reset(initialForm);
              handleClickOpen();
            }}
          >
            Nueva
          </Button>
        </div>

        {actions?.length === 0 && (
          <Alert
            title="No se encontraron acciones para el plan de acción."
            color="primary"
          />
        )}

        {actions
          ?.filter(action => action.type === type)
          .map(action => (
            <div
              key={action.id}
              onClick={() => {

                reset({
                  id: action.id,
                  actionPlan: action.actionPlan,
                  responsible: action.responsible,
                  commitmentDate: dayjs(action.commitmentDate),
                  type: type,
                });

                handleClickOpen();
              }}
            >
              <ComplaintActionCard action={action} />
            </div>
          ))}

        <CreateActionsForm
          open={open}
          onClose={handleClose}
          onClick={handleSubmit(onSubmitActions)}
          isLoading={createComplaintActionaMutation.isPending}
          control={control}
          getValues={getValues}
        />

      </CardBody>
    </Card >
  );
};

