import { Button, MuiSaveButton } from '@/components/ui';
import { SubmitHandler, useForm } from 'react-hook-form';

import { MuiSimpleModal } from '@/components';
import { TextFieldElement } from 'react-hook-form-mui';
import { WorkshopCreate } from '../models';
import { useWorkshop } from '../hooks';

const initialFormValues: WorkshopCreate = {
  name: '',
};

interface AddWorkshopProps {
  open: boolean;
  onClose: () => void;
}

const AddWorkshop = (props: AddWorkshopProps) => {
  const { onClose, open } = props;

  const { control, handleSubmit, reset } = useForm<WorkshopCreate>({
    defaultValues: initialFormValues,
  });

  const {
    addWorkshopMutation: { mutate: addWorkshop, isPending },
  } = useWorkshop();

  const onSubmit: SubmitHandler<WorkshopCreate> = (data) => {
    addWorkshop(data, {
      onSuccess: () => {
        reset(initialFormValues);
        onClose();
      },
    });
  };

  return (
    <>
      <MuiSimpleModal
        open={open}
        onClose={onClose}
        header="Crear Nuevo Taller"
        customFooter={
          <>
            <Button color="error" onClick={onClose}>
              Cancelar
            </Button>
            <MuiSaveButton
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              loading={isPending}
            />
          </>
        }
      >
        <form className="p-3">
          <TextFieldElement
            control={control}
            name="name"
            label="Nombre del Taller"
            size="small"
            required
            rules={{ required: 'Este campo es requerido' }}
          />
        </form>
      </MuiSimpleModal>
    </>
  );
};

export default AddWorkshop;
