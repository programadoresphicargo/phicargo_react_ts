import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
} from '@nextui-org/react';

import PostureForm from '../components/PostureForm';
import VehicleForm from '../components/VehicleForm';
import { useNavigate } from 'react-router-dom';

const VehicleInfo = () => {
  const navigate = useNavigate();

  const onClose = () => {
    navigate('/disponibilidad/unidades');
  };

  return (
    <Modal isOpen={true} onOpenChange={onClose} size="5xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col pb-1 bg-gray-100 gap-1">
              <h3 className="font-bold text-center text-2xl">
                Información del Vehiculo
              </h3>
            </ModalHeader>
            <ModalBody>
              <div className="flex w-full flex-col">
                <Tabs
                  aria-label="vehicle-forms"
                  color="primary"
                  variant="bordered"
                >
                  <Tab key="vehicle-data" title="Datos Vehiculo">
                    <VehicleForm />
                  </Tab>
                  <Tab key="posture-data" title="Posturas">
                    <PostureForm />
                  </Tab>
                </Tabs>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default VehicleInfo;

