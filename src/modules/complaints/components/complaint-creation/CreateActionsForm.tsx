import type { ComplaintActionCreate, ComplaintCreate } from '../../models';
import {
  Control,
  FieldArrayMethodProps,
  FieldArrayWithId,
} from 'react-hook-form';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button } from '@/components/ui';
import { CreateActionFormItem } from './CreateActionFormItem';
import dayjs from 'dayjs';

interface ComplaintActionCreateForm {
  actions: ComplaintActionCreate[];
}

interface Props<T extends ComplaintActionCreateForm> {
  fields: FieldArrayWithId<ComplaintCreate, 'actions', 'id'>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any>;
  remove: (index?: number | number[]) => void;
  append: (
    value: ComplaintActionCreate | ComplaintActionCreate[],
    options?: FieldArrayMethodProps,
  ) => void;
}

export const CreateActionsForm = <T extends ComplaintActionCreateForm>({
  fields,
  control,
  remove,
  append,
}: Props<T>) => {
  return (
    <>
      {fields.map((field, index) => (
        <CreateActionFormItem
          key={field.id}
          control={control}
          index={index}
          remove={remove}
        />
      ))}

      <Button
        onClick={() =>
          append({
            actionPlan: '',
            responsible: '',
            commitmentDate: dayjs(),
          })
        }
        variant="outlined"
        startIcon={<AddCircleIcon />}
        size="small"
      >
        Agregar acción
      </Button>
    </>
  );
};

