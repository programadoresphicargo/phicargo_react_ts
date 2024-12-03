import type {
  Permission,
  PermissionApi,
  PermissionUser,
  PermissionUserAdd,
  PermissionUserAddApi,
  PermissionUserApi,
} from '../models';

import dayjs from 'dayjs';

/**
 * Mapper to convert the permission data from the API to the local model
 * @param permission Object with the permission data
 * @returns Object with the permission data
 */
export const permissionToLocal = (permission: PermissionApi): Permission => ({
  id: permission.id,
  name: permission.name,
  description: permission.description,
  createdAt: dayjs(permission.created_at),
});

/**
 * Mapper to convert the permission data from the API to the local model
 * @param permission Object with the permission data
 * @returns Object with the permission data
 */
export const permissionUserToLocal = (
  permission: PermissionUserApi,
): PermissionUser => ({
  userId: permission.user_id,
  permissionId: permission.permission_id,
  grantedBy: permission.granted_by,
});

/**
 * Mapper to convert the permission data to the API model
 * @param permissions Object with the permission data
 * @returns Object with the permission data
 */
export const addPermissionsToApi = (
  permissions: PermissionUserAdd,
): PermissionUserAddApi => ({
  user_id: permissions.userId,
  permission_ids: permissions.permissionIds,
});
