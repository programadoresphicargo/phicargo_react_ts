import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';

import type { Contact } from '@/phicargo/modules/contacts/models';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useDebounce } from '@/hooks';
import { useGetContacts } from '../../hooks/queries';
import { useState } from 'react';

interface Props<T extends FieldValues> {
  control: Control<T, unknown>;
  name: Path<T>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export const ContactsSearchInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rules,
  required,
}: Props<T>) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const debouncedInput = useDebounce(inputValue, 400);
  const { contactsQuery } = useGetContacts(debouncedInput);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
        const contact = contactsQuery.data?.find((c) => c.id === value) || null;

        return (
          <Autocomplete
            getOptionLabel={(option) => option.name}
            options={contactsQuery.data ?? []}
            loading={contactsQuery.isFetching}
            value={contact || selectedContact}
            onChange={(_, newValue) => {
              setSelectedContact(newValue);
              onChange(newValue?.id || null);
              setInputValue(newValue?.name || '');
            }}
            onInputChange={(_, newInputValue, reason) => {
              if (reason === 'input') {
                setInputValue(newInputValue);
              }
            }}
            isOptionEqualToValue={(option, selected) =>
              option.id === selected?.id
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                required={required}
                fullWidth
                inputRef={ref}
                error={!!error}
                size="small"
                helperText={error?.message}
              />
            )}
            renderOption={(props, option) => (
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
            )}
          />
        );
      }}
    />
  );
};

