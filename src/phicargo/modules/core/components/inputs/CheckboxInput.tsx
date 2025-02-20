import { Controller, FieldValues } from 'react-hook-form';

import { Checkbox } from "@heroui/react";
import { CustomInputProps } from '../../types/global-types';

export const CheckboxInput = <T extends FieldValues>(
  props: CustomInputProps<T>,
) => {
  const { control, name, className, label, rules } = props;

  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, name, value } }) => (
          <Checkbox
            name={name}
            isSelected={value}
            onChange={() => onChange(!value)}
            className={className}
          >
            {label}
          </Checkbox>
        )}
      />
    </>
  );
};
