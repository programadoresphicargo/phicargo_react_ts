import type { Dayjs } from 'dayjs';
import type { UserBasic } from '../../auth/models';
import { OneDriveFile } from '@/modules/core/models';

export type IncidentType = 'operative' | 'legal' | 'cleaning' | 'maintenance';

export interface DriverInfo {
  id: number;
  name: string;
  license: string | null;
  modality: string | null;
  isDangerous: boolean;
}

export interface VehicleInfo {
  id: number;
  name: string;
  licensePlate: string | null;
  fleetType: string | null;
  status: string | null;
}

interface IncidentBase {
  incident: string;
  comments: string;
  type: IncidentType;
  incidentDate: Dayjs | null;
  damageCost: number | null;
  isDriverResponsible: boolean;
  state: string | null;
}

export interface Descuento {
  id_descuento: number | null;
  id_solicitante: number | null;
  id_empleado: number | null;
  importe: number | null;
  monto: number | null;
  comentarios: string | null;
  motivo: string | null;
  periodicidad: string | null;
}

export interface Incident extends IncidentBase {
  id: number;
  createdAt: Dayjs;
  user: UserBasic;
  driver: DriverInfo;
  vehicle: VehicleInfo | null;
  attendedAt: Dayjs | null;
  evidences: OneDriveFile[];
  descuento: Descuento | null;
}

export interface IncidentCreate extends IncidentBase {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  newVehicleStateId?: number | null;
  vehicleId?: number | null;
  driverId?: number | null;
  id_descuento?: number | null;
  id_solicitante?: number | null;
  periodicidad?: string | null;
  discountAmount?: number | null;
  discountTotal?: number | null;
  discountReason?: string | null;
  discountComments?: string | null;
}

export type IncidentUpdate = Partial<IncidentBase> & {
  vehicleId?: number | null;
  driverId?: number | null;
  attendedAt?: Dayjs | null;
  id_descuento?: number | null;
  id_solicitante?: number | null;
  periodicidad?: string | null;
  discountAmount?: number | null;
  discountTotal?: number | null;
  discountReason?: string | null;
  discountComments?: string | null;
};

