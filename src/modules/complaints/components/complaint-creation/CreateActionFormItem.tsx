import { Control, Path } from 'react-hook-form-mui';
import { ComplaintActionCreate } from '../../models';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import { Button } from '@heroui/react';
import { AutocompleteInput, TextInput, TextareaInput } from '@/components/inputs';

interface ComplaintActionCreateForm {
  actions: ComplaintActionCreate[];
}

interface Props<T extends ComplaintActionCreateForm> {
  index: number;
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

      <AutocompleteInput
        control={control}
        name={`actions.${index}.type` as Path<T>}
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
        name={`actions.${index}.actionPlan` as Path<T>} // Aserción de tipo
        label="Acción"
        size="sm"
        variant='bordered'
        rules={{ required: "Obligatorio" }}
      />

      <TextInput
        control={control}
        name={`actions.${index}.responsible` as Path<T>}
        label="Responsable"
        size="sm"
        variant='bordered'
        rules={{ required: "Obligatorio" }}
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
          onPress={() => remove(index)}
          color="danger"
          size="sm"
          radius="full"
        >
          Eliminar acción
        </Button>
      </div>
    </div>
  );
};

