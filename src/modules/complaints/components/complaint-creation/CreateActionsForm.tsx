import type { ComplaintActionCreate, ComplaintForm } from '../../models';
import {
  Control,
  FieldArrayMethodProps,
  FieldArrayWithId,
} from 'react-hook-form';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { CreateActionFormItem } from './CreateActionFormItem';
import dayjs from 'dayjs';
import { Dialog, DialogContent } from '@mui/material';
import { Button } from '@heroui/react';

interface ComplaintActionCreateForm {
  actions: ComplaintActionCreate[];
}

interface Props<T extends ComplaintActionCreateForm> {
  open: boolean;
  onClose: () => void;
  onClick: () => void;
  isLoading: boolean;
  fields: FieldArrayWithId<ComplaintForm, 'actions', 'id'>[];
  control: Control<T, any>;
  remove: (index?: number | number[]) => void;
  append: (
    value: ComplaintActionCreate | ComplaintActionCreate[],
    options?: FieldArrayMethodProps,
  ) => void;
}

export const CreateActionsForm = <T extends ComplaintActionCreateForm>({
  open,
  onClose,
  onClick,
  isLoading,
  fields,
  control,
  remove,
  append,
}: Props<T>) => {
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth>
        <DialogContent>

          <Button onPress={onClick} isLoading={isLoading} radius='full' color='primary'>Guardar</Button>

          {fields.map((field, index) => (
            <CreateActionFormItem
              key={field.id}
              control={control}
              index={index}
              remove={remove}
            />
          ))}

          <Button
            color="success"
            onPress={() =>
              append({
                actionPlan: '',
                responsible: '',
                commitmentDate: dayjs(),
                type: '',
              })
            }
            startContent={<AddCircleIcon />}
            size="sm"
            className='text-white'
            radius='full'
          >
            Agregar acción
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

