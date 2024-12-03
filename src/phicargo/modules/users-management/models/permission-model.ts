import { Dayjs } from 'dayjs';

export interface PermissionBase {
  name: string;
  description: string;
  createdAt: Dayjs;
}

export interface Permission extends PermissionBase {
  id: number;
}

export interface PermissionUser {
  userId: number;
  permissionId: number;
  grantedBy: number;
}

export interface PermissionUserAdd {
  userId: number;
  permissionIds: number[];
}
