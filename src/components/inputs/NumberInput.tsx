import { Controller, FieldValues } from 'react-hook-form';

import { CustomInputProps } from '@/types';
import { Input } from "@heroui/react";
import { ReactNode } from 'react';

interface NumberInputProps<T extends FieldValues> extends CustomInputProps<T> {
  startContent?: ReactNode;
  endContent?: ReactNode;
}

export const NumberInput = <T extends FieldValues>(
  props: NumberInputProps<T>,
) => {
  const {
    control,
    name,
    className,
    label,
    rules,
    variant,
    isDisabled,
    placeholder,
    startContent,
    endContent,
  } = props;

  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, name, value }, fieldState }) => (
          <Input
            type="number"
            className={className}
            isDisabled={isDisabled}
            label={label}
            placeholder={placeholder}
            size="sm"
            variant={variant || 'flat'}
            name={name}
            startContent={startContent}
            endContent={endContent}
            onValueChange={(value) => onChange(Number(value))}
            value={value}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error ? fieldState.error.message : null}
          />
        )}
      />
    </>
  );
};

export default NumberInput;
