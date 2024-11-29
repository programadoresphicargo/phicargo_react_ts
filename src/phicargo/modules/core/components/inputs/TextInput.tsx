import { Controller, FieldValues } from "react-hook-form";

import { CustomInputProps } from "../../../core/types/global-types";
import { Input } from "@nextui-org/react";

export const TextInput = <T extends FieldValues>(props: CustomInputProps<T>) => {

  const { control, name, className, label, rules, isDisabled } = props;

  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, name, value }, fieldState }) => (
          <Input
            type="text"
            className ={className}
            isDisabled={isDisabled}
            label={label}
            size="sm"
            variant="faded"
            name={name}
            onValueChange={onChange}
            value={value}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error ? fieldState.error.message : null}
          />
        )}
      />
    </>
  );
};
