import type { ComplaintActionCreate } from '../../models';
import {
  Control, Path, useWatch,
} from 'react-hook-form';
import { Dialog, DialogContent } from '@mui/material';
import { Button } from '@heroui/react';
import { AutocompleteInput, TextInput, TextareaInput } from '@/components/inputs';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';


interface Props<T extends ComplaintActionCreate> {
  open: boolean;
  onClose: () => void;
  onClick: () => void;
  isLoading: boolean;
  control: Control<T, any>;
}

export const CreateActionsForm = <T extends ComplaintActionCreate>({
  open,
  onClose,
  onClick,
  isLoading,
  control,
}: Props<T>) => {

  const id = useWatch({
    control,
    name: `id` as Path<T>,
  }) as number;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth>
        <DialogContent>

          <Button onPress={onClick} isLoading={isLoading} radius='full' color={id ? "success" : "primary"} className='text-white'>{id ? "Guardar" : "Registrar"}</Button>

          <div className="flex flex-col gap-4 border p-4 rounded-md mt-2">

            <AutocompleteInput
              control={control}
              name={`type` as Path<T>}
              isDisabled
              label="Tipo"
              variant='bordered'
              size="sm"
              rules={{ required: "Obligatorio" }}
              items={[
                { key: 'plan de accion', value: 'Plan de acción' },
                { key: 'accion inmediata', value: 'Acción inmediata' },
              ]}
            />

            <TextareaInput
              control={control}
              name={`actionPlan` as Path<T>} // Aserción de tipo
              label="Acción"
              size="sm"
              variant='bordered'
              rules={{ required: "Obligatorio" }}
            />

            <TextInput
              control={control}
              name={`responsible` as Path<T>}
              label="Responsable"
              size="sm"
              variant='bordered'
              rules={{ required: "Obligatorio" }}
            />

            <DatePickerElement
              control={control}
              name={`commitmentDate` as Path<T>}
              label="Fecha Compromiso"
              inputProps={{
                size: 'small',
              }}
              required
              rules={{ required: 'Fecha Compromiso requerida' }}
            />
          </div>

        </DialogContent>
      </Dialog>
    </>
  );
};

