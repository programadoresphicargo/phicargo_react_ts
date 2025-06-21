import { Typography } from '@mui/material';
import {
  Control,
  FieldValues,
  Path,
  RadioButtonGroup,
  RegisterOptions,
} from 'react-hook-form-mui';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
}

export const BooleanField = <T extends FieldValues>({
  control,
  label,
  name,
  rules,
}: Props<T>) => {
  return (
    <>
      <Typography>{label}</Typography>
      <RadioButtonGroup
        control={control}
        name={name}
        row
        options={[
          {
            id: 'si',
            label: 'Si',
          },
          {
            id: 'no',
            label: 'No',
          },
        ]}
        rules={rules}
      />
    </>
  );
};

