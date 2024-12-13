import { Controller, FieldValues } from 'react-hook-form';

import { CustomInputProps } from '../../types/global-types';
import { Input } from '@nextui-org/react';
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
            variant="flat"
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
