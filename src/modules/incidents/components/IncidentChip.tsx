import { Chip } from "@heroui/react";
import { Incident as IncidentModel } from "@/modules/incidents/models/incident-models";

// Tipos de colores válidos de Hero UI
type ChipColor = 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | undefined;

// Mapeo de estados conocidos
const estadoMap: Record<string, { label: string; color: ChipColor }> = {
 pending_validation: { label: 'Pendiente de validación', color: 'warning' },
 canceled: { label: 'Cancelado', color: 'danger' },
 confirmed: { label: 'Confirmado', color: 'success' },
};

export default function IncidentChip({ incident }: { incident: IncidentModel }) {
 const state = incident.state ?? ''; // si es null, lo convertimos a string vacío

 // Si el estado no está en el mapa, usamos valores por defecto
 const { label, color } = estadoMap[state] || { label: 'Desconocido', color: 'default' };

 return (
  <h1 className="flex items-center gap-2">
   Estado:
   <Chip color={color} className="text-white">
    {label}
   </Chip>
  </h1>
 );
}
