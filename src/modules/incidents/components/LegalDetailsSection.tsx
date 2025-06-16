import { Control, TextFieldElement } from 'react-hook-form-mui';
import { InputAdornment } from '@mui/material';
import { IncidentCreate } from '../models';

interface LegalDetailsSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<IncidentCreate, any>;
  damageCostDisabled: boolean;
  disabled?: boolean;
}

export function LegalDetailsSection({ control, damageCostDisabled, disabled }: LegalDetailsSectionProps) {
  return (
    <TextFieldElement
      control={control}
      name="damageCost"
      label="Coste de Daños"
      type="number"
      size="small"
      disabled={damageCostDisabled || disabled}
      rules={{
        validate: (value: number | null) =>
          value === null || value >= 0 || 'El coste debe ser positivo',
      }}
      helperText="Si no se conoce el coste, dejar en blanco"
      slotProps={{
        input: {
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        },
      }}
    />
  );
}
