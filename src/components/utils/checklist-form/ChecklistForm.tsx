import { Button } from '../../ui/buttons';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import type { ChecklistItem } from './types';
import { BooleanField } from './BooleanField';
import { PhotoField } from './PhotoField';
import { TextFieldElement } from 'react-hook-form-mui';

export type ChecklistFormProps = {
  items: ChecklistItem[];
  onSubmit: (values: Record<string, unknown>) => void;
  submitLabel?: string;
  isLoading?: boolean;
};

export const ChecklistForm: React.FC<ChecklistFormProps> = ({
  items,
  onSubmit,
  submitLabel = 'Enviar',
  isLoading = false,
}) => {
  const form = useForm({
    defaultValues: getDefaultValues(items),
    mode: 'onBlur',
  });

  const {
    control,
    handleSubmit: formSubmit,
    setError,
    clearErrors,
    watch,
  } = form;

  const validatePhotos = () => {
    let valid = true;
    items.forEach((item) => {
      if (item.type === 'photo' && item.photoCount) {
        const files = watch(item.name);
        if (!files || files === '' || typeof files !== 'object' || !('length' in files)) {
          setError(item.name, { type: 'manual', message: 'Debes subir al menos una foto' });
          valid = false;
        } else if ((files as FileList).length !== item.photoCount) {
          setError(item.name, { type: 'manual', message: `Debes subir exactamente ${item.photoCount} foto(s)` });
          valid = false;
        } else {
          clearErrors(item.name);
        }
      }
    });
    return valid;
  };

  const handleSubmit: SubmitHandler<Record<string, unknown>> = (data) => {
    if (!validatePhotos()) return;
    onSubmit(data);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={formSubmit(handleSubmit)}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.name}
              className={item.type === 'photo' ? 'sm:col-span-2' : ''}
            >
              {item.type === 'boolean' ? (
                <div className="flex items-center justify-between">
                  <BooleanField
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
              loading={isLoading}
            >
              {submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

function getDefaultValues(items: ChecklistItem[]) {
  return items.reduce((acc, item) => {
    acc[item.name] = item.type === 'boolean' ? item.defaultValue ?? 'no' : '';
    return acc;
  }, {} as Record<string, unknown>);
}

