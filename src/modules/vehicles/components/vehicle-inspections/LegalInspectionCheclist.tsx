import { ChecklistForm } from '@/components/utils/checklist-form/ChecklistForm';
import type { ChecklistItem } from '@/components/utils/checklist-form/types';
import type { VehicleInspectionQuestionCreate } from '../../models';

const checklistItems: ChecklistItem[] = [
  {
    type: 'boolean',
    label: 'Tarjeta de circulación certificada',
    name: 'tarjeta_circulacion',
    defaultValue: 'si',
  },
  {
    type: 'boolean',
    label: 'Verificación de contaminantes tractos (Semestral)',
    name: 'verificacion_contaminantes',
    defaultValue: 'si',
  },
  {
    type: 'boolean',
    label: 'Inspección fisico-mecánica (Anual)',
    name: 'inspeccion_fisico_mecanica',
    defaultValue: 'si',
  },
  {
    type: 'boolean',
    label: 'Permiso de doble articulado',
    name: 'permiso_doble_articulado',
    defaultValue: 'si',
  },
  {
    type: 'boolean',
    label: 'Poliza de seguro',
    name: 'poliza_seguro',
    defaultValue: 'si',
  },
  {
    type: 'boolean',
    label: 'Permiso de conectividad (Patio México)',
    name: 'permiso_conectividad_patio_mexico',
    defaultValue: 'si',
  },
  {
    type: 'boolean',
    label: 'Factura (Dollys)',
    name: 'factura_dollys',
    defaultValue: 'si',
  },
  {
    type: 'boolean',
    label: 'Engomados de verificación',
    name: 'engomados_verificacion',
    defaultValue: 'si',
  },
  {
    type: 'boolean',
    label: 'Engomado de doble articulado',
    name: 'engomado_doble_articulado',
    defaultValue: 'si',
  },
  {
    type: 'file',
    label:
      'Evidencias fotográficas',
    name: 'fotos_evidencias',
  },
];

interface Props {
  onSubmit?: (values: VehicleInspectionQuestionCreate[]) => void;
}

export const LegalInspectionChecklist = ({ onSubmit }: Props) => {
  const handleSubmit = async (values: Record<string, unknown>) => {
    const questions = Object.entries(values).map(([key, value]) => {
      const checklistItem = checklistItems.find((item) => item.name === key);

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
        submitLabel={'Siguiente'}
      />
    </div>
  );
};

