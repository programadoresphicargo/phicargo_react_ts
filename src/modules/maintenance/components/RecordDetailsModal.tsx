import { AddButton } from '@/components/ui';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Tab, Tabs } from '@heroui/react';

import CheckIcon from '@mui/icons-material/Check';
import CompleteDialog from '../components/CompleteDialog';
import type { MaintenanceRecord } from '../models';
import { MuiModal } from '@/components';
import { RecordComments } from './comments/RecordComments';
import { RecordInfo } from './RecordInfo';
import { TextareaInput } from '@/components/inputs';
import { useMaintenanceRecord } from '../hooks';
import { useState } from 'react';
import { Button } from '@heroui/react';
import ConfirmDialog from './ConfirmDialog';
import odooApi from '@/api/odoo-api';

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
  const [confirmModal, setConfirmModal] = useState(false);

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

  const OpenChecklist = async (id_checklist: number | null): Promise<void> => {
    const url = `${odooApi.defaults.baseURL}/tms_travel/checklist/export/${id_checklist}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <MuiModal
        open={open}
        onClose={onClose}
        maxWidth="xl"
        header={
          <>
            <h2 className="uppercase font-thin">
              <span className="font-bold">{record.vehicle.name}</span>
            </h2>
            <span>{"Reporte: " + record.id}</span>
          </>
        }
      >
        <div className='p-3'>
          {record.status == "draft" && (
            <Button onPress={() => setConfirmModal(true)} color='success' className='text-white' radius='full'>
              <i className="bi bi-check-circle-fill"></i>
              Confirmar
            </Button>
          )}
          {record.id_checklist && (
            <Button onPress={() => OpenChecklist(record.id_checklist)} color='primary' className='text-white' radius='full'>
              <i className="bi bi-file-pdf"></i>
              Checklist equipo
            </Button>
          )}
        </div>

        <div className="flex flex-row justify-between gap-4 p-4">
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
                className='text-white'
                color="primary"
                size="sm"
                radius='full'
                startContent={<CheckIcon />}
                onPress={() => setCompleteModal(true)}
              >
                Actualizar estado
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
      </MuiModal>

      <CompleteDialog
        open={completeModal}
        onClose={() => setCompleteModal(false)}
        itemId={record.id}
      />
      <ConfirmDialog
        open={confirmModal}
        onClose={() => setConfirmModal(false)}
        itemId={record.id}
      />
    </>
  );
};

