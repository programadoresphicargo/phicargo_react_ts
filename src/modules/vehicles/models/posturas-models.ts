import { Dayjs } from 'dayjs';
import type { UserRead } from '../../users-management/models';

interface PosturaBase {
  reason: string;
}

export interface Postura extends PosturaBase {
  id: number;
  driver: string;
  vehicleId: number;
  byUser: UserRead;
  createdAt: Dayjs;
}

export interface PosturaCreate extends PosturaBase {
  driverId: number;
}
