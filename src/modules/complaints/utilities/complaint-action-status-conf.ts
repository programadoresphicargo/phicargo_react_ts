import { KeyLabel, type KeyLabelConf } from '@/utilities';
import type { ComplaintActionStatus } from '../models';

export const conf: KeyLabelConf<ComplaintActionStatus>[] = [
  { key: 'canceled', label: 'Cancelado', color: 'error' },
  { key: 'in_progress', label: 'En Proceso', color: 'warning' },
  { key: 'completed', label: 'Completado', color: 'success' },
  { key: 'pending', label: 'Pendiente', color: 'info' },
];

export const complaintActionStatus = new KeyLabel(conf);

