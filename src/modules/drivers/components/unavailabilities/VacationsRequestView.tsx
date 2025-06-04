import type { Driver, DriverUnavailable } from '@/modules/drivers/models';
import { Spinner } from '@heroui/react';

import { DriverUnavailabilityServiceApi } from '../../services';
import { PDFViewer } from '@react-pdf/renderer';
import { VacationsRequest } from '@/modules/drivers-and-vehicles/pdf/documents/VacationsRequest';
import { useEffect } from 'react';
import { useFetch } from '@/hooks';
import { MuiModal } from '@/components';

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
    <MuiModal
      open={open}
      onClose={onClose}
      fullScreen
      header={<h2 className="text-lg font-bold">Solicitud de Vacaciones</h2>}
    >
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
    </MuiModal>
  );
};

export default VacationsRequestView;

