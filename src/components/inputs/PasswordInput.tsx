import { Controller, FieldValues } from 'react-hook-form';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

import { CustomInputProps } from '@/types';
import { Input } from "@heroui/react";
import { useState } from 'react';

interface PasswordInputProps<T extends FieldValues>
  extends CustomInputProps<T> {
  required?: boolean;
}

export const PasswordInput2 = <T extends FieldValues>({
  control,
  name,
  rules,
  label = 'Contraseña',
}: PasswordInputProps<T>) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
        // required
        //   ? {
        //       required: 'Por favor, ingresa tu contraseña.',
        //       minLength: {
        //         value: 6,
        //         message: 'Debe tener al menos 8 caracteres',
        //       },
        //     }
        //   : undefined
      render={({ field: { value, name, onChange }, fieldState }) => {
        return (
          <Input
            label={label}
            size="sm"
            name={name}
            value={value}
            variant="faded"
            defaultValue=""
            onValueChange={onChange}
            color='primary'
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <FaRegEye className="text-lg pointer-events-none text-default-400" />
                ) : (
                  <FaRegEyeSlash className="text-lg pointer-events-none text-default-400" />
                )}
              </button>
            }
            type={isVisible ? 'text' : 'password'}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error ? fieldState.error.message : null}
          />
        );
      }}
    />
  );
};
