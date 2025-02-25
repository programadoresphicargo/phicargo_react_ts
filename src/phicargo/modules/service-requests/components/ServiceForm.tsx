import {
  AutocompleteElement,
  CheckboxElement,
  SelectElement,
  TextFieldElement,
} from 'react-hook-form-mui';

import { Button } from '@/components/ui/Button';
import { ContactsSearchInput } from '../../contacts/components/inputs/ContactsSearchInput';
import { InputAdornment } from '@mui/material';
import { useGetWaybillCategory } from '../hooks/queries';
import { useServiceRequestFormContext } from '../hooks/useServiceRequestFormContext';

export const ServiceForm = () => {
  const { form } = useServiceRequestFormContext();
  const { control, handleSubmit } = form;

  const { isLoading, selection } = useGetWaybillCategory();

  return (
    <form className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <SelectElement
        control={control}
        name="branchId"
        label="Sucursal"
        options={[
          { label: 'Veracruz', id: 1 },
          { label: 'Manzanillo', id: 9 },
          { label: 'México', id: 2 },
        ]}
        required
        rules={{ required: 'Elija una sucursal por favor' }}
      />
      <AutocompleteElement
        control={control}
        name="categoryId"
        label="Categoría"
        textFieldProps={{ placeholder: 'Categoría' }}
        options={selection}
        loading={isLoading}
        required
        rules={{ required: 'Elija una categoría por favor' }}
      />
      <SelectElement
        control={control}
        name="loadType"
        label="Tipo de Carga"
        options={[
          { label: 'Cargado', id: 'Cargado' },
          { label: 'Vacio', id: 'Vacio' },
        ]}
        required
        rules={{ required: 'Elija un tipo de carga por favor' }}
      />
      <ContactsSearchInput
        control={control}
        name="originAddressId"
        label="Dirección Origen"
        required
        rules={{ required: 'Este campo es requerido' }}
      />
      <SelectElement
        control={control}
        name="OwRtReference"
        label="Referencia OW/RT"
        options={[
          { label: 'OW', id: 'ow' },
          { label: 'RT', id: 'rt' },
        ]}
        rules={{ required: 'Este campo es requerido' }}
      />
      <TextFieldElement
        control={control}
        name="clientExecutive"
        label="Ejecutivo Cliente"
        rules={{ required: 'Este campo es requerido' }}
      />
      <TextFieldElement
        control={control}
        name="tariff"
        type="number"
        label="Tarifa"
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          },
        }}
      />
      <ContactsSearchInput
        control={control}
        name="clientId"
        label="Cliente"
        required
        rules={{ required: 'Seleccione un cliente por favor' }}
      />
      <SelectElement
        control={control}
        name="modality"
        label="Modalidad"
        options={[
          { label: 'FULL', id: 'full' },
          { label: 'SENCILLO', id: 'single' },
        ]}
        rules={{ required: 'Este campo es requerido' }}
      />
      <SelectElement
        control={control}
        name="serviceType"
        label="Tipo de Servicio"
        options={[
          { label: 'IMPORTACIÓN', id: 'imp' },
          { label: 'EXPORTACIÓN', id: 'exp' },
        ]}
        rules={{ required: 'Este campo es requerido' }}
      />
      <ContactsSearchInput
        control={control}
        name="destinationAddressId"
        label="Dirección Destino"
        placeholder="Dirección Destino"
        required
        rules={{ required: 'Seleccione una direccion por favor' }}
      />
      <TextFieldElement
        control={control}
        name="invoiceReference"
        label="Referencia Factura"
        rules={{ required: 'Este campo es requerido' }}
      />
      <TextFieldElement
        control={control}
        name="quotationNumber"
        label="Número de Cotización"
      />
      <div className="col-span-2 md:col-span-3 flex items-center space-x-2">
        <CheckboxElement
          control={control}
          name="isDangerous"
          label="Es Peligrosa"
        />
      </div>
      <div className="col-span-2 md:col-span-3 flex justify-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit((data) => console.log(data))}
        >
          Solicitar
        </Button>
      </div>
    </form>
  );
};

