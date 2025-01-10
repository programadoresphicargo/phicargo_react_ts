import { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import type {
  MRT_ColumnFiltersState,
  MRT_ColumnOrderState,
  MRT_ColumnPinningState,
  MRT_GroupingState,
  MRT_SortingState,
} from 'material-react-table';

import { SlotsToClasses } from '@nextui-org/react';

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

export interface CustomInputProps<T extends FieldValues> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any>;
  name: Path<T>;
  className?: string;
  classNames?: SlotsToClasses<"label" | "input" | "base" | "description" | "errorMessage" | "mainWrapper" | "inputWrapper" | "innerWrapper" | "clearButton" | "helperWrapper">
  label: ReactNode;
  placeholder?: string;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  isDisabled?: boolean;
  isUpperCase?: boolean;
}

export type StatusColor<T extends string> = {
  key: T;
  label: string;
  color: 'warning' | 'success' | 'primary' | 'default' | 'secondary' | 'danger';
};

export interface UpdatableItem<T> {
  id: number;
  updatedItem: T;
}

export interface SimpleData {
  id: number;
  name: string;
}

export type MenuItemType = {
  name: string;
  path: string;
};

export interface TableState {
  resetState: () => void;
  columnFilters: MRT_ColumnFiltersState;
  globalFilter: string;
  sorting: MRT_SortingState;
  grouping: MRT_GroupingState;
  columnPinning: MRT_ColumnPinningState;
  columnOrdering: MRT_ColumnOrderState;
  setColumnFilters: Dispatch<SetStateAction<MRT_ColumnFiltersState>>;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  setSorting: Dispatch<SetStateAction<MRT_SortingState>>;
  setGrouping: Dispatch<SetStateAction<MRT_GroupingState>>;
  setColumnPinning: Dispatch<SetStateAction<MRT_ColumnPinningState>>;
  setColumnOrdering: Dispatch<SetStateAction<MRT_ColumnOrderState>>;
}
