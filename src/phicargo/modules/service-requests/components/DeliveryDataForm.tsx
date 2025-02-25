import { AutocompleteElement, TextFieldElement } from 'react-hook-form-mui';
import { Card, CardContent } from '@mui/material';

import { DateTimePickerElement } from 'react-hook-form-mui/date-pickers';
import { useGetRoutes } from '../hooks/queries';
import { useServiceRequestFormContext } from '../hooks/useServiceRequestFormContext';

export const DeliveryDataForm = () => {
  const { form } = useServiceRequestFormContext();
  const { control, setValue } = form;

  const { selection, isLoading } = useGetRoutes();

  return (
    <Card elevation={4} sx={{ borderRadius: 2 }}>
      <CardContent>
        <form className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <DateTimePickerElement
            control={control}
            name="deliveryData.routeStart"
            label="Inicio de Ruta"
            required
            rules={{ required: 'Este campo es requerido' }}
          />
          <DateTimePickerElement
            control={control}
            name="deliveryData.arriveDate"
            label="Fecha de Llegada"
            required
            rules={{ required: 'Este campo es requerido' }}
          />

          <TextFieldElement
            control={control}
            name="deliveryData.company"
            label="Empresa"
          />

          <TextFieldElement
            control={control}
            name="deliveryData.phone"
            label="Teléfono"
          />

          <TextFieldElement
            control={control}
            name="deliveryData.email"
            type="email"
            label="Correo Electrónico"
          />

          <AutocompleteElement
            control={control}
            name="deliveryData.routeId"
            label="Ruta"
            loading={isLoading}
            textFieldProps={{ placeholder: 'Ruta' }}
            options={selection}
            autocompleteProps={{
              onChange: (_, value) => {
                setValue(
                  'deliveryData.routeId',
                  value?.id || (null as unknown as number),
                );
              },
            }}
          />

          <TextFieldElement
            control={control}
            name="deliveryData.loadingPoint"
            label="Punto de Carga"
          />

          <TextFieldElement
            control={control}
            name="deliveryData.unloadingPoint"
            label="Punto de Descarga"
          />

          <TextFieldElement
            control={control}
            name="deliveryData.postalCode"
            required
            type="text"
            rules={{
              required: 'Este campo es requerido',
              validate: (value) =>
                /^\d{5}$/.test(value) ||
                'El código postal debe tener 5 dígitos',
            }}
            label="Código Postal"
          />

          <TextFieldElement
            control={control}
            name="deliveryData.authorizedRoute"
            label="Ruta Autorizada"
          />

          <TextFieldElement
            control={control}
            name="deliveryData.authorizedStops"
            label="Paradas Autorizadas"
          />
        </form>
      </CardContent>
    </Card>
  );
};

