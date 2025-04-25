import { KeyLabel, type KeyLabelConf } from '@/utilities';
import type { IncidenceType } from '../models';

export const conf: KeyLabelConf<IncidenceType>[] = [
  { key: 'legal', label: 'Legal', color: 'primary' },
  { key: 'operative', label: 'Operativa', color: 'secondary' },
];

export const incidenceType = new KeyLabel(conf);

