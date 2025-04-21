import { Box, Typography } from '@mui/material';
import {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  useWatch,
} from 'react-hook-form';
import { useEffect, useState } from 'react';

import { AutocompleteElement } from 'react-hook-form-mui';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useDebounce } from '@/hooks';
import { useGetContacts } from '../../hooks/queries';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export const ContactsSearchInputMatch = <T extends FieldValues>({
  control,
  name,
  label,
  rules,
  placeholder,
  required,
}: Props<T>) => {
  const [inputValue, setInputValue] = useState('');

  const debouncedInput = useDebounce(inputValue, 400);
  const { contactsQuery } = useGetContacts(debouncedInput);

  const selectedValue = useWatch({ control, name });

  useEffect(() => {
    if (selectedValue?.name && inputValue !== selectedValue.name) {
      setInputValue(selectedValue.name);
    }
  }, [inputValue, selectedValue]);

  return (
    <AutocompleteElement
      control={control}
      matchId
      name={name}
      label={label}
      options={contactsQuery.data ?? []}
      loading={contactsQuery.isFetching}
      required={required}
      rules={rules}
      textFieldProps={{
        placeholder: placeholder,
      }}
      autocompleteProps={{
        size: 'small',
        getOptionKey: (option) => option.id,
        getOptionLabel: (option) => option.name,
        onInputChange: (_, newInputValue, reason) => {
          if (reason === 'input') {
            setInputValue(newInputValue);
          }
        },
        renderOption: (props, option) => (
          <li {...props} key={option.id}>
            <Box display="flex" alignItems="center">
              <LocationOnIcon
                sx={{ color: 'text.secondary', marginRight: 1 }}
              />
              <Box>
                <Typography fontWeight="bold">{option.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.street}
                </Typography>
              </Box>
            </Box>
          </li>
        ),
      }}
    />
  );
};

