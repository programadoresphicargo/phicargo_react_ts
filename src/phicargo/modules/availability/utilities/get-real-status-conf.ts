import { VehicleRealStatus } from '../models/vehicle-model';

type Status = {
  key: VehicleRealStatus;
  label: string;
  color: 'warning' | 'success' | 'primary' | 'default' | 'secondary' | 'danger';
};

export const availableStatus: Status[] = [
  { key: 'available', label: 'DISPONIBLE', color: 'success' },
  { key: 'travel', label: 'VIAJE', color: 'primary' },
  { key: 'activeManeuver', label: 'MANIOBRA ACTIVA', color: 'secondary' },
  { key: 'draftManeuver', label: 'MANIOBRA BORRADOR', color: 'default' },
  { key: 'maintenance', label: 'MANTENIMIENTO', color: 'warning' },
  { key: 'sinister', label: 'SINIESTRADA', color: 'danger' },
  { key: 'unknown', label: 'DESCONOCIDO', color: 'default' },
];

/**
 * Function to get the status configuration
 * @param key Status key
 * @returns Object with the status configuration (label and color)
 */
export const getRealStatusConf = (key: VehicleRealStatus) => {
  return availableStatus.find((s) => s.key === key) || availableStatus[0];
};

