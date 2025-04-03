import type { IncidenceType } from '../models';

interface IncidenceTypeConf {
  key: IncidenceType;
  type: string;
  color:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
}

export const incidenceTypeConf: IncidenceTypeConf[] = [
  { key: 'operative', type: 'Operativa', color: 'warning' },
  { key: 'legal', type: 'Legal', color: 'error' },
];

export const getIncidenceTypeConfig = (
  type: IncidenceType,
): IncidenceTypeConf | undefined => {
  return incidenceTypeConf.find((conf) => conf.key === type);
};
