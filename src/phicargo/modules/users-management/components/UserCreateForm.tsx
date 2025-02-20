import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { SubmitHandler, useForm } from 'react-hook-form';

import { EmailInput } from '../../core/components/inputs/EmailInput';
import { PasswordInput } from '../../core/components/inputs/PasswordInput';
import { TextInput } from '../../core/components/inputs/TextInput';
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
    (<Modal isOpen={open} onOpenChange={onClose} size="lg">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col pb-2 bg-[#dadfeb]">
              <h3 className="font-bold text-xl text-center text-gray-800 uppercase">
                Crear Nuevo Usuario
              </h3>
            </ModalHeader>

            <ModalBody>
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                    <PasswordInput
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

                    <PasswordInput
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

                <div className="flex justify-end">
                  <Button type="submit" color="primary" isLoading={isPending}>
                    Guardar
                  </Button>
                </div>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>)
  );
};

