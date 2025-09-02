import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';

import { ArchiveDialog } from '../components/ArchiveDialog';
import { DriverManeuver } from "../../drivers/components/maneuvers/DriverManeuvers";
import { EditShiftForm } from '../components/EditShiftForm';
import { FaEdit } from 'react-icons/fa';
import { HiQueueList } from 'react-icons/hi2';
import { MdOutlineArchive } from 'react-icons/md';
import { MdOutlineLock } from 'react-icons/md';
import { MdOutlineLockOpen } from 'react-icons/md';
import { QueueDialog } from '../components/QueueDialog';
import { useShiftQueries } from '../hooks/useShiftQueries';

const ShiftDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formEnabled, setFormEnabled] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [queueDialogOpen, setQueueDialogOpen] = useState(false);

  const { shiftQuery, editShift } = useShiftQueries();

  const shift = useMemo(
    () => (shiftQuery.data || []).find((s) => s.id === Number(id)),
    [id, shiftQuery.data],
  );

  const onLockedChange = () => {
    if (!shift) {
      return;
    }
    editShift.mutate({
      id: shift.id,
      updatedItem: { locked: !shift.locked },
    });
  };

  const onArchive = () => {
    if (!shift) {
      return;
    }
    setArchiveDialogOpen(true);
  };

  const onClose = () => {
    navigate('/turnos');
  };

  if (!id) {
    return <Navigate to="/menu" />;
  }

  return (
    <>
      <Modal isOpen={true} onOpenChange={onClose} size="4xl">
        <ModalContent>
          {() => (
            <>
              <ModalHeader
                style={{
                  background: 'linear-gradient(70deg, #004494, #002887)',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                Detalles de turno
              </ModalHeader>
              <ModalBody className="p-2 ">
                <div className="flex flex-row gap-4 p-2 border-2 rounded-lg">
                  <Button
                    size="sm"
                    color={formEnabled ? 'danger' : 'primary'}
                    startContent={<FaEdit />}
                    onPress={() => setFormEnabled(!formEnabled)}
                  >
                    {formEnabled ? 'Cancelar' : 'Editar'}
                  </Button>
                  <Button
                    size="sm"
                    color="default"
                    startContent={
                      shift?.locked ? <MdOutlineLock /> : <MdOutlineLockOpen />
                    }
                    onPress={onLockedChange}
                    isLoading={editShift.isPending}
                  >
                    {shift?.locked ? 'Desfijar' : 'Fijar'}
                  </Button>
                  <Button
                    size="sm"
                    color="secondary"
                    startContent={<MdOutlineArchive />}
                    onPress={onArchive}
                  >
                    Archivar
                  </Button>
                  {/* <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    startContent={<FiAlertCircle />}
                    onPress={() => navigate(`/turnos/incidencias/crear/${id}`)}
                  >
                    Registrar Incidencia
                  </Button> */}
                  <Button
                    size="sm"
                    variant="solid"
                    color="primary"
                    className="text-white"
                    startContent={
                      <HiQueueList style={{ transform: 'rotate(180deg)' }} />
                    }
                    onPress={() => setQueueDialogOpen(true)}
                  >
                    Enviar a la cola
                  </Button>
                </div>
                <div className="flex flex-col md:flex-row p-1 gap-4">
                  <div className="w-5/12 flex flex-col gap-4 border-2 rounded-lg p-3">
                    <EditShiftForm shift={shift} enabled={formEnabled} />
                  </div>

                  <div className="w-7/12 border-2 rounded-lg p-3 max-h-[445px] overflow-y-auto">
                    {shift && <DriverManeuver driverId={shift.driver!.id} />}
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      {shift && (
        <ArchiveDialog
          isOpen={archiveDialogOpen}
          onClose={() => {
            setArchiveDialogOpen(false);
            onClose();
          }}
          shiftId={shift.id}
        />
      )}
      {shift && (
        <QueueDialog
          isOpen={queueDialogOpen}
          onClose={() => setQueueDialogOpen(false)}
          shiftId={shift.id}
        />
      )}
    </>
  );
};

export default ShiftDetail;

