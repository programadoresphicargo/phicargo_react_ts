import { MuiModal } from '@/components';
import type { VehicleInspection } from '../../models';
// import { InspectionForm } from './InspectionForm';
import { InspectionChecklist } from './InspectionChecklist';

interface Props {
  open: boolean;
  onClose: () => void;
  vehicleInspection: VehicleInspection;
}

export const InspectionModal = ({
  open,
  onClose,
  vehicleInspection,
}: Props) => {
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      maxWidth="md"
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="uppercase font-thin text-lg">
            Revisar Unidad:{' '}
            <span className="font-bold">{`${vehicleInspection.name} (${
              vehicleInspection.driver?.name ?? 'SIN OPERADOR ASIGNADO'
            })`}</span>
          </h2>
        </div>
      }
    >
      <div className="p-6">
        <InspectionChecklist />
        {/* <InspectionForm vehicleId={vehicleInspection.id} onCancel={onClose} onSuccess={onClose} /> */}
      </div>
    </MuiModal>
  );
};

