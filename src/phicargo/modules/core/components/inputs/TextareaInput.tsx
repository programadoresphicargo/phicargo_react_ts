import { Controller, FieldValues } from 'react-hook-form';

import { CustomInputProps } from '../../types/global-types';
import { Textarea } from '@nextui-org/react';

export const TextareaInput = <T extends FieldValues>(
  props: CustomInputProps<T>,
) => {
  const { control, name, className, label, rules, isUpperCase } = props;

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
            placeholder="Escribe alguna observacion"
            size="sm"
            variant="flat"
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

