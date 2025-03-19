import {
  AutocompleteElement,
  SelectElement,
  TextFieldElement,
} from 'react-hook-form-mui';
import { Card, CardContent } from '@mui/material';

import { ContactsSearchInput } from '../../contacts/components/inputs/ContactsSearchInput';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import { useCreateServiceContext } from '../hooks/useCreateServiceContext';
import { useEffect } from 'react';
import { useGetWaybillCategory } from '../hooks/queries';

export const BasicInfoForm = () => {
  const { form } = useCreateServiceContext();
  const { control, setValue, watch } = form;

  const client = watch('partnerId');

  useEffect(() => {
    setValue('partnerOrderId', client);
    setValue('partnerInvoiceId', client);
    setValue('arrivalAddressId', client);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const { isLoading, selection } = useGetWaybillCategory();

  return (
    <Card elevation={1} sx={{
      maxHeight: 'calc(100vh - 200px)',
      overflowY: 'auto',
    }} className="rounded-lg p-2 shadow-md">
      <CardContent>
        <h2 className="text-lg font-semibold mb-4 uppercase">Información Inicial</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <SelectElement
            control={control}
            name="storeId"
            label="Sucursal"
            options={[
              { label: 'Veracruz', id: 1 },
              { label: 'Manzanillo', id: 9 },
              { label: 'México', id: 2 },
            ]}
            size="small"
            required
            rules={{ required: 'Elija una sucursal por favor' }}
          />
          <SelectElement
            control={control}
            name="companyId"
            label="Compañía"
            options={[
              { label: 'Belchez', id: 1 },
              { label: 'Phicargo', id: 2 },
            ]}
            size="small"
            required
            rules={{ required: 'Elija una compañia por favor' }}
          />
          <DatePickerElement
            control={control}
            name="dateOrder"
            label="Fecha"
            inputProps={{ size: 'small' }}
            required
            rules={{ required: 'Elija una fecha por favor' }}
          />
        </div>
        <hr className="my-6 border-gray-300" />

        <h2 className="text-lg font-semibold mb-4 uppercase"></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <AutocompleteElement
            control={control}
            name="waybillCategory"
            label="Categoría"
            textFieldProps={{ placeholder: 'Categoría' }}
            autocompleteProps={{
              size: 'small',
              getOptionKey: (option) => option?.id,
              onChange: (_, value) => {
                setValue('waybillCategory', value?.id || (null as unknown as number));
              },
            }}
            options={selection}
            loading={isLoading}
            required
            rules={{ required: 'Elija una categoría por favor' }}
          />
          <ContactsSearchInput
            control={control}
            name="partnerId"
            label="Cliente"
            required
            rules={{ required: 'Cliente requerido' }}
          />
          <ContactsSearchInput
            control={control}
            name="partnerOrderId"
            label="Contacto"
            required
            rules={{ required: 'Cliente requerido' }}
          />
          <ContactsSearchInput
            control={control}
            name="departureAddressId"
            label="Dirección Origen"
            required
            rules={{ required: 'Dirección de origen requerida' }}
          />
          <TextFieldElement
            control={control}
            name="clientOrderRef"
            label="Referencia Cliente"
            size="small"
          />
        </div>
        <hr className="my-6 border-gray-300" />

        <h2 className="text-lg font-semibold mb-4 uppercase"></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <DatePickerElement
            control={control}
            name="expectedDateDelivery"
            label="Fecha Prevista"
            inputProps={{ size: 'small' }}
          />
          <ContactsSearchInput
            control={control}
            name="partnerInvoiceId"
            label="Dirección Facturación"
            required
            rules={{ required: 'Dirección de factura requerida' }}
          />
          <ContactsSearchInput
            control={control}
            name="arrivalAddressId"
            label="Dirección Destino"
            required
            rules={{ required: 'Dirección destino requerida' }}
          />
        </div>
        <hr className="my-6 border-gray-300" />

        <h2 className="text-lg font-semibold mb-4 uppercase"></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <SelectElement
            control={control}
            name="xReferenceOwr"
            label="Referencia OW/RT"
            options={[
              { label: 'OW', id: 'ow' },
              { label: 'RT', id: 'rt' },
            ]}
            size="small"
            required
            rules={{ required: 'Este campo es requerido' }}
          />
          <TextFieldElement
            control={control}
            name="xCodigoPostal"
            label="Código Postal"
            size="small"
            required
            rules={{ required: 'Este campo es requerido' }}
          />
          <TextFieldElement
            control={control}
            name="xEjecutivo"
            label="Ejecutivo"
            size="small"
          />
        </div>
        <hr className="my-6 border-gray-300" />

        <h2 className="text-lg font-semibold mb-4 uppercase"></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <TextFieldElement
            control={control}
            name="xReference"
            label="Referencia Contenedor"
            size="small"
          />
          <TextFieldElement
            control={control}
            name="xReference2"
            label="Referencia 2"
            size="small"
          />
          <TextFieldElement
            control={control}
            name="uploadPoint"
            label="Punto de Carga"
            size="small"
          />
          <TextFieldElement
            control={control}
            name="downloadPoint"
            label="Punto de Descarga"
            size="small"
          />
          <TextFieldElement
            control={control}
            name="xParadasAutorizadas"
            label="Paradas Autorizadas"
            size="small"
          />
          <TextFieldElement
            control={control}
            name="xRutaAutorizada"
            label="Ruta Autorizada"
            size="small"
          />
        </div>
      </CardContent>
    </Card>
  );
};

