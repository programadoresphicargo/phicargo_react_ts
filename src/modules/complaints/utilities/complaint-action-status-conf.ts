import type { ComplaintActionStatus } from '../models';

interface ComplaintActionStatusConf {
  key: ComplaintActionStatus;
  status: string;
  color:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
}

export const complaintActionStatusConf: ComplaintActionStatusConf[] = [
  { key: 'canceled', status: 'Cancelado', color: 'error' },
  { key: 'in_progress', status: 'En Proceso', color: 'warning' },
  { key: 'completed', status: 'Completado', color: 'success' },
  { key: 'pending', status: 'Pendiente', color: 'info' },
];

export const getComplaintActionStatusConfig = (
  key: ComplaintActionStatus,
): ComplaintActionStatusConf | undefined => {
  return complaintActionStatusConf.find((conf) => conf.key === key);
};

