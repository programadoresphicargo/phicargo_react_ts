import { ComplementCpCreate, WaybillItem } from '../../models';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
} from '@mui/material';
import { SelectElement, TextFieldElement } from 'react-hook-form-mui';
import { SubmitHandler, useForm } from 'react-hook-form';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button } from '@/components/ui/Button';
import { WaybillItemSearchInput } from './WaybillItemSearchInput';

const initialValues: ComplementCpCreate = {
  description: '',
  satProductId: '' as unknown as WaybillItem,
  quantity: 1,
  satUomId: '' as unknown as WaybillItem,
  dimensionsCharge: '',
  weightCharge: 1,
  hazardousMaterial: 'NO',
  hazardousKeyProductId: null,
  tipoEmbalajeId: null,
};

interface Props {
  onClose: () => void;
  addGood: (good: ComplementCpCreate) => void;
  good?: ComplementCpCreate;
}

export const GoodForm = ({ onClose, good, addGood }: Props) => {
  const { control, handleSubmit, watch } = useForm<ComplementCpCreate>({
    defaultValues: good || initialValues,
  });

  const isDangerous = watch('hazardousMaterial') === 'SI';

  const onSubmit: SubmitHandler<ComplementCpCreate> = (data) => {
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
            name="dimensionsCharge"
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
            name="weightCharge"
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
            name="satProductId"
            label="Producto SAT"
            required
            rules={{ required: 'Producto SAT requerido' }}
          />
          <WaybillItemSearchInput
            itemType="sat-uom"
            control={control}
            name="satUomId"
            label="Unidad de Medida SAT"
            required
            rules={{ required: 'Unidad de Medida SAT requerida' }}
          />
          <WaybillItemSearchInput
            itemType="packaging-type"
            control={control}
            name="tipoEmbalajeId"
            label="Tipo de Embalaje"
          />
          <SelectElement
            control={control}
            name="hazardousMaterial"
            label="Es peligroso"
            options={[
              { label: 'Si', id: 'SI' },
              { label: 'No', id: 'NO' },
            ]}
          />
          {isDangerous && (
            <WaybillItemSearchInput
              itemType="hazardous-material"
              control={control}
              name="hazardousKeyProductId"
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
            startIcon={<AddCircleIcon />}
          >
            Agregar
          </Button>
        </div>
      </DialogActions>
    </>
  );
};

