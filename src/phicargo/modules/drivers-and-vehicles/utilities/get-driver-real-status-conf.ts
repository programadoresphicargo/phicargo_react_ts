
type Status = {
  key: string;
  label: string;
  color: 'warning' | 'success' | 'primary' | 'default' | 'secondary' | 'danger';
};

export const availableStatus: Status[] = [
  { key: 'available', label: 'DISPONIBLE', color: 'success' },
  { key: 'travel', label: 'VIAJE', color: 'primary' },
  { key: 'activeManeuver', label: 'MANIOBRA ACTIVA', color: 'secondary' },
  { key: 'draftManeuver', label: 'MANIOBRA BORRADOR', color: 'default' },
  { key: 'unknown', label: 'DESCONOCIDO', color: 'default' },
];

/**
 * Function to get the driver real status configuration
 * @param key Status key
 * @returns Object with the status configuration (label and color)
 */
export const getDriverRealStatusConf = (key: string): Status => {
  const conf = availableStatus.find((s) => s.key === key);
  if (conf) {
    return conf;
  }
  return { key: key, label: key.toLocaleUpperCase(), color: 'warning' };
};
