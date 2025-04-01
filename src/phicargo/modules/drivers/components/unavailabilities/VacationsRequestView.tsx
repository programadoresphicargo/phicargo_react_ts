import type { Driver, DriverUnavailable } from '@/phicargo/modules/drivers/models';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from '@heroui/react';

import { DriverUnavailabilityServiceApi } from '../../services';
import { PDFViewer } from '@react-pdf/renderer';
import { VacationsRequest } from '@/phicargo/modules/drivers-and-vehicles/pdf/documents/VacationsRequest';
import { useEffect } from 'react';
import { useFetch } from '@/hooks';

interface Props {
  open: boolean;
  onClose: () => void;
  driver: Driver;
  unavailability: DriverUnavailable;
}

const VacationsRequestView = ({
  open,
  onClose,
  driver,
  unavailability,
}: Props) => {
  const { data: vacationSummary, fetchData } = useFetch(() =>
    DriverUnavailabilityServiceApi.getDriverVacationSummary(
      unavailability.vacationDocId || 0,
    ),
  );

  useEffect(() => {
    if (unavailability && unavailability.vacationDocId) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unavailability]);

  return (
    <Modal size={'full'} isOpen={open} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 pb-0">
              <h2 className="text-lg font-bold">Solicitud de Vacaciones</h2>
            </ModalHeader>
            <ModalBody>
              {!vacationSummary && (
                <div className="flex justify-center items-center h-96">
                  <Spinner />
                </div>
              )}
              {vacationSummary && (
                <PDFViewer style={{ width: '100%', height: '100%' }}>
                  <VacationsRequest
                    driver={driver}
                    unavailability={unavailability}
                    vacationSummary={vacationSummary}
                  />
                </PDFViewer>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default VacationsRequestView;

