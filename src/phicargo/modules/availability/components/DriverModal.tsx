import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { useMemo, useState } from 'react';

import DriverInfoForm from './DriverInfoForm';
import DriverModalHeader from './DriverModalHeader';
import DriverPermissions from './DriverPermissions';
import UnavailiabilityCreateModal from './UnavailiabilityCreateModal';
import { useDriverQueries } from '../hooks/useDriverQueries';

interface Props {
  onOpenChange: () => void;
  driverId: number;
}

const DriverModal = (props: Props) => {
  const { onOpenChange, driverId } = props;
  const [isOpen, setIsOpen] = useState(false);

  const { drivers } = useDriverQueries();
  const driver = useMemo(
    () => drivers.find((d) => d.id === driverId),
    [drivers, driverId],
  );

  return (
    <>
      <Modal isOpen={true} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex items-center justify-around bg-[#dadfeb] pb-0">
                <DriverModalHeader driver={driver} />
              </ModalHeader>
              <ModalBody className="flex flex-col md:flex-row bg-gray-400 p-4 gap-4">
                <div className="w-full md:w-1/2">
                  <DriverPermissions driverId={driverId} />
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
        driverId={driverId}
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(!isOpen)}
      />
    </>
  );
};

export default DriverModal;
