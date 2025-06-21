import {
  AutocompleteElement,
  FieldValues,
  AutocompleteElementProps,
  UseFormSetValue,
} from 'react-hook-form-mui';
import { useVehicleQueries } from '../hooks/queries';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

interface Props<T extends FieldValues>
  extends Omit<AutocompleteElementProps<T>, 'options'> {
  setValue: UseFormSetValue<T>;
  disabled?: boolean;
  helperText?: string;
}

export const VehicleAutocompleteInput = <T extends FieldValues>(
  props: Props<T>,
) => {

  const { vehicleQuery } = useVehicleQueries();
  const { control, name, label, setValue, disabled, helperText } = props;

  return (
    <AutocompleteElement
      control={control}
      name={name}
      label={label}
      loading={vehicleQuery.isLoading}
      options={
        vehicleQuery.data?.map((v) => ({
          label: v.name,
          id: v.id,
        })) || []
      }
      autocompleteProps={{
        getOptionKey: (option) => option.id,
        onChange: (_, value) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setValue(name, value?.id as any || null);
        },
        size: 'small',
        disabled: disabled,
      }}
      textFieldProps={{
        InputProps: {
          endAdornment: null,
          startAdornment: <DirectionsBusIcon />,
        },
        placeholder: 'Seleccione una unidad',
        helperText: helperText,
      }}
    />
  );
};

