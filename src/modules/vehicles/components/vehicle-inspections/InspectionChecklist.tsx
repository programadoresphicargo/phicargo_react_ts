import { ChecklistForm } from "@/components/utils/checklist-form/ChecklistForm";
import type { ChecklistItem } from "@/components/utils/checklist-form/types";

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
    label: 'Foto exteriores (Frente, Lateral derecho, Lateral izquierdo, Atrás)',
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

export const InspectionChecklist = () => {
  const handleSubmit = (values: Record<string, unknown>) => {
    console.log('Checklist enviado:', values);
  };

  return (
    <div className="">
      <ChecklistForm items={checklistItems} onSubmit={handleSubmit} submitLabel="Finalizar Revisión" />
    </div>
  );
};
