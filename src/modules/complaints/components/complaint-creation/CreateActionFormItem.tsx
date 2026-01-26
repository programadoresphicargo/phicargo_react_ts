import { Control, Path, SelectElement, TextFieldElement } from 'react-hook-form-mui';

import { Button } from '@/components/ui';
import { ComplaintActionCreate } from '../../models';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';

interface ComplaintActionCreateForm {
  actions: ComplaintActionCreate[];
}

interface Props<T extends ComplaintActionCreateForm> {
  index: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any>;
  remove: (index?: number | number[]) => void;
}

export const CreateActionFormItem = <T extends ComplaintActionCreateForm>({
  control,
  index,
  remove,
}: Props<T>) => {
  return (
    <div className="flex flex-col gap-4 border p-4 rounded-md">

      <SelectElement
        control={control}
        name={`actions.${index}.type` as Path<T>}
        label="Tipo"
        size="small"
        required
        options={[
          { id: 'plan de accion', label: 'Plan de acción' },
          { id: 'accion inmediata', label: 'Acción inmediata' },
        ]}
      />

      <TextFieldElement
        control={control}
        name={`actions.${index}.actionPlan` as Path<T>} // Aserción de tipo
        label="Acción"
        size="small"
        required
        multiline
        minRows={3}
        rules={{ required: 'Acción requerida' }}
      />
      <TextFieldElement
        control={control}
        name={`actions.${index}.responsible` as Path<T>}
        label="Responsable"
        size="small"
        required
        rules={{ required: 'Responsable requerido' }}
      />
      <DatePickerElement
        control={control}
        name={`actions.${index}.commitmentDate` as Path<T>}
        label="Fecha Compromiso"
        inputProps={{
          size: 'small',
        }}
        required
        rules={{ required: 'Fecha Compromiso requerida' }}
      />

      <div className="flex justify-end">
        <Button
          onClick={() => remove(index)}
          variant="text"
          color="error"
          size="small"
        >
          Eliminar acción
        </Button>
      </div>
    </div>
  );
};

