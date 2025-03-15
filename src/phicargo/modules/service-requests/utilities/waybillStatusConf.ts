import type { WaybillStatus } from '../models';

interface WaybillStatusConf {
  keyStatus: WaybillStatus;
  status: string;
  color:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
}

export const waybillStatusConf: WaybillStatusConf[] = [
  { keyStatus: 'draft', status: 'Pendiente', color: 'warning' },
  { keyStatus: 'cancel', status: 'Cancelado', color: 'danger' },
];

export const getWaybillStatusConfig = (
  status: WaybillStatus,
): WaybillStatusConf | undefined => {
  return waybillStatusConf.find((conf) => conf.keyStatus === status);
};

