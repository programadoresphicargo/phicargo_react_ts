import { KeyLabel, type KeyLabelConf } from '@/utilities';
import type { ComplaintPriority } from '../models';

const conf: KeyLabelConf<ComplaintPriority>[] = [
  { key: 'high', label: 'Alta', color: 'error' },
  { key: 'low', label: 'Baja', color: 'info' },
  { key: 'medium', label: 'Media', color: 'warning' },
];

export const complaintPriority = new KeyLabel(conf);

