import type { ComplaintActionCreate } from '../../models';
import {
  Control, Path, useWatch,
} from 'react-hook-form';
import { Dialog, DialogContent } from '@mui/material';
import { Button, Progress } from '@heroui/react';
import { AutocompleteInput, TextInput, TextareaInput } from '@/components/inputs';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import { useUpdateComplaintActionMutation } from '../../hooks/mutations/useUpdateComplaintActionMutation';


interface Props<T extends ComplaintActionCreate> {
  open: boolean;
  onClose: () => void;
  onClick: () => void;
  isLoading: boolean;
  control: Control<T, any>;
  getValues: () => T;
}

export const CreateActionsForm = <T extends ComplaintActionCreate>({
  open,
  onClose,
  onClick,
  isLoading,
  control,
  getValues,
}: Props<T>) => {

  const id = useWatch({
    control,
    name: `id` as Path<T>,
  }) as number;

  const {
    updateComplaintActionMutation: { mutate, isPending },
  } = useUpdateComplaintActionMutation();

  const onUpdate = () => {
    const data = getValues();
    mutate(
      {
        id,
        updatedItem: data,
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth>
        <DialogContent>

          <Button onPress={id ? () => onUpdate() : onClick} isLoading={isLoading || isPending} radius='full' color={id ? "success" : "primary"} className='text-white'>{id ? "Guardar" : "Registrar"}</Button>

          {isPending && (<Progress isIndeterminate size='sm' color='success'></Progress>)}
          {isLoading && (<Progress isIndeterminate size='sm' color='primary'></Progress>)}

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

