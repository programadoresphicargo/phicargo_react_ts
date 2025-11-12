export type Option<T> = {
  key: string;
  label: string;
  value: T;
};

export type OnError = {
  error: string | null;
};

export type SelectItem = {
  key: number | string;
  value: string;
};

export type Result<T, E> =
  | { ok: boolean; value: T }
  | { ok: boolean; error: E };

export type ValidateResult = {
  ok: boolean;
  message: string;
};

export type StatusColor<T extends string> = {
  key: T;
  label: string;
  color: 'warning' | 'success' | 'primary' | 'default' | 'secondary' | 'danger';
};

export interface UpdatableItem<T> {
  id: number;
  updatedItem: T;
  files?: File[];
}

export interface SimpleData {
  id: number;
  name: string;
}

export type MenuItemType = {
  name: string;
  path: string;
  exact?: boolean;
  requiredPermissions: number[];
};

