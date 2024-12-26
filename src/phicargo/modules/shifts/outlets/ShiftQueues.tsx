import { IconButton, Tooltip } from '@mui/material';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';

import RefreshIcon from '@mui/icons-material/Refresh';
import { ShiftQueueTable } from '../components/ShiftQueueTable';
import { useNavigate } from 'react-router-dom';
import { useShiftQueueQueries } from '../hooks/useShiftQueueQueries';

const ShiftQueues = () => {
  const navigate = useNavigate();

  const { queuesQuery } = useShiftQueueQueries();

  const onClose = () => {
    navigate('/turnos');
  };

  return (
    <>
      <Modal isOpen={true} onOpenChange={onClose} size="5xl">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="relative flex items-center justify-center bg-[#dadfeb] pb-2">
                <div className="absolute left-0 inset-y-0 flex items-center pl-2">
                  <Tooltip arrow title="Refrescar">
                    <IconButton
                      sx={{ padding: 0 }}
                      onClick={() => queuesQuery.refetch()}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </div>
                <h3 className="font-bold text-xl text-center text-gray-800 uppercase">
                  Operadores en Cola
                </h3>
              </ModalHeader>
              <ModalBody className="p-2">
                <ShiftQueueTable
                  queues={queuesQuery.data || []}
                  isLoading={queuesQuery.isFetching}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShiftQueues;

