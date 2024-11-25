import { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";

export type OnError = {
  error: string | null;
}

export type SelectItem = {
  key: number | string;
  value: string;
}

export type Result<T, E> = 
  | { ok: boolean, value: T }
  | { ok: boolean, error: E }


export type ValidateResult = {
  ok: boolean;
  message: string;
}

export interface CustomInputProps<T extends FieldValues> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any>;
  name: Path<T>;
  className?: string;
  label: string;
  placeholder?: string;
  rules?: Omit<RegisterOptions<T, Path<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
  isDisabled?: boolean;
}

export type StatusColor<T extends string> = {
  key: T;
  label: string;
  color: "warning" | "success" | "primary" | "default" | "secondary" | "danger";
}

export interface UpdatebleItem<T> {
  id: number;
  updatedItem: T;
}
