
export interface PermissionBaseApi {
  name: string;
  description: string;
  created_at: string;
}

export interface PermissionApi extends PermissionBaseApi {
  id: number;
}

export interface PermissionUserApi {
  user_id: number;
  permission_id: number;
  granted_by: number;
}

export interface PermissionUserAddApi {
  user_id: number;
  permission_ids: number[];
}
