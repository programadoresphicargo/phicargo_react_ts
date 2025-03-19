import { Controller, FieldValues } from 'react-hook-form';

import { CustomInputProps } from '@/types';
import { Textarea } from "@heroui/react";

interface TextareaInputProps<T extends FieldValues>
  extends CustomInputProps<T> {
  maxRows?: number;
  minRows?: number;
  isReadOnly?: boolean;
}

export const TextareaInput = <T extends FieldValues>(
  props: TextareaInputProps<T>,
) => {
  const {
    control,
    name,
    className,
    label,
    rules,
    isUpperCase,
    maxRows,
    minRows,
    isReadOnly,
    isDisabled,
    placeholder
  } = props;

  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, name, value }, fieldState }) => (
          <Textarea
            className={className}
            label={label}
            name={name}
            placeholder={placeholder}
            size="sm"
            variant="flat"
            maxRows={maxRows}
            minRows={minRows}
            isReadOnly={isReadOnly}
            isDisabled={isDisabled}
            onValueChange={(newValue) => {
              const transformedValue = isUpperCase
                ? newValue.toUpperCase()
                : newValue;
              onChange(transformedValue);
            }}
            value={value}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error ? fieldState.error.message : null}
          />
        )}
      />
    </>
  );
};

