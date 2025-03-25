import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';

import { IncidenceForm } from '../../drivers/components/incidences/IncidenceForm';
import { SaveButton } from '@/components/ui';
import { useShiftQueries } from '../hooks/useShiftQueries';

const CreateIncidence = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shifts } = useShiftQueries();

  const [submitForm, setSubmitForm] = useState<(() => void) | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const shift = useMemo(() => {
    return shifts.find((r) => r.id === Number(id));
  }, [shifts, id]);

  const onClose = () => {
    navigate('/turnos');
  };

  if (!id) {
    return <Navigate to="/turnos" />;
  }

  return (
    <Modal isOpen={true} onOpenChange={onClose} size="lg">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center justify-center bg-[#dadfeb] pb-2">
              <h3 className="font-bold text-xl text-center text-gray-800 uppercase">
                Crear Incidencia
              </h3>
            </ModalHeader>
            <ModalBody className="p-2">
              {shift && (
                <IncidenceForm
                  driverId={shift.driver.id}
                  setSubmit={setSubmitForm}
                  setIsLoading={setIsLoading}
                  onSuccessfulSubmit={onClose}
                />
              )}
              <SaveButton
                onPress={() => submitForm && submitForm()}
                fullWidth
                variant="flat"
                className="font-bold uppercase"
                isLoading={isLoading}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateIncidence;

