import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';

import { DriverUnavailable } from '../models/driver-unavailability';
import dayjs from 'dayjs';
import { useUnavailabilityQueries } from '../hooks/useUnavailabilityQueries';

interface Props {
  item: DriverUnavailable;
  driverName: string;
  isOpen: boolean;
  onOpenChange: () => void;
}

const UnavailiabilityDetails = (props: Props) => {
  const { isOpen, onOpenChange, item, driverName } = props;

  const { releaseDriverUnavailabilityMutation } = useUnavailabilityQueries({ driverId: item.employeeId });

  const onRelease = () => {
    releaseDriverUnavailabilityMutation.mutate(item.id);
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold uppercase">{item.reasonType}</h3>
              <p className="text-sm text-gray-500">Operador: {driverName}</p>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-2">
                <div>
                  <h4 className="font-semibold">Descripción:</h4>
                  <p className="text-gray-700">{item.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Inicio:</h4>
                  <p className="text-gray-700">
                    {item.startDate.format('DD/MM/YYYY')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Fin:</h4>
                  <p className="text-gray-700">
                    {item.endDate.format('DD/MM/YYYY')}
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="warning"
                size="sm"
                isDisabled={!item.endDate.isAfter(dayjs())}
                onPress={() => onRelease()}
              >
                Liberar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UnavailiabilityDetails;

