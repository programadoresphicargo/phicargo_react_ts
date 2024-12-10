import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Tab,
  Tabs,
} from '@nextui-org/react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { BsBusFrontFill } from 'react-icons/bs';
import { FaCircle } from 'react-icons/fa6';
import PostureForm from '../components/PostureForm';
import VehicleForm from '../components/VehicleForm';
import { useMemo } from 'react';
import { useVehicleQueries } from '../hooks/useVehicleQueries';

const VehicleInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { vehicles } = useVehicleQueries();

  const vehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === Number(id)),
    [vehicles, id],
  );

  const onClose = () => {
    navigate('/disponibilidad/unidades');
  };

  if (!id) {
    return <Navigate to="/disponibilidad/unidades" />;
  }

  return (
    <Modal isOpen={true} onOpenChange={onClose} size="4xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col pb-2 bg-[#dadfeb]">
              <h3 className="font-bold text-xl text-center text-gray-800 uppercase">
                Información del Vehículo
              </h3>
              <div className="flex justify-center gap-2">
                <div className="flex items-center text-medium">
                  <BsBusFrontFill className="text-blue-500 mr-2" />
                  <span className="font-semibold text-gray-800">Unidad:</span>
                  <span className="ml-1 text-gray-700">{vehicle?.name}</span>
                </div>
                <div className="flex items-center text-medium">
                  <FaCircle className="text-green-500 mr-2" />
                  <span className="text-gray-800">Estado:</span>
                  <span className="ml-1 text-gray-700">
                    {vehicle?.state?.name || 'Sin estado'}
                  </span>
                </div>
              </div>
            </ModalHeader>

            <ModalBody>
              <div className="flex w-full flex-col">
                <Tabs
                  aria-label="vehicle-forms"
                  color="primary"
                  variant="bordered"
                  className='flex flex-col flex-1'
                >
                  <Tab 
                    key="vehicle-data" 
                    className='text-medium font-bold uppercase' 
                    title="Datos Vehiculo"
                  >
                    {vehicle ? <VehicleForm vehicle={vehicle} /> : <Spinner />}
                  </Tab>
                  <Tab 
                    key="posture-data" 
                    className='text-medium font-bold uppercase' 
                    title="Posturas"
                  >
                    {vehicle ? <PostureForm vehicle={vehicle} /> : <Spinner />}
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

