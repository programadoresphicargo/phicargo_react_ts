import { IncidentType } from '../models';

export const OPERATIVE_INCIDENCES: string[] = [
  'INCUMPLIMIENTO DE REGLAMENTO DE SEGURIDAD',
  'CONDUCTA AGRESIVA O IMPRUDENTE',
  'OPERADOR NO QUISO HACER MANIOBRA',
  'OPERADOR DEJA BOTADA MANIOBRA NO TOMO EQUIPO ASIGNADO',
  'DEJO VIAJE BOTADO',
  'REPORTE A DIRECCIÓN',
  'OTRO',
];

export const LEGAL_INCIDENCES: string[] = [
  'COLISIÓN',
  'VOLCADURA',
  'CONDUCIR BAJO LOS EFECTOS DEL ALCOHOL O DROGAS',
  'VIOLACIONES DE TRAFICO',
  'MANTENIMIENTO DEFICIENTE DEL VEHICULO',
  'INCUMPLIMIENTO DE REGLAMENTACIONES DE SEGURIDAD',
  'DOCUMENTACION Y REGISTROS INCORRECTOS',
  'REPORTE A DIRECCIÓN',
  'OTRO',
];

export const CLEANING_INCIDENCES: string[] = [
  'CUIDADO DE LA UNIDAD (HIGIENE DE LA UNIDAD)',
  'REPORTE A DIRECCIÓN',
  'OTRO',
];

export const MAINTENANCE_INCIDENCES: string[] = [
  'DAÑOS A LA UNIDAD (RESPONSABILIDAD DEL OPERADOR)',
  'REPORTE A DIRECCIÓN',
  'OTRO'
];

export const LEGAL_INCIDENCE_OPTIONS = LEGAL_INCIDENCES.map((r) => ({
  id: r,
  label: r,
}));

export const OPERATIVE_INCIDENCE_OPTIONS = OPERATIVE_INCIDENCES.map((r) => ({
  id: r,
  label: r,
}));

export const CLEANING_INCIDENCE_OPTIONS = CLEANING_INCIDENCES.map((r) => ({
  id: r,
  label: r,
}));

export const MAINTENANCE_INCIDENCE_OPTIONS = MAINTENANCE_INCIDENCES.map(
  (r) => ({
    id: r,
    label: r,
  }),
);

export const getIncidentOptions = (type: IncidentType) => {
  switch (type) {
    case 'legal':
      return LEGAL_INCIDENCE_OPTIONS;
    case 'operative':
      return OPERATIVE_INCIDENCE_OPTIONS;
    case 'cleaning':
      return CLEANING_INCIDENCE_OPTIONS;
    case 'maintenance':
      return MAINTENANCE_INCIDENCE_OPTIONS;

    default:
      return [];
  }
};
