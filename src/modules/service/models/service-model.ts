import type { BranchSimple, CompanySimple } from '@/modules/core/models';

import type { Dayjs } from 'dayjs';

export type WaybillStatus = 'draft' | 'cancel' | 'confirmed' | 'approved';

export type TravelState =
  | 'draft'
  | 'progress'
  | 'stop'
  | 'done'
  | 'closed'
  | 'cancel';

export interface Category {
  id: number;
  name: string;
}

export interface Client {
  id: number;
  name: string;
  street: string | null;
}

export interface Travel {
  id: number;
  name: string;
  status: string;
  driver: string | null;
  vehicle: string | null;
  state: TravelState;
}

export interface Maneuver {
  id: number;
  type: string;
  status: string;
  scheduledStart: Dayjs;
  activationDate: Dayjs | null;
  driver: string | null;
  vehicle: string | null;
}

export interface WaybillService {
  id: number;
  name: string | null;
  dateOrder: Dayjs;
  state: WaybillStatus;
  cfdiComplemento: string;
  branch: BranchSimple | null;
  company: CompanySimple;
  category: Category | null;
  client: Client;
  reference: string | null;
  subclientBel: string | null;
  routeBel: string | null;
  typeBel: string | null;
  modeBel: string | null;
  measureBel: string | null;
  classBel: string | null;
  custodyBel: string | null;
  type2Bel: string | null;
  referenceOwr: string | null;
  reference2: string | null;
  executive: string | null;
  travel: Travel | null;
  maneuvers: Maneuver[];
}

