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
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import type { WaybillItemKey } from '../../types';
import { useDebounce } from '@/phicargo/modules/core/hooks';
import { useGetItems } from '../../hooks/queries';

interface Props<T extends FieldValues> {
  itemType: WaybillItemKey;
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

export const WaybillItemSearchInput = <T extends FieldValues>({
  itemType,
  control,
  name,
  label,
  placeholder,
  rules,
  required,
}: Props<T>) => {
  const [inputValue, setInputValue] = useState('');

  const debouncedInput = useDebounce(inputValue, 400);
  const { itemsQuery } = useGetItems(itemType, debouncedInput);

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
      options={itemsQuery.data ?? []}
      loading={itemsQuery.isFetching}
      required={required}
      rules={rules}
      textFieldProps={{
        placeholder: placeholder,
      }}
      autocompleteProps={{
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
              <TurnedInIcon sx={{ color: 'text.secondary', marginRight: 1 }} />
              <Box>
                <Typography fontWeight="bold">{option.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Codigo: {option.code}
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
    //     const item = itemsQuery.data?.find((c) => c.id === value) || null;

    //     return (
    //       <Autocomplete
    //         getOptionLabel={(option) => option.name}
    //         options={itemsQuery.data ?? []}
    //         loading={itemsQuery.isFetching}
    //         value={item || selected}
    //         onChange={(_, newValue) => {
    //           setSelected(newValue);
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
    //             helperText={error?.message}
    //           />
    //         )}
    //         renderOption={(props, option) => (
    //           <li {...props} key={option.id}>
    //             <Box display="flex" alignItems="center">
    //               <TurnedInIcon
    //                 sx={{ color: 'text.secondary', marginRight: 1 }}
    //               />
    //               <Box>
    //                 <Typography fontWeight="bold">{option.name}</Typography>
    //                 <Typography variant="body2" color="text.secondary">
    //                   Codigo: {option.code}
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

