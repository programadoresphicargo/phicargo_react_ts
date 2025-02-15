import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';

import DriverInfoForm from '../components/DriverInfoForm';
import DriverModalHeader from '../components/DriverModalHeader';
import DriverPermissions from '../components/DriverPermissions';
import UnavailiabilityCreateModal from '../components/UnavailiabilityCreateModal';
import { useDriverQueries } from '../hooks/useDriverQueries';

const DriverInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const { drivers } = useDriverQueries();
  const driver = useMemo(
    () => drivers.find((d) => d.id === Number(id)),
    [drivers, id],
  );

  const onClose = () => {
    navigate('/disponibilidad/operadores');
  };

  if (!id) {
    return <Navigate to="/disponibilidad/operadores" />;
  }

  return (
    <>
      <Modal isOpen={true} onOpenChange={onClose} size="2xl">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex items-center justify-around bg-[#dadfeb] pb-2">
                <DriverModalHeader driver={driver} />
              </ModalHeader>
              <ModalBody className="flex flex-col md:flex-row bg-gray-400 p-4 gap-4">
                <div className="w-full md:w-1/2">
                  {driver && <DriverPermissions driver={driver} />}
                </div>
                <div className="w-full md:w-1/2">
                  <DriverInfoForm driver={driver} />
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <UnavailiabilityCreateModal
        driverId={Number(id)}
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(!isOpen)}
      />
    </>
  );
};

export default DriverInfo;
