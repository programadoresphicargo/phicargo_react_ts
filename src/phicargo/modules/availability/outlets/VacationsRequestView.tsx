import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { PDFViewer } from '@react-pdf/renderer';
import { VacationsRequest } from '../pdf/documents/VacationsRequest';
import { useDriverQueries } from '../hooks/useDriverQueries';
import { useMemo } from 'react';

const VacationsRequestView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');

  const { drivers } = useDriverQueries();
  const driver = useMemo(
    () => drivers.find((d) => d.id === Number(id)),
    [drivers, id],
  );

  const onClose = () => {
    navigate('/disponibilidad/operadores');
  };

  if (!id || !startDate || !endDate) {
    return <Navigate to="/disponibilidad/operadores" />;
  }

  return (
    <Modal size={'full'} isOpen={true} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 pb-0">
              <h2 className="text-lg font-bold">Solicitud de Vacaciones</h2>
            </ModalHeader>
            <ModalBody>
              {driver && (
                <PDFViewer style={{ width: '100%', height: '100%' }}>
                  <VacationsRequest 
                    requisitionerName={driver?.name} 
                    periodStart={startDate}
                    periodEnd={endDate}
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

