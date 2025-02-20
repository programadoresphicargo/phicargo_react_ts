import { Controller, FieldValues } from "react-hook-form";

import { CustomInputProps } from "../../types/global-types";
import { Input } from "@heroui/react";

export const EmailInput = <T extends FieldValues>({ control, name }: CustomInputProps<T>) => {
  return (
    (<Controller
      name={name}
      control={control}
      rules={{
        required: "Por favor, ingresa tu correo electrónico.",
        pattern: {
          value: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
          message: "Por favor, ingresa un correo electrónico válido.",
        },
      }}
      render={({ field: { onChange, name, value }, fieldState }) => (
        <Input
          className="input-light-base"
          label="Correo Electrónico"
          defaultValue=""
          variant="faded"
          type="email"
          size="sm"
          name={name}
          onValueChange={onChange}
          value={value}
          isInvalid={fieldState.invalid}
          errorMessage={fieldState.error ? fieldState.error.message : null}
        />
      )}
    />)
  );
};