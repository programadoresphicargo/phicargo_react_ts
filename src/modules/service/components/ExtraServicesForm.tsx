import { Card, CardContent } from '@mui/material';
import { CheckboxElement, TextFieldElement, UseFormReturn } from 'react-hook-form-mui';

import type { WaybillCreate } from '../models';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<WaybillCreate, any, undefined>;
  height?: string;
}

export const ExtraServicesForm = ({ form, height }: Props) => {
  const { control } = form;

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 4,
        padding: '2',
        boxShadow: 2,
        height: height ?? 'calc(100vh - 200px)',
        overflowY: 'auto',
      }} 
    >
      <CardContent>
        <h2 className="text-lg font-semibold mb-4 uppercase">
          Notas de Servicio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextFieldElement
            control={control}
            name="xEpp"
            multiline
            rows={4}
            className="w-full"
            label="Equipo de Protección Personal"
          />
          <TextFieldElement
            control={control}
            name="xEspecificacionesEspeciales"
            multiline
            rows={4}
            className="w-full"
            label="Especificaciones Especiales"
          />
        </div>

        <hr className="my-6 border-gray-300" />

        <h2 className="text-lg font-semibold mb-4 uppercase">
          Servicios Extras
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { name: 'xAlmacenaje', label: 'Almacenaje' },
            { name: 'xSeguro', label: 'Seguro' },
            { name: 'xBarrasLogisticas', label: 'Barras Logísticas' },
            { name: 'xDesconsolidacion', label: 'Desconsolidación' },
            { name: 'xPesaje', label: 'Pesaje' },
            { name: 'xReparto', label: 'Reparto' },
            { name: 'xPruebaCovid', label: 'Prueba de Covid' },
            {
              name: 'xManiobraCargaDescarga',
              label: 'Maniobra (Carga/Descarga)',
            },
            { name: 'xFumigacion', label: 'Fumigación' },
            { name: 'xResguardo', label: 'Resguardo' },
            { name: 'xConexionRefrigerado', label: 'Conexión Refrigerada' },
          ].map((service, index) => (
            <div key={index} className="flex items-center">
              <CheckboxElement
                control={control}
                // @ts-expect-error for improve
                name={service.name}
                label={service.label}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

