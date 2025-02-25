import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';

import TurnedInIcon from '@mui/icons-material/TurnedIn';
import { WaybillItem } from '../../models';
import type { WaybillItemKey } from '../../types';
import { useDebounce } from '@/phicargo/modules/core/hooks';
import { useGetItems } from '../../hooks/queries';
import { useState } from 'react';

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
  const [selected, setSelected] = useState<WaybillItem | null>(null);

  const debouncedInput = useDebounce(inputValue, 400);
  const { itemsQuery } = useGetItems(itemType, debouncedInput);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
        const item = itemsQuery.data?.find((c) => c.id === value) || null;

        return (
          <Autocomplete
            getOptionLabel={(option) => option.name}
            options={itemsQuery.data ?? []}
            loading={itemsQuery.isFetching}
            value={item || selected}
            onChange={(_, newValue) => {
              setSelected(newValue);
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
                helperText={error?.message}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <Box display="flex" alignItems="center">
                  <TurnedInIcon
                    sx={{ color: 'text.secondary', marginRight: 1 }}
                  />
                  <Box>
                    <Typography fontWeight="bold">{option.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Codigo: {option.code}
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

