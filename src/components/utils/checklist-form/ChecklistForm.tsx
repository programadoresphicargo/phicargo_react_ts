import { Button } from '../../ui/buttons';
import { SubmitHandler, useForm } from 'react-hook-form';
import type { ChecklistItem } from './types';
import { BooleanField } from './BooleanField';
import { PhotoField } from './PhotoField';
import { TextFieldElement } from 'react-hook-form-mui';

export type ChecklistFormProps = {
  items: ChecklistItem[];
  onSubmit: (values: Record<string, unknown>) => void;
  submitLabel?: string;
};

export const ChecklistForm: React.FC<ChecklistFormProps> = ({
  items,
  onSubmit,
  submitLabel = 'Enviar',
}) => {
  const {
    control,
    handleSubmit: formSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: getDefaultValues(items),
    mode: 'onBlur',
  });

  const handleSubmit: SubmitHandler<Record<string, unknown>> = (data) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={formSubmit(handleSubmit)}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.name}
            className={item.type === 'photo' ? 'sm:col-span-2' : ''}
          >
            {item.type === 'boolean' ? (
              <div className="flex items-center justify-between">
                <BooleanField
                  control={control}
                  label={item.label}
                  name={item.name}
                  rules={{
                    required: 'Este campo es obligatorio',
                  }}
                />
              </div>
            ) : item.type === 'photo' ? (
              <div>
                <PhotoField
                  item={item}
                  name={item.name}
                  errors={errors}
                  register={register}
                  watch={watch}
                />
              </div>
            ) : (
              <TextFieldElement
                control={control}
                name={item.name}
                label={item.label}
                rules={{
                  required: 'Este campo es obligatorio',
                }}
                fullWidth
                size="small"
              />
            )}
          </div>
        ))}
        <div className="col-span-1 sm:col-span-2">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="w-full"
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};

function getDefaultValues(items: ChecklistItem[]) {
  return items.reduce((acc, item) => {
    acc[item.name] = item.type === 'boolean' ? item.defaultValue ?? 'no' : '';
    return acc;
  }, {} as Record<string, unknown>);
}

