import { KeyLabel, type KeyLabelConf } from '@/utilities';
import type { MaintenanceRecordStatus } from '../models';

export const conf: KeyLabelConf<MaintenanceRecordStatus>[] = [
  { key: 'cancelled', label: 'Cancelado', color: 'error' },
  { key: 'completed', label: 'Completado', color: 'success' },
  { key: 'pending', label: 'Pendiente', color: 'warning' },
  { key: 'programmed', label: 'Programado', color: 'primary' },
];

export const maintenanceStatus = new KeyLabel(conf);
