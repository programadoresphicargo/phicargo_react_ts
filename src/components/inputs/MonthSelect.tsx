import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState, useEffect } from 'react';

interface Props {
  defaultMonth?: string | number;
  inspectionType?: string;
  onMonthChange?: (month: string | number) => void;
}

export const MonthSelect = ({ defaultMonth, inspectionType, onMonthChange }: Props) => {
  const [month, setMonth] = useState<string | number>(
    defaultMonth || new Date().getMonth() + 1,
  );

  const [options, setOptions] = useState<{ value: number; label: string }[]>([]);

  useEffect(() => {
    if (inspectionType === 'legal') {
      // Trimestres
      setOptions([
        { value: 1, label: 'Enero, Febrero, Marzo' },
        { value: 2, label: 'Abril, Mayo, Junio' },
        { value: 3, label: 'Julio, Agosto, Septiembre' },
        { value: 4, label: 'Octubre, Noviembre, Diciembre' },
      ]);
    } else {
      // Meses normales
      setOptions([
        { value: 1, label: 'Enero' },
        { value: 2, label: 'Febrero' },
        { value: 3, label: 'Marzo' },
        { value: 4, label: 'Abril' },
        { value: 5, label: 'Mayo' },
        { value: 6, label: 'Junio' },
        { value: 7, label: 'Julio' },
        { value: 8, label: 'Agosto' },
        { value: 9, label: 'Septiembre' },
        { value: 10, label: 'Octubre' },
        { value: 11, label: 'Noviembre' },
        { value: 12, label: 'Diciembre' },
      ]);
    }
  }, [inspectionType]);

  const handleChange = (event: SelectChangeEvent<number | string>) => {
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
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

