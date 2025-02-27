import { Card, CardContent } from '@mui/material';
import { SelectElement, TextFieldElement } from 'react-hook-form-mui';

import { useCreateServiceContext } from '../hooks/useCreateServiceContext';

export const EscortForm = () => {

  const { form } = useCreateServiceContext();

  const { control, watch } = form;

  const escorted = watch('xCustodiaBel') === 'SI';

  return (
    <Card elevation={4} sx={{ borderRadius: 2 }}>
      <CardContent>
        <form className="grid grid-cols-3 md:grid-cols-3 gap-4">
          <SelectElement
            control={control}
            name="xCustodiaBel"
            label="Custodia"
            size='small'
            options={[
              { label: 'Si', id: 'SI' },
              { label: 'No', id: 'NO' },
            ]}
            />

          <TextFieldElement
            control={control}
            disabled={!escorted}
            name="xNombreCustodios"
            size='small'
            label="Nombre de los custodios"
            />

          <TextFieldElement
            control={control}
            disabled={!escorted}
            name="xEmpresaCustodia"
            size='small'
            label="Empresa que realiza la custodia"
            />
          <TextFieldElement
            control={control}
            disabled={!escorted}
            name="xTelefonoCustodios"
            size='small'
            label="Teléfono de los custodios"
            />
          <TextFieldElement
            control={control}
            disabled={!escorted}
            name="xDatosUnidad"
            size='small'
            label="Datos de la unidad"
          />
        </form>
      </CardContent>
    </Card>
  );
};

