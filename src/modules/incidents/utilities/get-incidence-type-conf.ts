import { KeyLabel, type KeyLabelConf } from '@/utilities';
import { IncidentType } from '../models';

export const conf: KeyLabelConf<IncidentType>[] = [
  { key: 'legal', label: 'Legal', color: 'warning' },
  { key: 'operative', label: 'Operativa', color: 'error' },
  { key: 'cleaning', label: 'Limpieza', color: 'info' },
  { key: 'maintenance', label: 'Mantenimiento', color: 'secondary' },
];

export const incidentType = new KeyLabel(conf);

