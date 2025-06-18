import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';

interface Props {
  defaultYear?: string | number;
  onYearChange?: (year: string | number) => void;
}

export const YearSelect = ({ defaultYear, onYearChange }: Props) => {
  const [year, setYear] = useState<string | number>(
    defaultYear || new Date().getFullYear(),
  );

  const handleChange = (event: SelectChangeEvent<typeof year>) => {
    setYear(event.target.value);
    onYearChange?.(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="year-select-label">Año</InputLabel>
      <Select
        labelId="year-select-label"
        id="year-select"
        value={year}
        label="Año"
        onChange={handleChange}
        size='small'
      >
        <MenuItem value={2025}>2025</MenuItem>
        <MenuItem value={2026}>2026</MenuItem>
        <MenuItem value={2027}>2027</MenuItem>
        <MenuItem value={2028}>2028</MenuItem>
        <MenuItem value={2029}>2029</MenuItem>
      </Select>
    </FormControl>
  );
};

