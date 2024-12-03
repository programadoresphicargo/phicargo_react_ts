import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@nextui-org/react';
import { CheckboxInput } from '../../core/components/inputs/CheckboxInput';
import { EmailInput } from '../../core/components/inputs/EmailInput';
import { PasswordInput } from '../../core/components/inputs/PasswordInput';
import { TextInput } from '../../core/components/inputs/TextInput';
import type { User } from '../../auth/models';
import type { UserUpdate } from '../models';
import { useUsersQueries } from '../hooks/useUsersQueries';

const initialState: UserUpdate = {
  username: '',
  name: '',
  email: '',
  role: 'Invitado',
  isActive: true,
  password: '',
};

interface Props {
  user?: User;
}

const UserForm = (props: Props) => {
  const { user } = props;

  const { control, handleSubmit } = useForm<UserUpdate>({
    defaultValues: user ? (user as unknown as UserUpdate) : initialState,
  });

  const {
    userUpdateMutattion: { mutate: updateUser, isPending },
  } = useUsersQueries();

  const onSubmit: SubmitHandler<UserUpdate> = (data) => {
    if (!user) {
      return;
    }

    updateUser({
      id: user?.id,
      updatedItem: data,
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 max-h-[430px] min-h-[430px] overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            control={control}
            name="username"
            label="Usuario"
            rules={!user ? { required: 'Este campo es requerido' } : {}}
          />

          <TextInput
            control={control}
            name="name"
            label="Nombre"
            rules={!user ? { required: 'Este campo es requerido' } : {}}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PasswordInput
            control={control}
            name="password"
            label="Contraseña"
            rules={!user ? { required: 'Este campo es requerido' } : {}}
          />

          <EmailInput
            control={control}
            name="email"
            label="Correo"
            rules={!user ? { required: 'Este campo es requerido' } : {}}
          />
        </div>

        <div className="flex items-center space-x-2">
          <CheckboxInput control={control} name="isActive" label="Activo" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" color="primary" isLoading={isPending}>
          Guardar
        </Button>
      </div>
    </form>
  );
};

export default UserForm;

