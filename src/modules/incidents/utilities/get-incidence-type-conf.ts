import { KeyLabel, type KeyLabelConf } from '@/utilities';
import { IncidentType } from '../models';

export const conf: KeyLabelConf<IncidentType>[] = [
  { key: 'legal', label: 'Legal', color: 'primary' },
  { key: 'operative', label: 'Operativa', color: 'secondary' },
  { key: 'cleaning', label: 'Limpieza', color: 'success' },
  { key: 'maintenance', label: 'Mantenimiento', color: 'warning' },
];

export const incidentType = new KeyLabel(conf);

