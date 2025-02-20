import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useGetComments, useMaintenanceRecord } from '../hooks';
import { useMemo, useState } from 'react';

import AddButton from '../../core/components/ui/AddButton';
import { BsBusFrontFill } from 'react-icons/bs';
import CheckIcon from '@mui/icons-material/Check';
import CompleteDialog from '../components/CompleteDialog';
import { FaRegUserCircle } from 'react-icons/fa';
import { FaWarehouse } from 'react-icons/fa';
import { MdOutlineSmsFailed } from 'react-icons/md';
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
  const navigate = useNavigate();

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

  const onClose = () => {
    navigate('/reportes/mantenimiento');
  };

  if (!id) {
    return <Navigate to="/reportes/mantenimiento" />;
  }

  return (
    <>
      <Modal isOpen={true} size={'3xl'} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col pb-2 bg-[#dadfeb]">
                <h3 className="font-bold text-xl text-center text-gray-800 uppercase">
                  Detalles del registro
                </h3>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col justify-center gap-2">
                    <div className="flex items-center text-medium">
                      <BsBusFrontFill className="text-blue-500 mr-2" />
                      <span className="font-semibold text-gray-800">
                        Unidad:
                      </span>
                      <span className="ml-1 text-gray-700">
                        {record?.vehicle.name}
                      </span>
                    </div>
                    <div className="flex items-center text-medium">
                      <FaWarehouse className="text-green-500 mr-2" />
                      <span className="text-gray-800">Taller:</span>
                      <span className="ml-1 text-gray-700">
                        {record?.workshop.name || 'Sin estado'}
                      </span>
                    </div>
                    <div className="flex items-center text-medium">
                      <MdOutlineSmsFailed className="text-yellow-400 mr-2" />
                      <span className="text-gray-800">Tipo de Falla:</span>
                      <span className="ml-1 text-gray-700">
                        {record?.failType || 'Sin estado'}
                      </span>
                    </div>
                    <div className="flex items-center text-medium">
                      <FaRegUserCircle className="text-blue-950 mr-2" />
                      <span className="text-gray-800">Supervisor:</span>
                      <span className="ml-1 text-gray-700">
                        {record?.supervisor || 'Sin estado'}
                      </span>
                    </div>
                  </div>
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
                        isLoading={isPending}
                        onClick={handleSubmit(onSubmit)}
                      />
                      <Button
                        color="success"
                        variant="faded"
                        className="font-bold"
                        startContent={
                          <CheckIcon width={'1.5em'} height={'1.5em'} />
                        }
                        onClick={() => setCompleteModal(true)}
                      >
                        Finalizar
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="my-4 max-h-[340px] overflow-y-auto">
                  {!comments && isFetching && (
                    <div className="flex justify-center items-center h-full">
                      <Spinner color="primary" />
                    </div>
                  )}
                  {comments && comments.length === 0 && (
                    <p className="text-center text-gray-600 font-semibold text-lg">
                      No hay comentarios de avance
                    </p>
                  )}
                  {comments && comments.length > 0 && (
                    <NotesTimeline comments={comments} />
                  )}
                </div>
              </ModalBody>
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
