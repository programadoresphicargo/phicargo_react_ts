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
  setValue: UseFormSetValue<T>;
}

export const DriverAutocompleteInput = <T extends FieldValues>({
  control,
  name,
  label,
  setValue,
}: Props<T>) => {
  const { AvailableDrivers, isLoading } = useDriverQueries();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Autocomplete
          label={label}
          placeholder="Seleccione un operador"
          isLoading={isLoading}
          selectedKey={field.value || null}
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
