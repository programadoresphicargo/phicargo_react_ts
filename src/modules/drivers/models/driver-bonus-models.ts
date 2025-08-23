import { Dayjs } from 'dayjs';

export interface DriverBonusMonth {
  id: number;
  month: number;
  year: number;
  estado: string;
  fecha_creacion: string;
  fecha_cierre: string;
}

interface DriverBonusBase {
  score: number | null;
  excellence: number | null;
  productivity: number | null;
  operation: number | null;
  roadSafety: number | null;
  vehicleCare: number | null;
  performance: number | null;
}

export interface DriverBonus extends DriverBonusBase {
  id: number;
  driver: string;
  month: number;
  year: number;
  distance: number;
  createdAt: Dayjs | null;
}

export type DriverBonusUpdate = DriverBonusBase & {
  id: number;
};

