import { Card, CardContent } from '@mui/material';

import { TextFieldElement } from 'react-hook-form-mui';
import { useServiceRequestFormContext } from '../hooks/useServiceRequestFormContext';

export const CustomsAgentForm = () => {
  const { form } = useServiceRequestFormContext();
  const { control } = form;

  return (
    <Card elevation={4} sx={{ borderRadius: 2 }}>
      <CardContent>
        <form className="grid grid-cols-3 md:grid-cols-3 gap-4">
          <TextFieldElement
            control={control}
            name="customsAgent.agency"
            label="Agencia Aduanal"
          />

          <TextFieldElement
            control={control}
            name="customsAgent.email"
            type="email"
            label="Correo Electrónico"
          />

          <TextFieldElement
            control={control}
            name="customsAgent.phone"
            label="Teléfono"
          />
        </form>
      </CardContent>
    </Card>
  );
};

