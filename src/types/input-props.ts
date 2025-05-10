import { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';

import { ReactNode } from 'react';
import { SlotsToClasses } from '@heroui/react';

export interface CustomInputProps<T extends FieldValues> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any>;
  name: Path<T>;
  variant?: "flat" | "faded" | "bordered" | "underlined";
  className?: string;
  classNames?: SlotsToClasses<
    | 'label'
    | 'input'
    | 'base'
    | 'description'
    | 'errorMessage'
    | 'mainWrapper'
    | 'inputWrapper'
    | 'innerWrapper'
    | 'clearButton'
    | 'helperWrapper'
  >;
  label: ReactNode;
  placeholder?: string;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  readOnly?: boolean;
  isUpperCase?: boolean;
}
