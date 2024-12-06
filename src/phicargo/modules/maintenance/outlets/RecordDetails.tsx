import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { Navigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useGetComments, useMaintenanceRecord } from '../hooks';
import { useMemo, useState } from 'react';

import AddButton from '../../core/components/ui/AddButton';
import CheckIcon from '@mui/icons-material/Check';
import CompleteDialog from '../components/CompleteDialog';
import NotesTimeline from '../components/NotesTimeline';
import { TextareaInput } from '../../core/components/inputs/TextareaInput';

interface RegisterDetailForm {
  comment: string;
}

const initialFormValues: RegisterDetailForm = {
  comment: '',
};

const RecordDetails = () => {
  const { id } = useParams();

  const [completeModal, setCompleteModal] = useState(false);

  const { records } = useMaintenanceRecord();

  const record = useMemo(
    () => records.find((r) => r.id === Number(id)),
    [records, id],
  );

  const {
    commentsQuery: { data: comments, isFetching },
  } = useGetComments(Number(id));

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
      id: Number(id),
      comment: { comment: data.comment },
    });
  };

  const onClose = () => {};

  if (!id) {
    return <Navigate to="/mantenimiento" />;
  }

  return (
    <>
      <Modal isOpen={true} size={'lg'} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h4>Detalles del registro</h4>
                <div style={{ flex: '1', marginRight: '20px' }}>
                  <div style={{ marginBottom: '15px', fontSize: '16px' }}>
                    <strong>Unidad:</strong> {record?.vehicle.name}
                  </div>
                  <div style={{ marginBottom: '15px', fontSize: '16px' }}>
                    <strong>Workshop:</strong> {record?.workshop.name}
                  </div>
                  <div style={{ marginBottom: '15px', fontSize: '16px' }}>
                    <strong>Tipo de Falla:</strong> {record?.failType}
                  </div>
                  <div style={{ marginBottom: '15px', fontSize: '16px' }}>
                    <strong>Supervisor:</strong> {record?.supervisor}
                  </div>
                  <div style={{ marginBottom: '15px', fontSize: '16px' }}>
                    <strong>Comentarios:</strong> {record?.comments}
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div>
                  <div style={{ marginBottom: '15px' }}>
                    <TextareaInput
                      control={control}
                      name="comment"
                      label="Comentario de Avance"
                      // isUpperCase
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <AddButton
                      label="Agregar Avance"
                      className="flex-1"
                      color="primary"
                      isLoading={isPending}
                      onClick={handleSubmit(onSubmit)}
                    />

                    <Button
                      color="success"
                      variant="faded"
                      className="font-bold px-2 flex-1"
                      startContent={
                        <CheckIcon width={'1.5em'} height={'1.5em'} />
                      }
                    >
                      Finalizar
                    </Button>
                  </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                  {!comments && isFetching && (
                    <p>Cargando comentarios de avance...</p>
                  )}
                  {comments && comments.length === 0 && (
                    <p>No hay comentarios de avance</p>
                  )}
                  {comments && comments.length > 0 && (
                    <NotesTimeline comments={comments} />
                  )}
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <CompleteDialog
        open={completeModal}
        onClose={() => setCompleteModal(false)}
        itemId={Number(id)}
      />
    </>
  );
};

export default RecordDetails;
