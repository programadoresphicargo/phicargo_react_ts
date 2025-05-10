import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { Controller, FieldValues } from 'react-hook-form';
import { CustomInputProps, SelectItem } from '@/types';

interface SelectInputProps<T extends FieldValues> extends CustomInputProps<T> {
  items: SelectItem[];
  isLoading?: boolean;
  isVirtualized?: boolean;
}

export const HeroAutocompleteInput = <T extends FieldValues>(
  props: SelectInputProps<T>,
) => {
  const {
    control,
    name,
    rules,
    items,
    placeholder,
    label,
    isDisabled,
    readOnly,
    isLoading,
    isVirtualized,
    variant,
    size,
  } = props;

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, value, ref },
        fieldState: { invalid, error },
      }) => (
        <Autocomplete
          ref={ref}
          selectedKey={value}
          defaultItems={items}
          onSelectionChange={(key) => {
            onChange(key);
          }}
          size={size}
          isInvalid={invalid}
          errorMessage={error?.message}
          validationBehavior="aria"
          label={label}
          placeholder={placeholder}
          isDisabled={isDisabled}
          isReadOnly={readOnly}
          variant={variant || 'flat'}
          isLoading={isLoading}
          isVirtualized={isVirtualized}
          scrollShadowProps={{
            isEnabled: false,
          }}
        >
          {(item) => (
            <AutocompleteItem key={item.key} textValue={item.value}>
              {item.value}
            </AutocompleteItem>
          )}
        </Autocomplete>
      )}
    />
  );
};

