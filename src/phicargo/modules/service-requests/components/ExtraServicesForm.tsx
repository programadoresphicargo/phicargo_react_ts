import { Card, CardContent } from '@mui/material';
import { CheckboxElement, TextFieldElement } from 'react-hook-form-mui';

import { useServiceRequestFormContext } from '../hooks/useServiceRequestFormContext';

export const ExtraServicesForm = () => {
  const { form } = useServiceRequestFormContext();
  const { control } = form;

  return (
    <Card elevation={4} sx={{ borderRadius: 2 }}>
      <CardContent>
        <form className="grid grid-cols-3 md:grid-cols-3 gap-4">
          <TextFieldElement
            control={control}
            name="extraServices.ppe"
            label="Equipo de Protección Personal"
          />
          <TextFieldElement
            control={control}
            name="extraServices.specifications"
            label="Especificaciones Especiales"
          />

          <div>
            <CheckboxElement
              control={control}
              name="extraServices.insurance"
              label="Seguro"
            />
            <CheckboxElement
              control={control}
              name="extraServices.logisticBars"
              label="Barras Logísticas"
            />
            <CheckboxElement
              control={control}
              name="extraServices.storage"
              label="Almacenaje"
            />
            <CheckboxElement
              control={control}
              name="extraServices.deconsolidation"
              label="Desconsolidación"
            />
            <CheckboxElement
              control={control}
              name="extraServices.weighing"
              label="Pesaje"
            />
            <CheckboxElement
              control={control}
              name="extraServices.distribution"
              label="Reparto"
            />
            <CheckboxElement
              control={control}
              name="extraServices.covidTest"
              label="Prueba de Covid"
            />
            <CheckboxElement
              control={control}
              name="extraServices.maneuver"
              label="Maniobra (Carga/Descarga)"
            />
            <CheckboxElement
              control={control}
              name="extraServices.fumigation"
              label="Fumigación"
            />
            <CheckboxElement
              control={control}
              name="extraServices.safeguarding"
              label="Resguardo"
            />
            <CheckboxElement
              control={control}
              name="extraServices.refrigeratedConnection"
              label="Conexión Refrigerada"
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

