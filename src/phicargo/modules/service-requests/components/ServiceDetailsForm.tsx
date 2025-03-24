import {
  AutocompleteElement,
  CheckboxElement,
  SelectElement,
  TextFieldElement,
  UseFormReturn,
} from 'react-hook-form-mui';
import { Card, CardContent } from '@mui/material';

import { WaybillCreate } from '../models';
import { useGetRoutes } from '../hooks/queries';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<WaybillCreate, any, undefined>;
  height?: string;
}

export const ServiceDetailsForm = ({ form, height }: Props) => {
  const { control, setValue } = form;

  const { selection, isLoading } = useGetRoutes();

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 4,
        padding: '2',
        boxShadow: 2,
        height: height ?? '32rem',
        overflowY: 'auto',
      }}
    >
      <CardContent>
        <h2 className="text-lg font-semibold mb-4 uppercase">
          Datos del Servicio
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <AutocompleteElement
            control={control}
            name="xRutaDestino"
            label="Ruta Destino"
            loading={isLoading}
            textFieldProps={{ placeholder: 'Ruta' }}
            options={selection}
            autocompleteProps={{
              getOptionKey: (option) => option.id,
              onChange: (_, value) => {
                setValue(
                  'xRutaDestino',
                  value?.id || (null as unknown as number),
                );
              },
            }}
          />
          <TextFieldElement
            control={control}
            name="xRutaBel"
            label="Ruta Programada"
          />
          <SelectElement
            control={control}
            name="xTipoBel"
            label="Tipo Armado"
            options={[
              { label: 'FULL', id: 'full' },
              { label: 'SENCILLO', id: 'single' },
            ]}
          />
          <SelectElement
            control={control}
            name="xTipo2Bel"
            label="Tipo Carga"
            options={[
              { label: 'CARGADO', id: 'Cargado' },
              { label: 'VACIO', id: 'Vacio' },
            ]}
          />
          <SelectElement
            control={control}
            name="xModoBel"
            label="Modo"
            options={[
              { label: 'IMP', id: 'imp' },
              { label: 'EXP', id: 'exp' },
            ]}
          />
          <TextFieldElement control={control} name="xClaseBel" label="Clase" />
          <TextFieldElement
            control={control}
            name="xMedidaBel"
            label="Medida"
          />
          <CheckboxElement
            control={control}
            name="dangerousCargo"
            label="Carga Peligrosa"
          />
        </div>
      </CardContent>
    </Card>
  );
};

