import {
  AutocompleteElement,
  FieldValues,
  AutocompleteElementProps,
  UseFormSetValue,
} from 'react-hook-form-mui';
import { useDriverQueries } from '../hooks/queries';
import PersonIcon from '@mui/icons-material/Person';

interface Props<T extends FieldValues>
  extends Omit<AutocompleteElementProps<T>, 'options'> {
  setValue: UseFormSetValue<T>;
}

export const DriverAutocompleteInput = <T extends FieldValues>(
  props: Props<T>,
) => {
  const { AvailableDrivers, isLoading } = useDriverQueries();
  const { control, name, label, setValue } = props;
  return (
    <AutocompleteElement
      control={control}
      label={label}
      loading={isLoading}
      options={
        AvailableDrivers.map((v) => ({
          label: v.value,
          id: v.key,
        })) || []
      }
      autocompleteProps={{
        getOptionKey: (option) => option.id,
        onChange: (_, value) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setValue(name, (value?.id as any) || null);
        },
        size: 'small',
      }}
      textFieldProps={{
        InputProps: {
          endAdornment: null,
          startAdornment: <PersonIcon />,
        },
        placeholder: 'Saleccione un operador',
      }}
      {...props}
    />
  );
};

