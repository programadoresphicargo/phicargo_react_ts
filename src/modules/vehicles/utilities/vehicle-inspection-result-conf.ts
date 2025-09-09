import { KeyLabel, type KeyLabelConf } from '@/utilities';
import { InspectionResult } from '../models';

export const conf: KeyLabelConf<InspectionResult>[] = [
  { key: 'approved', label: 'Aprobado', color: 'success' },
  { key: 'rejected', label: 'Rechazado', color: 'error' },
];

export const inspectionResult = new KeyLabel(conf);

