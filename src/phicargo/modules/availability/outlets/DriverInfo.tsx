import {
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
} from '@heroui/react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';

import DriverInfoForm from '../components/DriverInfoForm';
import DriverModalHeader from '../components/DriverModalHeader';
import DriverPermissions from '../components/DriverPermissions';
import { ManeuverDriverTimeline } from '../../drivers/components/ManeuverDriverTimeline';
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
              <ModalBody className="bg-gray-400 p-4">
                <Tabs aria-label="Options">
                  <Tab key="permissions" title="Permisos">
                    {driver && <DriverPermissions driver={driver} />}
                  </Tab>
                  <Tab key="driver-form" title="Información">
                    <DriverInfoForm driver={driver} />
                  </Tab>
                  <Tab key="meneuvers" title="Maniobras">
                    <Card>
                      <CardBody className="h-96 overflow-y-auto">
                        {driver && (
                          <ManeuverDriverTimeline driverId={driver!.id} />
                        )}
                      </CardBody>
                    </Card>
                  </Tab>
                </Tabs>
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
