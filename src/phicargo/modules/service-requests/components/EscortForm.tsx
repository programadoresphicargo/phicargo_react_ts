import { Card, CardContent } from '@mui/material';
import { CheckboxElement, TextFieldElement } from 'react-hook-form-mui';

import { useServiceRequestFormContext } from '../hooks/useServiceRequestFormContext';

export const EscortForm = () => {
  const { form } = useServiceRequestFormContext();
  const { control, watch } = form;

  const escorted = watch('escort.escorted');

  return (
    <Card elevation={4} sx={{ borderRadius: 2 }}>
      <CardContent>
        <form className="grid grid-cols-3 md:grid-cols-3 gap-4">
          <CheckboxElement
            control={control}
            name="escort.escorted"
            label="Agencia Aduanal"
          />

          <TextFieldElement
            control={control}
            disabled={!escorted}
            name="escort.names"
            required={escorted}
            label="Nombres de los custodios"
          />

          <TextFieldElement
            control={control}
            disabled={!escorted}
            name="escort.phone"
            required={escorted}
            label="Teléfono"
          />
          <TextFieldElement
            control={control}
            disabled={!escorted}
            name="escort.company"
            required={escorted}
            label="Empresa que realiza la custodia"
          />
          <TextFieldElement
            control={control}
            disabled={!escorted}
            name="escort.details"
            required={escorted}
            label="Modelo, color y placas del vehículo"
          />
        </form>
      </CardContent>
    </Card>
  );
};

