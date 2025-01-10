import { Controller, FieldValues } from 'react-hook-form';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

import { CustomInputProps } from '../../types/global-types';
import { Input } from '@nextui-org/react';
import { useState } from 'react';

interface PasswordInputProps<T extends FieldValues>
  extends CustomInputProps<T> {
  required?: boolean;
}

export const PasswordInput = <T extends FieldValues>({
  control,
  name,
  className,
  rules,
  classNames,
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
            classNames={classNames}
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
            className={className}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error ? fieldState.error.message : null}
          />
        );
      }}
    />
  );
};
