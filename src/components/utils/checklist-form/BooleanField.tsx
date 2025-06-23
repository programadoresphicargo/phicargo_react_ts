import { Typography } from '@mui/material';
import {
  FieldValues,
  Path,
  RadioButtonGroup,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form-mui';

interface Props<T extends FieldValues> {
  name: Path<T>;
  label: string;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
}

export const BooleanField = <T extends FieldValues>({
  label,
  name,
  rules,
}: Props<T>) => {
  const { control } = useFormContext<T>();

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

