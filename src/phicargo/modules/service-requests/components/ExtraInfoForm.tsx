import { Card, CardContent } from '@mui/material';
import { SelectElement, TextFieldElement, UseFormReturn } from 'react-hook-form-mui';

import { DateTimePickerElement } from 'react-hook-form-mui/date-pickers';
import { WaybillCreate } from '../models';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<WaybillCreate, any, undefined>
  maxHeight?: string
}

export const ExtraInfoForm = ({ form, maxHeight }: Props) => {
  const { control } = form;

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 4,
        padding: '2',
        boxShadow: 2,
        maxHeight: maxHeight ?? 'calc(100vh - 200px)',
        overflowY: 'auto',
      }} 
    >
      <CardContent>
        <h2 className="text-lg font-semibold mb-4 uppercase">Progrmación</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateTimePickerElement
            control={control}
            name="dateStart"
            className="w-full"
            label="Inicio Programado"
          />
          <DateTimePickerElement
            control={control}
            name="xDateArrivalShed"
            className="w-full"
            label="Llegada Programada"
          />
        </div>

        <hr className="my-6 border-gray-300" />

        <h2 className="text-lg font-semibold mb-4 uppercase">Carga</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <TextFieldElement
            control={control}
            name="xSubclienteBel"
            className="w-full"
            size="small"
            label="Subcliente"
          />
          <TextFieldElement
            control={control}
            name="xContactoSubcliente"
            className="w-full"
            size="small"
            label="Contacto"
          />
          <TextFieldElement
            control={control}
            name="xTelefonoSubcliente"
            className="w-full"
            label="Teléfono"
            size="small"
          />
          <TextFieldElement
            control={control}
            name="xCorreoSubcliente"
            type="email"
            className="w-full"
            size="small"
            label="Correo"
          />
        </div>

        <hr className="my-6 border-gray-300" />

        <h2 className="text-lg font-semibold mb-4 uppercase">Agente Aduanal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <TextFieldElement
            control={control}
            name="xNombreAgencia"
            className="w-full"
            size="small"
            label="Nombre de la Agencia"
          />
          <TextFieldElement
            control={control}
            name="xTelefonoAa"
            className="w-full"
            size="small"
            label="Teléfono"
          />
          <TextFieldElement
            control={control}
            name="xEmailAa"
            className="w-full"
            type="email"
            label="Correo"
            size="small"
          />
        </div>

        <hr className="my-6 border-gray-300" />

        <h2 className="text-lg font-semibold mb-4 uppercase">Custodia</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <SelectElement
            control={control}
            name="xCustodiaBel"
            className="w-full"
            label="Custodia"
            size="small"
            options={[
              { label: 'Si', id: 'si' },
              { label: 'No', id: 'no' },
            ]}
          />

          <TextFieldElement
            control={control}
            name="xEmpresaCustodia"
            className="w-full"
            size="small"
            label="Empresa de Custodia"
          />
          <TextFieldElement
            control={control}
            name="xNombreCustodios"
            className="w-full"
            size="small"
            label="Nombre de Custodios"
          />
          <TextFieldElement
            control={control}
            name="xTelefonoCustodios"
            className="w-full"
            label="Teléfono"
            size="small"
          />
          <TextFieldElement
            control={control}
            name="xDatosUnidad"
            className="w-full"
            label="Datos de la Unidad"
            size="small"
          />
        </div>
      </CardContent>
    </Card>
  );
};

