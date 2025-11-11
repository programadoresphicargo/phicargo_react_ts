import {
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { Controller, FieldValues, UseFormSetValue } from "react-hook-form";
import { useDriverQueries } from "../hooks/queries";
import { Path, PathValue } from "react-hook-form";

interface Props<T extends FieldValues> {
  control: any;
  name: string;
  label: string;
  variant?: "bordered" | "flat" | "faded" | "underlined";
  setValue: UseFormSetValue<T>;
  isDisabled?: boolean;
}

export const DriverAutocompleteInput = <T extends FieldValues>({
  control,
  name,
  label,
  variant = "bordered",
  setValue,
  isDisabled = false
}: Props<T>) => {
  const { AvailableDrivers, isLoading } = useDriverQueries();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Autocomplete
          label={label}
          variant={variant}
          placeholder="Seleccione un operador"
          isLoading={isLoading}
          isDisabled={isDisabled}
          selectedKey={String(field.value) || null}
          onSelectionChange={(key) => {
            const value = key ? String(key) : null;
            field.onChange(value);
            setValue(name as Path<T>, value as PathValue<T, Path<T>>);
          }}
          isInvalid={!!fieldState.error}
          errorMessage={fieldState.error?.message}
        >
          {AvailableDrivers?.map((driver) => (
            <AutocompleteItem key={driver.key}>
              {driver.value}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      )}
    />
  );
};
