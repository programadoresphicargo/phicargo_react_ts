import type { TravelState } from '../models';
import { KeyLabel, type KeyLabelConf } from '@/utilities';

const conf: KeyLabelConf<TravelState>[] = [
  { key: 'cancel', label: 'Cancelado', color: 'error' },
  { key: 'closed', label: 'Cerrado', color: 'success' },
  { key: 'done', label: 'Realizado', color: 'primary' },
  { key: 'draft', label: 'Pendiente', color: 'warning' },
  { key: 'progress', label: 'En Tránsito', color: 'default' },
  { key: 'stop', label: 'Detenido', color: 'default' },
];

export const travelStatus = new KeyLabel(conf);

