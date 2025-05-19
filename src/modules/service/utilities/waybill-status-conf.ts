import type { WaybillStatus } from '../models';
import { KeyLabel, type KeyLabelConf } from '@/utilities';

const conf: KeyLabelConf<WaybillStatus>[] = [
  { key: 'draft', label: 'Pendiente', color: 'warning' },
  { key: 'cancel', label: 'Cancelado', color: 'error' },
  { key: 'approved', label: 'Aprobada', color: 'success' },
  { key: 'confirmed', label: 'Confirmado', color: 'primary' },
];

export const waybillStatus = new KeyLabel(conf);

