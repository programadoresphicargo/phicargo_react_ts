import type { ComplaintStatus } from '../models';

interface ComplaintStatusConf {
  key: ComplaintStatus;
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

export const complaintStatusConf: ComplaintStatusConf[] = [
  { key: 'closed', status: 'Cerrado', color: 'warning' },
  { key: 'in_process', status: 'En Proceso', color: 'success' },
  { key: 'open', status: 'Abierto', color: 'error' },
];

export const getComplaintStatusConfig = (
  key: ComplaintStatus,
): ComplaintStatusConf | undefined => {
  return complaintStatusConf.find((conf) => conf.key === key);
};

