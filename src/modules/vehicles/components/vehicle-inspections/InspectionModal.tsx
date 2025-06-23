import { useState } from 'react';
import { MuiModal } from '@/components';
import type {
  VehicleInspection,
  VehicleInspectionQuestion,
} from '../../models';
import { InspectionChecklist } from './InspectionChecklist';
import { InspectionForm } from './InspectionForm';

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
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState<VehicleInspectionQuestion[]>([]);

  const handleChecklist = (values: VehicleInspectionQuestion[]) => {
    console.log('Valores Checklist en InspectionModal:', values);
    setQuestions(values);
    setStep(2);
  };

  const handleFormSuccess = () => {
    onClose();
  };

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
        {step === 1 ? (
          <InspectionChecklist onSubmit={handleChecklist} />
        ) : (
          <InspectionForm
            vehicleId={vehicleInspection.id}
            onCancel={onClose}
            onSuccess={handleFormSuccess}
            checklist={questions}
          />
        )}
      </div>
    </MuiModal>
  );
};

