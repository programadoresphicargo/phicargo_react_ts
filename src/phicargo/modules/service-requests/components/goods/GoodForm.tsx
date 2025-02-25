import { CheckboxElement, TextFieldElement } from 'react-hook-form-mui';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
} from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Good } from '../../models';
import { WaybillItemSearchInput } from './WaybillItemSearchInput';

const initialValues: Good = {
  description: '',
  quantity: null as unknown as number,
  udmSatId: null as unknown as number,
  isDangerous: false,
  packagingTypeId: null as unknown as number,
  dimensions: '',
  goodSatId: null as unknown as number,
  weight: null as unknown as number,
  hazardousMaterialKey: null as unknown as number,
};

interface Props {
  onClose: () => void;
  addGood: (good: Good) => void;
  good?: Good;
}

export const GoodForm = ({ onClose, good, addGood }: Props) => {
  const { control, handleSubmit, watch } = useForm<Good>({
    defaultValues: good || initialValues,
  });

  const isDangerous = watch('isDangerous');

  const onSubmit: SubmitHandler<Good> = (data) => {
    addGood(data);
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
        {'Añadir Mercancia'}
      </DialogTitle>
      <DialogContent>
        <div className="grid grid-cols-2 gap-4 mt-5">
          <TextFieldElement
            control={control}
            name="description"
            label="Descripción"
            placeholder="Descripción del producto"
            required
            rules={{ required: 'Descripción requerida' }}
          />
          <TextFieldElement
            control={control}
            name="quantity"
            label="Cantidad"
            type="number"
            placeholder="10"
            required
            rules={{ required: 'Cantidad requerida' }}
          />

          <TextFieldElement
            control={control}
            name="dimensions"
            label="Dimensiones"
            placeholder="0/0/0"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="start">PLG</InputAdornment>
                ),
              },
            }}
            required
            rules={{
              required: 'Dimensiones requerido',
              pattern: {
                value: /^\d+\/\d+\/\d+$/,
                message: 'Las dimensiones deben seguir el formato 0/0/0',
              },
            }}
          />
          <TextFieldElement
            control={control}
            name="weight"
            label="Peso"
            placeholder="Peso en kilogramos"
            type="number"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="start">KG</InputAdornment>
                ),
              },
            }}
            required
            rules={{ required: 'Dimesiones requerido' }}
          />
          <WaybillItemSearchInput
            itemType="sat-product"
            control={control}
            name="goodSatId"
            label="Producto SAT"
            required
            rules={{ required: 'Producto SAT requerido' }}
          />
          <WaybillItemSearchInput
            itemType="sat-uom"
            control={control}
            name="udmSatId"
            label="Unidad de Medida SAT"
            required
            rules={{ required: 'Unidad de Medida SAT requerida' }}
          />
          <WaybillItemSearchInput
            itemType="packaging-type"
            control={control}
            name="packagingTypeId"
            label="Tipo de Embalaje"
            required
            rules={{ required: 'Tipo de embalaje requerido' }}
          />
          <div className="flex items-center justify-center">
            <CheckboxElement
              control={control}
              name="isDangerous"
              label="Es peligroso"
            />
          </div>
          {isDangerous && (
            <WaybillItemSearchInput
              itemType="hazardous-material"
              control={control}
              name="hazardousMaterialKey"
              label="Material Peligroso"
              required
              rules={{ required: 'Material peligroso requerido' }}
            />
          )}
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

