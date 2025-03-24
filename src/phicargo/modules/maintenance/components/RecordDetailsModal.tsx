import { AddButton, Button } from '@/components/ui';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Tab, Tabs } from '@heroui/react';

import CheckIcon from '@mui/icons-material/Check';
import CompleteDialog from '../components/CompleteDialog';
import type { MaintenanceRecord } from '../models';
import { Modal } from '@/components';
import { RecordComments } from './comments/RecordComments';
import { RecordInfo } from './RecordInfo';
import { TextareaInput } from '@/components/inputs';
import { useMaintenanceRecord } from '../hooks';
import { useState } from 'react';

interface RegisterDetailForm {
  comment: string;
}

const initialFormValues: RegisterDetailForm = {
  comment: '',
};

interface Props {
  open: boolean;
  onClose: () => void;
  record: MaintenanceRecord;
}

export const RecordDetailsModal = ({ open, onClose, record }: Props) => {
  const [completeModal, setCompleteModal] = useState(false);

  const {
    addRecordCommentMutation: { mutate: addComment, isPending },
  } = useMaintenanceRecord();

  const { control, handleSubmit } = useForm({
    defaultValues: initialFormValues,
  });

  const onSubmit: SubmitHandler<RegisterDetailForm> = (data) => {
    if (!data.comment || data.comment.length < 2) {
      return;
    }
    addComment({
      id: record.id,
      comment: { comment: data.comment },
    });
  };

  return (
    <>
      <Modal
        scrollBehavior="inside"
        isOpen={open}
        onOpenChange={onClose}
        showFooter={false}
        header={
          <h2 className="uppercase font-thin">
            Detalles: <span className="font-bold">{record.vehicle.name}</span>
          </h2>
        }
        size="3xl"
      >
        <div className="flex flex-row justify-between p-4">
          <RecordInfo record={record} />
          <div>
            <TextareaInput
              control={control}
              name="comment"
              label="Comentario de Avance"
              isUpperCase
            />
            <div className="flex gap-2 mt-2">
              <AddButton
                label="Agregar Avance"
                className="w-2/3"
                color="primary"
                size="small"
                loading={isPending}
                onClick={handleSubmit(onSubmit)}
              />
              <Button
                color="success"
                variant="contained"
                size="small"
                startIcon={<CheckIcon width={'1.5em'} height={'1.5em'} />}
                onClick={() => setCompleteModal(true)}
              >
                Finalizar
              </Button>
            </div>
          </div>
        </div>
        <Tabs
          aria-label="driver-sections"
          variant="underlined"
          color="primary"
          size='sm'
          fullWidth
          classNames={{
            panel: 'px-4 py-1',
            tabContent: 'font-bold uppercase',
          }}
        >
          <Tab key="advance-comments" title="Avance">
            <RecordComments record={record} type="advance" />
          </Tab>
          <Tab key="update-comments" title="Actualización">
            <RecordComments record={record} type="update" />
          </Tab>
        </Tabs>
      </Modal>

      <CompleteDialog
        open={completeModal}
        onClose={() => setCompleteModal(false)}
        itemId={record.id}
      />
    </>
  );
};

