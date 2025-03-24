import {
  Control,
  FieldValues,
  Path,
  TextFieldElement,
} from 'react-hook-form-mui';
import { IconButton, InputAdornment } from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';

interface Props<TData extends FieldValues> {
  control: Control<TData>;
  name: Path<TData>;
  label?: string;
  required?: boolean;
}

export const MUIPasswordInput = <TData extends FieldValues>({
  control,
  name,
  label,
  required,
}: Props<TData>) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <TextFieldElement
      control={control}
      type={showPassword ? 'text' : 'password'}
      name={name}
      label={label || 'Contraseña'}
      fullWidth
      required={required}
      rules={required ? { required: 'La contraseña es requerida' } : {}}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword ? 'hide the password' : 'display the password'
                }
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                onMouseUp={handleMouseUpPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};
