import { EmailInput, PasswordInput2, TextInput } from '@/components/inputs';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@heroui/react';
import { Modal } from '@/components';
import { SaveButton } from '@/components/ui';
import { UserCreate } from '../models';
import { useUsersQueries } from '../hooks/useUsersQueries';

const initialValues: UserCreate = {
  username: '',
  name: '',
  email: '',
  role: 'Invitado',
  isActive: true,
  password: '',
  pin: '',
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export const UserCreateForm = (props: Props) => {
  const { open, onClose } = props;

  const { control, handleSubmit, reset } = useForm<UserCreate>({
    defaultValues: initialValues,
  });

  const {
    userCreateMutation: { mutate: createUser, isPending },
  } = useUsersQueries();

  const onSubmit: SubmitHandler<UserCreate> = (data) => {
    createUser(data, {
      onSuccess: () => {
        reset(initialValues);
        onClose();
      },
    });
  };

  return (
    <Modal
      isOpen={open}
      onOpenChange={onClose}
      size="lg"
      header={
        <h3 className="font-bold text-xl text-center uppercase">
          Crear Nuevo Usuario
        </h3>
      }
      customFooter={
        <>
          <Button color="default" variant="light" size="sm" onPress={onClose}>
            Cerrar
          </Button>
          <SaveButton 
            color="primary" 
            isLoading={isPending} 
            onPress={() => handleSubmit(onSubmit)()}  
          />
        </>
      }
    >
      <form className="p-4 space-y-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              control={control}
              name="username"
              label="Usuario"
              rules={{
                required: 'Este campo es requerido',
                minLength: {
                  value: 4,
                  message: 'Debe tener al menos 4 caracteres',
                },
                maxLength: {
                  value: 50,
                  message: 'No puede tener más de 50 caracteres',
                },
              }}
            />

            <TextInput
              control={control}
              name="name"
              label="Nombre"
              rules={{
                required: 'Este campo es requerido',
                minLength: {
                  value: 1,
                  message: 'Debe tener al menos 1 carácter',
                },
                maxLength: {
                  value: 100,
                  message: 'No puede tener más de 100 caracteres',
                },
              }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <EmailInput control={control} name="email" label="Correo" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PasswordInput2
              control={control}
              name="password"
              label="Contraseña"
              rules={{
                required: 'Este campo es requerido',
                minLength: {
                  value: 6,
                  message: 'Debe tener al menos 8 caracteres',
                },
              }}
            />

            <PasswordInput2
              control={control}
              name="pin"
              label="Pin"
              rules={{
                required: 'Este campo es requerido',
                pattern: {
                  value: /^\d{4}$/,
                  message: 'Debe ser un PIN de 4 dígitos',
                },
              }}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

