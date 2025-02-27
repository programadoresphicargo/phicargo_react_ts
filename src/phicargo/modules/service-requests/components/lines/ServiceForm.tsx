import { AutocompleteElement, TextFieldElement } from 'react-hook-form-mui';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
} from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { ShippedProductCreate } from '../../models';
import { useGetTransportableProducts } from '../../hooks/queries';

const initialValues: ShippedProductCreate = {
  productId: '' as unknown as number,
  weightEstimation: null as unknown as number,
  productUomQtyEst: 1,
  notes: '',
};

interface Props {
  onClose: () => void;
  addProduct: (newProduct: ShippedProductCreate) => void;
  product?: ShippedProductCreate;
}

export const ServiceForm = ({ onClose, product, addProduct }: Props) => {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: product || initialValues,
  });

  const { selection, isLoading } = useGetTransportableProducts();

  const onSubmit: SubmitHandler<ShippedProductCreate> = (data) => {
    addProduct(data);
    onClose();
  };

  return (
    <>
      <DialogTitle
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 15px',
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        })}
      >
        {'Añadir Servicio'}
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-4 mt-5">
          <AutocompleteElement
            control={control}
            name="productId"
            label="Servicio"
            loading={isLoading}
            options={selection}
            autocompleteProps={{
              onChange: (_, value) => {
                setValue('productId', value?.id || (null as unknown as number));
              },
            }}
            required
            rules={{ required: 'Servicio Requerido' }}
          />

          <TextFieldElement
            control={control}
            name="weightEstimation"
            label="Peso Estimado"
            placeholder="Peso estimado de la carga en toneladas"
            type="number"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="start">TON</InputAdornment>
                ),
              },
            }}
            required
            rules={{ required: 'Peso estimado requerido' }}
          />

          <TextFieldElement
            control={control}
            name="productUomQtyEst"
            label="Cantidad Estimada"
            placeholder="Cantidad estimada de la carga"
            type="number"
            required
            rules={{ required: 'Cantidad estimada requerido' }}
          />

          <TextFieldElement
            control={control}
            name="notes"
            label="Notas"
            placeholder="Referencia de contenedor o numero de bultos (carga suelta)"
            multiline
            rows={3}
            required
            rules={{ required: 'Notas requeridas' }}
          />
        </div>
      </DialogContent>
      <DialogActions sx={{ padding: '0' }}>
        <div className="flex justify-between w-full px-6 pb-4">
          <Button
            onClick={onClose}
            variant="outlined"
            color="error"
            size="small"
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Agregar
          </Button>
        </div>
      </DialogActions>
    </>
  );
};

