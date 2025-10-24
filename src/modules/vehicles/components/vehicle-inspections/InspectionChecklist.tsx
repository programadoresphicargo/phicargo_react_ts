import { ChecklistForm } from '@/components/utils/checklist-form/ChecklistForm';
import type { ChecklistItem } from '@/components/utils/checklist-form/types';
import type { VehicleInspectionQuestionCreate } from '../../models';

const checklistItems: ChecklistItem[] = [
  {
    type: 'boolean',
    label: 'Portación de sustancias ilícitas',
    name: 'sustancias_ilicitas',
    defaultValue: 'no',
  },
  {
    type: 'boolean',
    label: 'Camión limpio',
    name: 'camion_limpio',
    defaultValue: 'si',
  },
  {
    type: 'file',
    label:
      "Foto exterior (frente del camión, donde se note el número de vehículo)",
    name: 'fotos_exteriores',
    photoCount: 1,
  },
  {
    type: 'file',
    label: 'Fotos interiores (Piloto, Copiloto, Cama, Tablero y Piso)',
    name: 'fotos_interiores',
    photoCount: 5,
  },
];

interface Props {
  onSubmit?: (values: VehicleInspectionQuestionCreate[]) => void;
}

export const InspectionChecklist = ({ onSubmit }: Props) => {
  const handleSubmit = async (values: Record<string, unknown>) => {
    const questions = Object.entries(values).map(([key, value]) => {
      const checklistItem = checklistItems.find(item => item.name === key); 

      return {
        question: checklistItem?.label || key,
        answer: value,
        questionType: checklistItem?.type as 'boolean' | 'text' | 'file',
      };
    });

    onSubmit?.(questions);
  };

  return (
    <div>
      <ChecklistForm
        items={checklistItems}
        onSubmit={handleSubmit}
        submitLabel={'Finalizar Revisión'}
      />
    </div>
  );
};

