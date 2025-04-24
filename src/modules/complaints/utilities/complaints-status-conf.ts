import { KeyLabel, type KeyLabelConf } from '@/utilities';
import type { ComplaintStatus } from '../models';

export const complaintStatusConf: KeyLabelConf<ComplaintStatus>[] = [
  { key: 'closed', label: 'Cerrado', color: 'warning' },
  { key: 'in_process', label: 'En Proceso', color: 'success' },
  { key: 'open', label: 'Abierto', color: 'error' },
];

export const complaintStatus = new KeyLabel(complaintStatusConf);

