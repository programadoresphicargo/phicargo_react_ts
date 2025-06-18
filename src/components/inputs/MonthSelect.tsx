import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';

interface Props {
  defaultMonth?: string | number;
  onMonthChange?: (month: string | number) => void;
}

export const MonthSelect = ({ defaultMonth, onMonthChange }: Props) => {
  const [month, setMonth] = useState<string | number>(
    defaultMonth || new Date().getMonth() + 1,
  );

  const handleChange = (event: SelectChangeEvent<typeof month>) => {
    setMonth(event.target.value);
    onMonthChange?.(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="month-select-label">Mes</InputLabel>
      <Select
        labelId="month-select-label"
        id="month-select"
        value={month}
        label="Mes"
        onChange={handleChange}
        size='small'
      >
        <MenuItem value={1}>Enero</MenuItem>
        <MenuItem value={2}>Febrero</MenuItem>
        <MenuItem value={3}>Marzo</MenuItem>
        <MenuItem value={4}>Abril</MenuItem>
        <MenuItem value={5}>Mayo</MenuItem>
        <MenuItem value={6}>Junio</MenuItem>
        <MenuItem value={7}>Julio</MenuItem>
        <MenuItem value={8}>Agosto</MenuItem>
        <MenuItem value={9}>Septiembre</MenuItem>
        <MenuItem value={10}>Octubre</MenuItem>
        <MenuItem value={11}>Noviembre</MenuItem>
        <MenuItem value={12}>Diciembre</MenuItem>
      </Select>
    </FormControl>
  );
};

