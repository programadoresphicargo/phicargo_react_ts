import { Controller, FieldValues } from 'react-hook-form';
import { CustomInputProps, SelectItem } from '../../../core/types/global-types';
import { Select, SelectItem as SelectItemNextUI } from '@nextui-org/react';

interface SelectInputProps<T extends FieldValues> extends CustomInputProps<T> {
  items: SelectItem[];
  isLoading?: boolean;
  disabledKeys?: string[];
}

export const SelectInput = <T extends FieldValues>(
  props: SelectInputProps<T>,
) => {
  const {
    control,
    name,
    className,
    label,
    rules,
    items,
    isDisabled,
    placeholder,
    isLoading,
    disabledKeys,
  } = props;

  const handleSelectChange = (value: string) => {
    const toNumber = Number(value);

    if (isNaN(toNumber)) {
      return value;
    } else {
      return toNumber;
    }
  };

  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { name, value, onChange }, fieldState }) => (
          <Select
            className={className}
            label={label}
            isLoading={isLoading}
            size="sm"
            variant="flat"
            scrollShadowProps={{
              isEnabled: false,
            }}
            name={name}
            selectedKeys={value ? [String(value)] : []}
            placeholder={placeholder}
            value={value}
            isDisabled={isDisabled}
            disabledKeys={disabledKeys}
            onChange={(e) => onChange(handleSelectChange(e.target.value))}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error ? fieldState.error.message : null}
          >
            {items.map((c) => (
              <SelectItemNextUI key={c.key}>{c.value}</SelectItemNextUI>
            ))}
          </Select>
        )}
      />
    </>
  );
};
