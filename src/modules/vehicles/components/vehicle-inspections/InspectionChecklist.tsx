import { ChecklistForm } from '@/components/utils/checklist-form/ChecklistForm';
import type { ChecklistItem } from '@/components/utils/checklist-form/types';
import { FilesService } from '@/modules/core/services';
import { useState } from 'react';
import { VehicleInspectionQuestion } from '../../models';

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
    type: 'photo',
    label:
      'Foto exteriores (Frente, Lateral derecho, Lateral izquierdo, Atrás)',
    name: 'fotos_exteriores',
    photoCount: 4,
  },
  {
    type: 'photo',
    label: 'Fotos interiores (Cabina, Piloto y Copiloto)',
    name: 'fotos_interiores',
    photoCount: 3,
  },
];

interface Props {
  onSubmit?: (values: VehicleInspectionQuestion[]) => void;
}

export const InspectionChecklist = ({ onSubmit }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      const photoFields = Object.keys(values).filter(
        (key) =>
          values[key] !== null &&
          typeof values[key] === 'object' &&
          'length' in values[key],
      );

      const newValues = { ...values };

      await Promise.all(
        photoFields.map(async (field) => {
          const files = values[field] as FileList;
          if (files && files.length > 0) {
            const filesArray = Array.from(files);
            const ids = await FilesService.uploadFile(filesArray);
            newValues[field] = ids;
          }
        }),
      );

      const questions: VehicleInspectionQuestion[] = Object.entries(newValues).map(
        ([key, value]) => ({
          question: checklistItems.find(item => item.name === key)?.label || key,
          answer:
            typeof value === 'string' ||
            typeof value === 'boolean' ||
            Array.isArray(value) ||
            value === null
              ? value
              : null,
        }),
      );

      onSubmit?.(questions);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ChecklistForm
        items={checklistItems}
        onSubmit={handleSubmit}
        submitLabel={isLoading ? 'Cargando evidencias...' : 'Finalizar Revisión'}
        isLoading={isLoading}
      />
    </div>
  );
};

