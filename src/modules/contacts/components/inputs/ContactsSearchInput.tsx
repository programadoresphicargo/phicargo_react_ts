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

export const ContactsSearchInput = <T extends FieldValues>({
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
    if (selectedValue && inputValue !== selectedValue?.name) {
      setInputValue(selectedValue.name || '');
    }
  }, [inputValue, selectedValue]);

  return (
    <AutocompleteElement
      control={control}
      name={name}
      label={label}
      options={contactsQuery.data ?? []}
      loading={contactsQuery.isFetching}
      required={required}
      rules={rules}
      textFieldProps={{
        placeholder: placeholder,
        size: 'small',
      }}
      autocompleteProps={{
        getOptionKey: (option) => option.id,
        getOptionLabel: (option) => option.name,
        onInputChange: (_, newInputValue, reason) => {
          if (reason === 'input') {
            setInputValue(newInputValue);
          }
        },
        size: 'small',
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
    // <Controller
    //   name={name}
    //   control={control}
    //   rules={rules}
    //   render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
    //     const contact = contactsQuery.data?.find((c) => c.id === value) || null;

    //     return (
    //       <Autocomplete
    //         getOptionLabel={(option) => option.name}
    //         options={contactsQuery.data ?? []}
    //         loading={contactsQuery.isFetching}
    //         value={contact || selectedContact}
    //         onChange={(_, newValue) => {
    //           setSelectedContact(newValue);
    //           onChange(newValue?.id || null);
    //           setInputValue(newValue?.name || '');
    //         }}
    //         onInputChange={(_, newInputValue, reason) => {
    //           if (reason === 'input') {
    //             setInputValue(newInputValue);
    //           }
    //         }}
    //         isOptionEqualToValue={(option, selected) =>
    //           option.id === selected?.id
    //         }
    //         renderInput={(params) => (
    //           <TextField
    //             {...params}
    //             label={label}
    //             placeholder={placeholder}
    //             required={required}
    //             fullWidth
    //             inputRef={ref}
    //             error={!!error}
    //             size="small"
    //             helperText={error?.message}
    //           />
    //         )}
    //         renderOption={(props, option) => (
    //           <li {...props} key={option.id}>
    //             <Box display="flex" alignItems="center">
    //               <LocationOnIcon
    //                 sx={{ color: 'text.secondary', marginRight: 1 }}
    //               />
    //               <Box>
    //                 <Typography fontWeight="bold">{option.name}</Typography>
    //                 <Typography variant="body2" color="text.secondary">
    //                   {option.street}
    //                 </Typography>
    //               </Box>
    //             </Box>
    //           </li>
    //         )}
    //       />
    //     );
    //   }}
    // />
  );
};

