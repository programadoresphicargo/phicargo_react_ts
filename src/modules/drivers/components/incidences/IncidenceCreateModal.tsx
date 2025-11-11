import { MuiCloseButton } from '@/components/ui';
import { MuiSimpleModal } from '@/components';
import { CreateIncidentForm } from '@/modules/incidents/components/CreateIncidentForm';

interface Props {
  driverId: number;
  isOpen: boolean;
  onOpenChange: () => void;
}

export const IncidenceCreateModal = (props: Props) => {
  const { driverId, isOpen, onOpenChange } = props;

  return (
    <MuiSimpleModal
      open={isOpen}
      onClose={onOpenChange}
      maxWidth="xl"
      header={
        <div className="flex items-center justify-between">
          <h2 className="w-full">Agregar Incidencia</h2>
          <div className="flex items-center gap-2">
            <MuiCloseButton onClick={onOpenChange} />
          </div>
        </div>
      }
    >
      {/* <IncidenceForm
        driverId={driverId}
        setSubmit={setSubmitForm}
        setIsLoading={setIsLoading}
        onSuccessfulSubmit={onOpenChange}
      /> */}
      <div className="px-8 pb-4">
        <CreateIncidentForm onCancel={onOpenChange} onSuccess={onOpenChange} driverId={driverId} mode="create" />
      </div>
    </MuiSimpleModal>
  );
};

