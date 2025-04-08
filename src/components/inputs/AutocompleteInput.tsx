import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Controller, FieldValues } from 'react-hook-form';
import { CustomInputProps, SelectItem } from "@/types";

interface SelectInputProps<T extends FieldValues> extends CustomInputProps<T> {
  items: SelectItem[];
  isLoading?: boolean;
  disabledKeys?: string[];
  searchInput?: string;
  isVirtualized?: boolean;
  setSearchInput?: (value: string) => void;
}

export const AutocompleteInput = <T extends FieldValues>(
  props: SelectInputProps<T>,
) => {
  const {
    control,
    name,
    className,
    label,
    rules,
    items,
    variant,
    isDisabled,
    placeholder,
    isLoading,
    searchInput,
    setSearchInput,
    isVirtualized,
  } = props;

  const handleSelectChange = (value: string) => {
    if (!value){
      return null;
    }
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
          <Autocomplete
            isVirtualized={isVirtualized}
            className={className}
            inputValue={searchInput}
            isLoading={isLoading}
            size='sm'
            name={name}
            value={value}
            items={items}
            label={label}
            variant={variant || 'flat'}
            onInputChange={setSearchInput}
            isDisabled={isDisabled}
            placeholder={placeholder}
            selectedKey={value ? String(value) : ''}
            onSelectionChange={(key) => onChange(handleSelectChange(key as string))}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error ? fieldState.error.message : null}
          >
            {(item) => (
              <AutocompleteItem key={item.key} className="capitalize">
                {item.value}
              </AutocompleteItem>
            )}
          </Autocomplete>
        )}
      />
    </>
  );
};

