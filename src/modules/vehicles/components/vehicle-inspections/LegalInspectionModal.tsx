import { useState } from 'react';
import { MuiModal } from '@/components';
import type {
  VehicleInspection,
  VehicleInspectionQuestionCreate,
} from '../../models';
import { InspectionForm } from './InspectionForm';
import { LegalInspectionChecklist } from './LegalInspectionCheclist';

interface Props {
  open: boolean;
  onClose: () => void;
  vehicleInspection: VehicleInspection;
}

export const LegalInspectionModal = ({
  open,
  onClose,
  vehicleInspection,
}: Props) => {
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState<VehicleInspectionQuestionCreate[]>([]);

  const handleChecklist = (values: VehicleInspectionQuestionCreate[]) => {
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
          <LegalInspectionChecklist onSubmit={handleChecklist} />
        ) : (
          <InspectionForm
            vehicleId={vehicleInspection.id}
            inspectionType='legal'
            onCancel={onClose}
            onSuccess={handleFormSuccess}
            checklist={questions}
          />
        )}
      </div>
    </MuiModal>
  );
};

